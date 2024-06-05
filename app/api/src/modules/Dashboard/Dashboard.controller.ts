import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import ProductModel from "../Product/Product.model";
import MessageModel from "../Message/Message.model";
import NotFoundError from "../../middleware/error/NotFoundError";
import AuthError from "../../middleware/error/AuthError";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (user.role !== "seller") {
      throw new AuthError();
    }

    const products = await ProductModel.find({ ownerId: user._id }).lean();
    const messages = await MessageModel.find({ ownerId: user._id }).lean();

    res.json({
      products,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const product = new ProductModel({ ...req.body, ownerId: user._id });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    const product = await ProductModel.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    const product = await ProductModel.findOneAndDelete({
      _id: id,
      ownerId: user._id,
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).lean();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await MessageModel.find({
      ownerId: (req as AuthRequest).user._id,
    }).lean();
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = new MessageModel({
      ...req.body,
      ownerId: (req as AuthRequest).user._id,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
