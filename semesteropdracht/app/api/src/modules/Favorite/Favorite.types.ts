import { Document, ObjectId } from "mongoose";

export type Favorite = Document & {
  _id?: string;
  userId: ObjectId;
  productId: ObjectId;
};
