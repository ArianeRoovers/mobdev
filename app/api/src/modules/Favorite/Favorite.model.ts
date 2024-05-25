import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { Favorite } from "./Favorite.types";

const favoriteSchema = new mongoose.Schema<Favorite>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const FavoriteModel = mongoose.model<Favorite>("Favorite", favoriteSchema);

export default FavoriteModel;
