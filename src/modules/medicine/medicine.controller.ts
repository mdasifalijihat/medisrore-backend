import { NextFunction, Request, Response } from "express";
import AppError from "../../middlewares/appErrors";
import { medicineServices } from "./medicine.service";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Invalid medicine data", 401);
    }
    const result = await medicineServices.createMedicine(
      req.body,
      user.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const medicineController = {
  createMedicine,
};
