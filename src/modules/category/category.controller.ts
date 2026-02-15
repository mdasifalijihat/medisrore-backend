import { Request, Response, NextFunction } from "express";
import AppError from "../../middlewares/appErrors";
import { categoryServices } from "./category.service";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    if (!name) throw new AppError("Category name is required", 400);

    const result = await categoryServices.createCategory({ name });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryServices.getCategories();
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const editCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    console.log("osud name",name)
    const category = await categoryServices.updateCategory(id as string, name);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const removeCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const category = await categoryServices.deleteCategory(id as string);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
  editCategory,
  removeCategory,
};
