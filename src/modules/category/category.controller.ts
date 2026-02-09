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



export const categoryController = {
  createCategory,
  
};
