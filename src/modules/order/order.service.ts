import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../middlewares/appErrors";

// crate order
const createOrder = async (userId: string, address: string) => {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { medicine: true },
  });
  if (cartItems.length === 0) {
    throw new AppError("Cart is empty", 400);
  }
  // 2️⃣ create order
  const order = await prisma.order.create({
    data: {
      userId,
      address,
      status: OrderStatus.PLACED,
    },
  });

  // 3️⃣ create order items
  const orderItemsData = cartItems.map((item) => ({
    orderId: order.id,
    medicineId: item.medicineId,
    price: item.medicine.price,
    quantity: item.quantity,
  }));

  await prisma.orderItem.createMany({
    data: orderItemsData,
  });

  // 4️⃣ clear cart
  await prisma.cart.deleteMany({
    where: { userId },
  });

  return order;
};

// get my order
const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          medicine: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

//   GET SINGLE ORDER

const getOrderById = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!order || order.userId !== userId) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

export const orderServices = {
  createOrder,
  getMyOrders,
  getOrderById,
};
