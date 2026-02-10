
---

```markdown
# 🏥 MediStore 💊
**"Your Trusted Online Medicine Shop"**

---

## 📝 Project Overview
MediStore is a full-stack e-commerce web application for purchasing over-the-counter (OTC) medicines. Customers can browse medicines, add to cart, place orders, and leave reviews. Sellers manage their inventory and fulfill orders. Admins oversee the platform and manage all users, categories, and orders.

---

## 👤 Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **Admin** | Platform moderator | Manage users, medicines, orders, categories |
| **Seller** | Pharmacy / Medicine vendor | Manage own medicines, view & update orders |
| **Customer** | User / Buyer | Browse medicines, manage cart, place orders, leave reviews |

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** JWT + Role-based
- **Frontend:** (Optional) React + Tailwind CSS / DaisyUI

---

## 🗄️ Database Schema

### Users Table
- **id**: string (UUID)
- **name**: string
- **email**: string (unique)
- **password**: string (hashed)
- **role**: ADMIN / SELLER / CUSTOMER
- **status**: ACTIVE / BANNED
- **createdAt**: DateTime
- **updatedAt**: DateTime

> Admin/Seller/Customer share the same table; role distinguishes them.

---

### Categories
- **id**: string (UUID)
- **name**: string (unique)
- **createdAt**: DateTime

---

### Medicines
- **id**: string (UUID)
- **name**: string
- **price**: float
- **stock**: int
- **description**: string
- **categoryId**: string (FK → Categories)
- **sellerId**: string (FK → Users)
- **createdAt**: DateTime

---

### Cart (Customer)
- **id**: string (UUID)
- **userId**: string (FK → Users)
- **medicineId**: string (FK → Medicines)
- **quantity**: int

---

### Orders
- **id**: string (UUID)
- **userId**: string (FK → Users)
- **status**: PLACED | PROCESSING | SHIPPED | DELIVERED | CANCELLED
- **address**: string
- **createdAt**: DateTime

### OrderItems
- **id**: string (UUID)
- **orderId**: string (FK → Orders)
- **medicineId**: string (FK → Medicines)
- **price**: float
- **quantity**: int

---

### Reviews
- **id**: string (UUID)
- **userId**: string (FK → Users)
- **medicineId**: string (FK → Medicines)
- **rating**: int
- **comment**: string
- **createdAt**: DateTime

> Rule: Review can only be created if the order is **DELIVERED**.

---

## 🔐 Authentication

### Admin
- **Login Only**
- **Route:** `POST /api/auth/login`
- Role = ADMIN
- JWT generated for access
- Register route **does not exist**

### Seller
- **Register / Login**
- **Routes:** `POST /api/auth/register`, `POST /api/auth/login`
- Role = SELLER
- JWT generated for access

### Customer
- **Register / Login**
- **Routes:** `POST /api/auth/register`, `POST /api/auth/login`
- Role = CUSTOMER
- JWT generated for access

---

## 💻 Admin APIs

### Users
- `GET /api/admin/users` → Get all users
- `PATCH /api/admin/users/:id` → Ban / Unban user

### Medicines
- `GET /api/admin/medicines` → Get all medicines with seller info
- `DELETE /api/admin/medicines/:id` → Delete medicine

### Orders
- `GET /api/admin/orders` → Get all orders (with customer + seller info)

### Categories
- `POST /api/admin/categories` → Create category
- `PUT /api/admin/categories/:id` → Update category
- `DELETE /api/admin/categories/:id` → Delete category

> All admin routes protected with JWT + role check (ADMIN only).

---

## 💊 Seller APIs

### Medicines
- `POST /api/seller/medicines` → Add medicine (logged-in seller only)
- `PUT /api/seller/medicines/:id` → Update own medicine
- `DELETE /api/seller/medicines/:id` → Delete own medicine

### Orders
- `GET /api/seller/orders` → Get seller’s orders
- `PATCH /api/seller/orders/:id` → Update order status (PLACED → PROCESSING → SHIPPED → DELIVERED)

> All seller routes protected with JWT + role check (SELLER only).

---

## 🛒 Customer APIs

### Medicines
- `GET /api/medicines` → List all medicines (with filters)
- `GET /api/medicines/:id` → Get medicine details

### Cart
- `POST /api/cart` → Add to cart (increment quantity if exists)
- `GET /api/cart` → Get cart items
- `DELETE /api/cart/:id` → Remove item

### Orders
- `POST /api/orders` → Place order from cart
- `GET /api/orders` → Get user’s orders
- `GET /api/orders/:id` → Get order details

### Reviews
- `POST /api/reviews` → Create review (order must be DELIVERED)

---

## 🧩 Order Status Flow

```

PLACED → PROCESSING → SHIPPED → DELIVERED
\
→ CANCELLED (by customer before processing)

````

---

## 🌱 Admin Seed

- Server start or Prisma seed will create default admin:

```ts
{
  email: "admin@medistore.com",
  password: "admin123", // hashed
  role: ADMIN
}
````

> This admin is used to login and manage the platform. Admin registration route does not exist.

---

## 🔒 Route Protection

* JWT authentication required
* Role-based middleware:

  * `ADMIN` → Admin routes
  * `SELLER` → Seller routes
  * `CUSTOMER` → Customer routes
* Unauthorized / forbidden requests return `401` or `403`.

---

## ✅ Notes

* Admin, Seller, Customer share the same `Users` table.
* Only role differentiates them.
* Orders, Medicines, and Reviews have strict foreign key & ownership rules.
* Cart operations are per-customer.
* Review creation restricted to delivered orders only.
* Seller can manage only their own medicines & related orders.

---

## 📂 File Structure (Backend)

```
/modules
  /admin
    admin.controller.ts
    admin.service.ts
    admin.routes.ts
  /auth
    auth.controller.ts
    auth.service.ts
    auth.routes.ts
  /medicine
    medicine.controller.ts
    medicine.service.ts
    medicine.routes.ts
  /category
    category.controller.ts
    category.service.ts
    category.routes.ts
  /order
    order.controller.ts
    order.service.ts
    order.routes.ts
  /review
    review.controller.ts
    review.service.ts
    review.routes.ts
  /cart
    cart.controller.ts
    cart.service.ts
    cart.routes.ts
/lib
  prisma.ts
  auth.ts
middlewares
  auth.ts
  globalErrorHandler.ts
  appErrors.ts
```

---
