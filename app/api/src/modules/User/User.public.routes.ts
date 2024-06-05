import { Router } from "express";
import { authLocal } from "../../middleware/auth/authMiddleware";
import { login, getAllBrands, getUserByBrandName } from "./User.controller";
import { register } from "./User.controller";

const router = Router();
router.post("/login", authLocal, login);
router.post("/register", register);

router.get("/brands", getAllBrands);
router.get("/users/brand/:brandName", getUserByBrandName);

export default router;
