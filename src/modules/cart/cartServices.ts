import { prisma } from "../../lib/prisma";

// create add to card 
const addToCart = async (
  userId: string,
  medicineId: string,
  quantity: number,
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  const existing = await prisma.cart.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });

  if (existing) {
    return prisma.cart.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
      },
    });
  }

  return prisma.cart.create({
    data: {
      userId,
      medicineId,
      quantity,
    },
  });
};

export const cartServices = {
  addToCart,
};
