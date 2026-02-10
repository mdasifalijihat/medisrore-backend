import { prisma } from "../../lib/prisma";

/* =========================
   USERS
========================= */
const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED",
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

/* =========================
   MEDICINES
========================= */
const getAllMedicines = async () => {
  return prisma.medicine.findMany({
    include: {
      seller: { select: { id: true, name: true, email: true } },
      category: true,
    },
  });
};

const deleteMedicineByAdmin = async (medicineId: string) => {
  return prisma.medicine.delete({
    where: { id: medicineId },
  });
};

/* =========================
   ORDERS
========================= */
const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      orderItems: {
        include: {
          medicine: {
            include: { seller: { select: { id: true, name: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};


export const adminServices = {
  getAllUsers,
  updateUserStatus,
  getAllMedicines,
  deleteMedicineByAdmin,
  getAllOrders,
};
