import express from "express";
import { categoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SELLER),
  categoryController.getAllCategories,
);

router.patch("/:id", categoryController.editCategory);
router.delete("/:id", categoryController.removeCategory);

export const categoryRouter = router;
