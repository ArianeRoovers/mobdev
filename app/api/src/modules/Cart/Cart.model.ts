import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { Cart, CartItem } from "./Cart.types";

const cartItemSchema = new mongoose.Schema<CartItem>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema<Cart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      // type: String,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const CartModel = mongoose.model<Cart>("Cart", cartSchema);

export default CartModel;
