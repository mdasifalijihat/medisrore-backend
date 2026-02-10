import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = express.Router();

// 🔐 Protect all routes for ADMIN only
router.use(auth(UserRole.ADMIN));

/* USERS */
router.get("/users", adminController.getUsers);
router.patch("/users/:id", adminController.changeUserStatus);

/* MEDICINES */
router.get("/medicines", adminController.getMedicines);
router.delete("/medicines/:id", adminController.removeMedicine);

/* ORDERS */
router.get("/orders", adminController.getOrders);

export const adminRouter = router;
