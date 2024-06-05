
import { Product } from "../product/Product.types";

export type CartItem = {
  productId: string | Product;
  quantity: number;
};

export type PopulatedCartItem = {
  productId: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export type PopulatedCart = {
  items: PopulatedCartItem[];
};
