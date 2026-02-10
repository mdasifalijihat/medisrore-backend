import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { sellerController } from "./seller.controller";

const router = Router();

// get all orders for seller
router.get("/", auth(UserRole.SELLER), sellerController.getSellerOrders);

// update order status
router.put(
  "/:orderId/status/",
  auth(UserRole.SELLER),
  sellerController.updateOrderStatus,
);

export const sellerOrderRouter = router;
