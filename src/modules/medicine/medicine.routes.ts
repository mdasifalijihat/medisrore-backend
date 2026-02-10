import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { medicineController } from "./medicine.controller";

const router = express.Router();

// post
router.post("/", auth(UserRole.SELLER), medicineController.createMedicine);
// get
router.get("/", medicineController.getAllMedicines);

// get by id
router.get("/:id", medicineController.getMedicineById);

// get by seller
router.get(
  "/seller/my-medicines",
  auth(UserRole.SELLER),
  medicineController.getSellerMedicines,
);
// update seller medicine
router.patch("/:id", auth(UserRole.SELLER), medicineController.updateMedicine);

// deleted method
router.delete("/:id", auth(UserRole.SELLER), medicineController.deleteMedicine);


export const medicineRouter: Router = router;
