import { NextFunction, Response, Request } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import ProductModel from "./Product.model";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sortOrder } = req.query;
    let sort: { [key: string]: 1 | -1 } = { name: 1 };

    switch (sortOrder) {
      case "asc":
        sort = { price: 1 };
        break;
      case "desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
    }

    const products = await ProductModel.find()
      .sort(sort)
      .lean()
      .populate("ownerId", ["firstName", "lastName", "brandName", "_id"]);

    res.json(products);
  } catch (e) {
    next(e);
  }
};

const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.params;
    const { sortOrder } = req.query;
    let sort: { [key: string]: 1 | -1 } = { name: 1 };

    switch (sortOrder) {
      case "asc":
        sort = { price: 1 };
        break;
      case "desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
    }

    const products = await ProductModel.find({ category })
      .sort(sort)
      .lean()
      .populate("ownerId", ["firstName", "lastName", "brandName", "_id"]);

    if (!products) {
      throw new NotFoundError("Products not found");
    }

    res.json(products);
  } catch (e) {
    next(e);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id)
      .lean()
      .populate("ownerId", ["firstName", "lastName", "brandName", "_id"]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

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

const searchProducts = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brandName: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching products" });
  }
};

const getProductsByBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { brandName } = req.params;
    const products = await ProductModel.find({ brandName });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getProductsByBrand,
};
