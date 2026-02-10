import { Request, Response, NextFunction } from "express";
import { cartServices } from "./cartServices";
import AppError from "../../middlewares/appErrors";


// add to card 
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

// remove from cart 
const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { medicineId } = req.body;

    if (!user) throw new AppError("Unauthorized", 401);

    const result = await cartServices.removeFromCart(user.id, medicineId);
    res.status(200).json({
      success: true,
      message: "Removed from cart",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const cartController = {
  addToCart,
  removeFromCart,
};
