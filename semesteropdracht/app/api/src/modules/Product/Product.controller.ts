import { NextFunction, Response, Request } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import ProductModel from "./Product.model";
import ProductCategoryModel from "../ProductCategory/ProductCategory.model";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel.find()
      .sort({ name: 1 })
      .lean()
      .populate("categoryId", ["name", "_id"])
      .populate("ownerId", ["firstName", "lastName", "_id"]);

    res.json(products);
  } catch (e) {
    next(e);
  }
};

const getProductDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({ _id: id })
      .lean()
      .populate("categoryId", ["name", "_id"])
      .populate("ownerId", ["firstName", "lastName", "_id"]);

    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    const category = await ProductCategoryModel.findOne({
      _id: req.body.categoryId,
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const product = new ProductModel({
      ...req.body,
      ownerId: user._id,
    });
    const result = await product.save();

    res.json(result);
  } catch (e) {
    next(e);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    // make sure category exists
    if (req.body.categoryId) {
      const category = await ProductCategoryModel.findOne({
        _id: req.body.categoryId,
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }
    }

    // Ensure the authenticated user is the owner of the product
    const product = await ProductModel.findOneAndUpdate(
      {
        _id: id,
        ownerId: user._id,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
};

const deleteProduct = async (
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
    res.json({});
  } catch (e) {
    next(e);
  }
};

export {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};
