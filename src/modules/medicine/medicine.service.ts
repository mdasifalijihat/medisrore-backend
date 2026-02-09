import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// post create
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

export const medicineServices = {
  createMedicine,
};
