import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  getCart as fetchCartApi,
  addItemToCart as addItemToCartApi,
  removeItemFromCart as removeItemFromCartApi,
  increaseItemQuantity as increaseItemQuantityApi,
  decreaseItemQuantity as decreaseItemQuantityApi,
  clearCartOnLogout as clearCartApi,
} from "@core/modules/cart/Cart.api";
import { PopulatedCart } from "@core/modules/cart/Cart.types";

interface CartContextType {
  cart: PopulatedCart | null;
  getCart: () => void;
  addToCart: (productId: string, quantity: number) => void;
  removeItemFromCart: (productId: string) => void;
  increaseItemQuantity: (productId: string) => void;
  decreaseItemQuantity: (productId: string) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<PopulatedCart | null>(null);

  const getCart = useCallback(async () => {
    try {
      const response = await fetchCartApi();
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  }, []);

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    try {
      const response = await addItemToCartApi(productId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  }, []);

  const removeItemFromCart = useCallback(async (productId: string) => {
    try {
      const response = await removeItemFromCartApi(productId);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  }, []);

  const increaseItemQuantity = useCallback(async (productId: string) => {
    try {
      const response = await increaseItemQuantityApi(productId);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to increase item quantity", error);
    }
  }, []);

  const decreaseItemQuantity = useCallback(async (productId: string) => {
    try {
      const response = await decreaseItemQuantityApi(productId);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to decrease item quantity", error);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await clearCartApi();
      setCart(null);
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        getCart,
        addToCart,
        removeItemFromCart,
        increaseItemQuantity,
        decreaseItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
