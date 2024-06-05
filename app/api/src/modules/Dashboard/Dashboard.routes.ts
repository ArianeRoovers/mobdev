import { Router } from "express";
import { authJwt } from "../../middleware/auth/authMiddleware";
import {
  getDashboard,
  createProduct,
  updateProduct,
  deleteProduct,
  getMessages,
  sendMessage,
  getProduct,
} from "./Dashboard.controller";

const router = Router();

router.get("/dashboard", authJwt, getDashboard);
router.post("/dashboard/products", authJwt, createProduct);
router.patch("/dashboard/products/:id", authJwt, updateProduct);
router.delete("/dashboard/products/:id", authJwt, deleteProduct);
router.get("/dashboard/messages", authJwt, getMessages);
router.post("/dashboard/messages", authJwt, sendMessage);
router.get("/dashboard/products/:id", getProduct);

export default router;
