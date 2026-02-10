import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../middlewares/appErrors";

//  create method
const createMedicine = async (
  data: Omit<
    Medicine,
    "id" | "sellerId" | "createdAt" | "orderItems" | "reviews" | "carts"
  >,
  sellerId: string,
) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId,
    },
  });
  return result;
};

// get all method
const getAllMedicines = async (query: any) => {
  const { search, categoryId, minPrice, maxPrice } = query;

  const result = await prisma.medicine.findMany({
    where: {
      AND: [
        search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        categoryId ? { categoryId } : {},
        minPrice ? { price: { gte: Number(minPrice) } } : {},
        maxPrice ? { price: { lte: Number(maxPrice) } } : {},
      ],
    },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

// get by id
const getMedicineById = async (id: string) => {
  const result = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: true,
    },
  });

  return result;
};

// get seller medicines
const getSellerMedicines = async (sellerId: string) => {
  const result = await prisma.medicine.findMany({
    where: {
      sellerId,
    },
  });

  return result;
};

// update edicine (seller)

const updateMedicine = async (
  medicineId: string,
  sellerId: string,
  data: Partial<
    Omit<
      Medicine,
      "id" | "sellerId" | "createdAt" | "orderItems" | "reviews" | "carts"
    >
  >,
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new AppError("Medicine not found", 404);
  }

  // ownership check
  if (medicine.sellerId !== sellerId) {
    throw new AppError(
      "Forbidden! You cannot update another seller's medicine",
      403,
    );
  }

  return await prisma.medicine.update({
    where: { id: medicineId  },
    data,
  });
};

export const medicineServices = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  getSellerMedicines,
  updateMedicine,
};
