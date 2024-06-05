import { Product } from "../product/Product.types";

export type Favorite = {
  _id?: string;
  userId: string;
  productId: Product;
};
