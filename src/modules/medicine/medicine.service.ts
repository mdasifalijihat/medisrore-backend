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
// const getAllMedicines = async (query: any) => {
//   const { search, category, minPrice, maxPrice } = query as {
//     search?: string;
//     category?: string;
//     minPrice?: string;
//     maxPrice?: string;
//   };

//   const filters: any = {};

//   // 🔍 Search by medicine name
//   if (search) {
//     filters.OR = [
//       {
//         name: {
//           contains: search.trim(),
//           mode: "insensitive",
//         },
//       },
//       {
//         description: {
//           contains: search.trim(),
//           mode: "insensitive",
//         },
//       },
//     ];
//   }

//   // 📂 Filter by category name
//   if (category) {
//     filters.category = {
//       name: {
//         contains: category,
//         mode: "insensitive",
//       },
//     };
//   }

//   // 💰 Price filtering
//   if (minPrice || maxPrice) {
//     filters.price = {};

//     if (minPrice) {
//       filters.price.gte = Number(minPrice);
//     }

//     if (maxPrice) {
//       filters.price.lte = Number(maxPrice);
//     }
//   }

//   const result = await prisma.medicine.findMany({
//     where: filters,
//     include: {
//       category: true,
//       seller: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//     },
//   });

//   return result;
// };

const getAllMedicines = async (query: any) => {
  const { search, categoryId } = query;

  const where: any = {};

  if (search) {
    where.name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const result = await prisma.medicine.findMany({
    where,
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
    where: { id: medicineId },
    data,
  });
};

// deleted method
const deleteMedicine = async (medicineId: string, sellerId: string) => {
  //check medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new AppError("medicine not found", 404);
  }

  //  ownership check
  if (medicine.sellerId !== sellerId) {
    throw new AppError(
      "Forbidden! You cannot delete another seller's medicine",
      403,
    );
  }

  await prisma.medicine.delete({ where: { id: medicineId } });
  return null;
};

export const medicineServices = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  getSellerMedicines,
  updateMedicine,
  deleteMedicine,
};
