import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { ProductCategory } from "./ProductCategory.types";

const productCategorySchema = new mongoose.Schema<ProductCategory>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productCategorySchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const ProductCategoryModel = mongoose.model<ProductCategory>(
  "ProductCategory",
  productCategorySchema
);

export default ProductCategoryModel;
