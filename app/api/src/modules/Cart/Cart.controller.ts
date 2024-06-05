

import { Request, Response, NextFunction } from "express";
import CartModel from "./Cart.model";
import ProductModel from "../Product/Product.model";
import NotFoundError from "../../middleware/error/NotFoundError";

// Get the user's cart
const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const cart = await CartModel.findOne({ userId }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.status(200).json({ items: [] }); 
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

// Add item to the cart
const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as any).user?._id;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) {
        if (cart.items[itemIndex].quantity + quantity > product.stock) {
          return res
            .status(400)
            .json({ message: "Not enough stock available" });
        }
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

// Update item quantity in the cart
const updateItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as any).user?._id || "guest";
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (quantity > product.stock) {
        return res.status(400).json({ message: "Not enough stock available" });
      }

      cart.items[itemIndex].quantity = quantity;
    } else {
      throw new NotFoundError("Item not found in cart");
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating item quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

// Remove item from the cart
const removeItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user?._id || "guest";
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

const increaseItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user?._id || "guest";
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (cart.items[itemIndex].quantity + 1 > product.stock) {
        return res.status(400).json({ message: "Not enough stock available" });
      }

      cart.items[itemIndex].quantity += 1;
    } else {
      throw new NotFoundError("Item not found in cart");
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error increasing item quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

// Decrease item quantity in the cart
const decreaseItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user?._id || "guest";
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Math.max(
        0,
        cart.items[itemIndex].quantity - 1
      );
    } else {
      throw new NotFoundError("Item not found in cart");
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error decreasing item quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id || "guest";
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    cart.items = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

export {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  decreaseItemQuantity,
  increaseItemQuantity,
  clearCart,
};
