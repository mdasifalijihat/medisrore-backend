import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "1234567890";

async function seedAdmin() {
  try {
    // 1️⃣ check admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    // 2️⃣ signup admin via Better Auth (password auto-hashed)
    const response = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify({
          name: "Admin",
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          role: UserRole.ADMIN,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error("Admin signup failed: " + err);
    }

    // 3️⃣ auto verify email
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { emailVerified: true },
    });

    console.log("✅ Admin seeded successfully");
  } catch (error) {
    console.error("❌ Admin seed error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
