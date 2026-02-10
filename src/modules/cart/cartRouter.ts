// cart.route.ts
import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { cartController } from "./cartController";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), cartController.addToCart);

export const cartRouter = router;
