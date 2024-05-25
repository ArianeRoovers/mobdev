import { Document } from "mongoose";

export type ProductCategory = Document & {
  _id?: string;
  name: string;
};
