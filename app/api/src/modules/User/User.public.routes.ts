import { Router } from "express";
import { authJwt, authLocal } from "../../middleware/auth/authMiddleware";
import { login, updateUser, deleteUser } from "./User.controller";
import { register } from "./User.controller";

const router = Router();
router.post("/login", authLocal, login);
router.post("/register", register);
// router.patch("/users/:id", updateUser); > not implemented just incase
// router.delete("/users/:id", authJwt, deleteUser);    > not implemented just incase

export default router;
