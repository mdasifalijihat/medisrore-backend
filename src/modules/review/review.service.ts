import AppError from "../../middlewares/appErrors";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";


const createReview = async (
  userId: string,
  medicineId: string,
  rating: number,
  comment: string,
) => {
  
  const hasDeliveredOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: OrderStatus.DELIVERED,
      orderItems: {
        some: {
          medicineId,
        },
      },
    },
  });

  if (!hasDeliveredOrder) {
    throw new AppError("You can review only after the order is delivered", 403);
  }

  // 2️⃣ prevent duplicate review
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      medicineId,
    },
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this medicine", 400);
  }

  // 3️⃣ create review
  const review = await prisma.review.create({
    data: {
      userId,
      medicineId,
      rating,
      comment,
    },
  });

  return review;
};

const getReviewsByMedicine = async (medicineId: string) => {
  return prisma.review.findMany({
    where: { medicineId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const reviewServices = {
  createReview,
  getReviewsByMedicine,
};
