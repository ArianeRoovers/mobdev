import { Document, ObjectId } from "mongoose";

export type Message = Document & {
  _id?: string;
  senderId: ObjectId;
  receiverId: ObjectId;
  productId: ObjectId;
  content: string;
  status: boolean;
};
