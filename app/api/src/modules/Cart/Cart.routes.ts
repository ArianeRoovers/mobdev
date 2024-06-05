import { Router } from "express";
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  decreaseItemQuantity,
  increaseItemQuantity,
  clearCart,
} from "./Cart.controller";
import { authJwt } from "../../middleware/auth/authMiddleware";

const router: Router = Router();

router.get("/cart", authJwt, getCart);
router.post("/cart", authJwt, addItemToCart);
router.patch("/cart", authJwt, updateItemQuantity);
router.delete("/cart/:productId", authJwt, removeItemFromCart);
router.patch("/cart/:productId/increase", authJwt, increaseItemQuantity);
router.patch("/cart/:productId/decrease", authJwt, decreaseItemQuantity);
router.post("/cart/clear", authJwt, clearCart);

export default router;
