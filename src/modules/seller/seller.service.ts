import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../middlewares/appErrors";

// seller orders customer order
const getSellerOrders = async (sellerId: string) => {
  return prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          medicine: {
            sellerId,
          },
        },
      },
    },
    include: {
      orderItems: {
        include: {
          medicine: true,
        },
      },
      user: true,
    },
  });
};

// update order status seller
const updateOrderStatus = async (
  orderId: string,
  sellerId: string,
  status: OrderStatus,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // 🔐 seller ownership check
  const hasPermission = order.orderItems.some(
    (item) => item.medicine.sellerId === sellerId,
  );

  if (!hasPermission) {
    throw new AppError("Forbidden", 403);
  }

  try {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return updated;
  } catch (err: any) {
    console.error("Prisma Update Error:", err.message);
    throw new AppError("Failed to update order status", 500);
  }
};

export const sellerService = {
  getSellerOrders,
  updateOrderStatus,
};
