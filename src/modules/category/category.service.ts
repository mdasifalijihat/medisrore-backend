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
const getCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return categories;
};


const updateCategory = async (categoryId: string, name: string) => {
  return prisma.category.update({
    where: { id: categoryId },
    data: { name },
  });
};


const deleteCategory = async (categoryId: string) => {
  return prisma.category.delete({ where: { id: categoryId } });
};
export const categoryServices = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
