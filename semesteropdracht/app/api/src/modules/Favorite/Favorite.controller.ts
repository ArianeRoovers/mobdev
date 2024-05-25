import { Request, Response, NextFunction } from "express";
import FavoriteModel from "./Favorite.model";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import NotFoundError from "../../middleware/error/NotFoundError";

// Add to favorites
const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.body;
    const userId = (req as AuthRequest).user._id;

    const favorite = new FavoriteModel({ userId, productId });
    await favorite.save();

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

// Remove from favorites
const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user._id;

    const favorite = await FavoriteModel.findOneAndDelete({ _id: id, userId });

    if (!favorite) {
      throw new NotFoundError("Favorite not found");
    }

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all favorites for the user
const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user._id;

    const favorites = await FavoriteModel.find({ userId }).populate(
      "productId"
    );

    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

export { addFavorite, removeFavorite, getFavorites };
