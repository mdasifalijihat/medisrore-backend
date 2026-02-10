import { NextFunction, Request, Response } from "express";
import AppError from "../../middlewares/appErrors";
import { medicineServices } from "./medicine.service";

// cateate mothod
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
    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get medicines
const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await medicineServices.getAllMedicines(req.query);

    res.status(200).json({
      success: true,
      message: "Medicines retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get by id
const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await medicineServices.getMedicineById(id as string);

    if (!result) {
      throw new AppError("Medicine not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Medicine retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get seller medicine

const getSellerMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await medicineServices.getSellerMedicines(user.id as string);

    res.status(200).json({
      success: true,
      message: "Seller medicines retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// update seller medicine
const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError("Invalid medicine id", 400);
    }

    const result = await medicineServices.updateMedicine(
      id,
      user.id as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const medicineController = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  getSellerMedicines,
  updateMedicine,
};
