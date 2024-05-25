import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { Product } from "./Product.types";

const productSchema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductCategory",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const ProductModel = mongoose.model<Product>("Product", productSchema);

export default ProductModel;
