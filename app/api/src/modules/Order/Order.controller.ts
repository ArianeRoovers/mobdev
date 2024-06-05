import { Request, Response, NextFunction } from "express";
import CartModel from "../Cart/Cart.model";
import OrderModel from "../Order/Order.model";
import ProductModel from "../Product/Product.model";
import NotFoundError from "../../middleware/error/NotFoundError";
import { User } from "../User/User.types";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const cart = await CartModel.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          throw new NotFoundError(
            `Product with ID ${item.productId} not found`
          );
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
        };
      })
    );

    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = new OrderModel({
      userId,
      items,
      total,
    });

    // Update stock
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    await order.save();
    await CartModel.findOneAndDelete({ userId });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId)
      .populate("items.productId", "name _id")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const getOrdersByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const orders = await OrderModel.find({ userId })
      .populate("items.productId", "name _id")
      .lean();

    if (!orders || orders.length === 0) {
      return res.json([]);
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrdersBySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;

    const products = await ProductModel.find({ ownerId: user._id }).lean();
    const productIds = products.map((product) => product._id);

    const orders = await OrderModel.find({
      "items.productId": { $in: productIds },
    })
      .populate("items.productId", "name _id")
      .populate("userId", "firstName lastName email")
      .lean();

    if (!orders || orders.length === 0) {
      throw new NotFoundError("No orders found for this seller");
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export { createOrder, getOrderById, getOrdersByUser, getOrdersBySeller };
