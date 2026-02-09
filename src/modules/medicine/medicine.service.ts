import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

export const medicineServices = {
  createMedicine,
  getAllMedicines,
};
