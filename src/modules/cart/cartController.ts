import { Request, Response, NextFunction } from "express";
import { cartServices } from "./cartServices";

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { medicineId, quantity } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await cartServices.addToCart(user.id, medicineId, quantity);

    res.status(201).json({
      success: true,
      message: "Added to cart",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cartController = {
  addToCart,
};
