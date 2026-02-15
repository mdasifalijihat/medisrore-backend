import express from "express";
import { categoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

router.patch("/:id", auth(UserRole.ADMIN), categoryController.editCategory);
router.delete("/:id", auth(UserRole.ADMIN), categoryController.removeCategory);

export const categoryRouter = router;
