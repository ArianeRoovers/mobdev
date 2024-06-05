import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { Order, OrderItem } from "./Order.types";


const orderItemSchema = new mongoose.Schema<OrderItem>({
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
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema<Order>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  validateModel(this);
  next();
});
const OrderModel = mongoose.model<Order>("Order", orderSchema);

export default OrderModel;
