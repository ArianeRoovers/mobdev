import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./ProductCategory.controller";

const router: Router = Router();

router.post("/product-categories", createCategory);
router.get("/product-categories", getCategories);
router.get("/product-categories/:id", getCategoryById);
router.patch("/product-categories/:id", updateCategory);
router.delete("/product-categories/:id", deleteCategory);

export default router;
