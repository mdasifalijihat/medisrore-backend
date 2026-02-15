// cart.route.ts
import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { cartController } from "./cartController";

const router = express.Router();

router.post("/add", auth(UserRole.CUSTOMER), cartController.addToCart);
router.delete(
  "/:medicineId",
  auth(UserRole.CUSTOMER),
  cartController.removeFromCart,
);
router.get("/", auth(UserRole.CUSTOMER), cartController.getCart);

export const cartRouter = router;
