import { NextFunction, Request, Response } from "express";
import AppError from "../../middlewares/appErrors";
import { orderServices } from "./order.service";

// create order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { address } = req.body;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }
    if (!address) {
      throw new AppError("Delivery address is required", 400);
    }
    const result = await orderServices.createOrder(user.id, address);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: result.order.id,
        totalPrice: result.totalPrice,
        paymentMethod: result.order.paymentMethod,
        paymentStatus: result.order.paymentStatus,
        status: result.order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET MY ORDERS
const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await orderServices.getMyOrders(user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ORDER
const getOrderById = async (
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

    if (!id || typeof id !== "string") {
      throw new AppError("Invalid order id", 400);
    }

    const result = await orderServices.getOrderById(id, user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const orderController = {
  createOrder,
  getMyOrders,
  getOrderById,
};
