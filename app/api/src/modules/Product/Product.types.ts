import { Document, ObjectId } from "mongoose";

export type Product = Document & {
  _id?: string;
  name: string;
  ownerId: ObjectId;
  category: "Haircare" | "Skincare" | "Make-up" | "Tools" | "Other";
  price: number;
  description: string;
  brandName: string;
  stock: number;
};
