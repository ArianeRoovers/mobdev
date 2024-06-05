import { Document, ObjectId } from "mongoose";

export type Order = Document & {
  _id?: string;
  userId: ObjectId;
  items: OrderItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type OrderItem = {
  productId: ObjectId;
  quantity: number;
  price: number;
};
