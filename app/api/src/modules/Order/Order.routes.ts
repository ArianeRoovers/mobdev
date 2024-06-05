import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getOrdersBySeller,
} from "./Order.controller";
import { authJwt } from "../../middleware/auth/authMiddleware";

const router: Router = Router();

router.post("/order", authJwt, createOrder);
router.get("/order/:orderId", authJwt, getOrderById);
router.get("/orders/user/:userId", authJwt, getOrdersByUser);
router.get("/orders/seller", authJwt, getOrdersBySeller);

export default router;
