import { Document, ObjectId } from "mongoose";

export type Product = Document & {
  _id?: string;
  name: string;
  ownerId: ObjectId;
  categoryId: ObjectId;
  price: number;
  description: string;
};
