

import { API } from "@core/network/api";
import { PopulatedCart } from "./Cart.types";

const getCart = () => {
  return API.get<PopulatedCart>("/cart");
};

const addItemToCart = (productId: string, quantity: number) => {
  return API.post<PopulatedCart>("/cart", { productId, quantity });
};

const removeItemFromCart = (productId: string) => {
  return API.delete<PopulatedCart>(`/cart/${productId}`);
};

const increaseItemQuantity = (productId: string) => {
  return API.patch<PopulatedCart>(`/cart/${productId}/increase`);
};

const decreaseItemQuantity = (productId: string) => {
  return API.patch<PopulatedCart>(`/cart/${productId}/decrease`);
};

const clearCartOnLogout = () => {
  return API.post("/cart/clear");
};

export {
  getCart,
  addItemToCart,
  removeItemFromCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCartOnLogout,
};
