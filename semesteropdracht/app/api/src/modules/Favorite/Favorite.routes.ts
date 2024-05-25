import { Router } from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "./Favorite.controller";
import { authJwt } from "../../middleware/auth/authMiddleware";

const router: Router = Router();

router.post("/favorites", authJwt, addFavorite);
router.delete("/favorites/:id", authJwt, removeFavorite);
router.get("/favorites", authJwt, getFavorites);

export default router;
