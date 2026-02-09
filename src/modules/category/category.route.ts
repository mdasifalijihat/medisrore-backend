import express from "express";
import { categoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.SELLER), categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

export const categoryRouter = router;
