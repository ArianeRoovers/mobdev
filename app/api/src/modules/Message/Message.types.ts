import { Document, ObjectId } from "mongoose";

export type Message = Document & {
  _id?: string;
  senderId: ObjectId;
  receiverId: {
    _id: string;
    brandName: string;
  };
  productId: {
    _id: string;
    name: string;
  };
  content: string;
  status: boolean;
};
