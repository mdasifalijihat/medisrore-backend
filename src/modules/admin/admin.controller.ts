import { Request, Response, NextFunction } from "express";
import { adminServices } from "./admin.service";

/* ===== USERS ===== */
const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await adminServices.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const changeUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await adminServices.updateUserStatus(id as string, status);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/* ===== MEDICINES ===== */
const getMedicines = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicines = await adminServices.getAllMedicines();
    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
};

const removeMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const medicine = await adminServices.deleteMedicineByAdmin(id as string);
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
};

/* ===== ORDERS ===== */
const getOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await adminServices.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getUsers,
  changeUserStatus,
  getMedicines,
  removeMedicine,
  getOrders,
};
