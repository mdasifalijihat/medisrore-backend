import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = express.Router();

// customer only
router.post("/", auth(UserRole.CUSTOMER), reviewController.createReview);

// public
router.get("/medicine/:medicineId", reviewController.getReviewsByMedicine);

export const reviewRouter = router;
