// cart.route.ts
import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { cartController } from "./cartController";

const router = express.Router();

router.post("/add", auth(UserRole.CUSTOMER), cartController.addToCart);
router.post("/remove", auth(UserRole.CUSTOMER), cartController.removeFromCart);

export const cartRouter = router;
