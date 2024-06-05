import { Document, ObjectId } from "mongoose";

export type Cart = Document & {
  _id?: string;
  userId: ObjectId;
  items: CartItem[];
};

export type CartItem = {
  productId: ObjectId;
  quantity: number;
};
