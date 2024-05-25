import { Router } from "express";
import { authJwt } from "../../middleware/auth/authMiddleware";
import { getCurrentUser, updateUser, deleteUser } from "./User.controller";

const router = Router();
router.get("/users/current", getCurrentUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", authJwt, deleteUser);

export default router;
