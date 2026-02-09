import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Create a new category
const createCategory = async (
  data: Omit<Category, "id" | "createdAt" | "medicines">,
) => {
  const result = await prisma.category.create({
    data: {
      ...data,
    },
  });
  return result;
};

// Get all categories


export const categoryServices = {
  createCategory,
  
};
