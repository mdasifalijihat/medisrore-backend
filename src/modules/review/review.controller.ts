import { NextFunction, Request, Response } from "express";
import AppError from "../../middlewares/appErrors";
import { reviewServices } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { medicineId, rating, comment } = req.body;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await reviewServices.createReview(
      user.id,
      medicineId,
      rating,
      comment,
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getReviewsByMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;

    const result = await reviewServices.getReviewsByMedicine(
      medicineId as string,
    );

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewController = {
  createReview,
  getReviewsByMedicine,
};
