import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { orderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);
router.get("/", auth(UserRole.CUSTOMER), orderController.getMyOrders);
router.get("/:id", auth(UserRole.CUSTOMER), orderController.getOrderById);

export const orderRouter = router;
