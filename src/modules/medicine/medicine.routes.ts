import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { medicineController } from "./medicine.controller";

const router = express.Router();

router.post("/", auth(UserRole.SELLER), medicineController.createMedicine);
router.get("/", medicineController.getAllMedicines);

router.get("/:id", medicineController.getMedicineById);
router.get(
  "/seller/my-medicines",
  auth(UserRole.SELLER),
  medicineController.getSellerMedicines,
);

export const medicineRouter: Router = router;
