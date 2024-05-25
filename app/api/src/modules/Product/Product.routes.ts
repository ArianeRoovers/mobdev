import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProducts,
  updateProduct,
} from "./Product.controller";

const router: Router = Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductDetail);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
