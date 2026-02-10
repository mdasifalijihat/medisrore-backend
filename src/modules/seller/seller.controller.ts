import { NextFunction, Request, Response } from "express";
import AppError from "../../middlewares/appErrors";
import { sellerService } from "./seller.service";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

// get all order
const getSellerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) throw new AppError("Unauthorized", 401);

    const orders = await sellerService.getSellerOrders(user.id);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// update order status
const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seller = req.user; // must be SELLER
    const { orderId } = req.params;
    const { status } = req.body as { status: OrderStatus };

    if (!seller) throw new AppError("Unauthorized", 401);

    // check seller owns any item in the order
    const order = await prisma.order.findUnique({
      where: { id: orderId as string },
      include: { orderItems: { include: { medicine: true } } },
    });

    if (!order) throw new AppError("Order not found", 404);

    const hasPermission = order.orderItems.some(
      (item) => item.medicine.sellerId === seller.id,
    );

    if (!hasPermission) throw new AppError("Forbidden", 403);

    // update status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId as string },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

export const sellerController = {
  getSellerOrders,
  updateOrderStatus,
};
