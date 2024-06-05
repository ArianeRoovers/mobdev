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
    category: {
      type: String,
      required: true,
      enum: ["Haircare", "Skincare", "Make-up", "Tools", "Other"],
    },
    brandName: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
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
