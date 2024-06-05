import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
  getProductsByCategory,
  searchProducts,
  getProductsByBrand,
} from "./Product.controller";
import { authJwt } from "../../middleware/auth/authMiddleware";

const router: Router = Router();

router.get("/products", getProducts);
router.get("/products/search", searchProducts);
router.get("/products/:category", getProductsByCategory);
router.get("/product/:id", getProductById);
router.post("/products", authJwt, createProduct);
router.patch("/products/:id", authJwt, updateProduct);
router.delete("/products/:id", authJwt, deleteProduct);
router.get('/products/brand/:brandName', getProductsByBrand);

export default router;
