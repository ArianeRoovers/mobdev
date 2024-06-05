import { Express, Router } from "express";
import productRoutes from "../modules/Product/Product.routes";
import favoriteRoutes from "../modules/Favorite/Favorite.routes";
import messageRoutes from "../modules/Message/Message.routes";
import { errorHandler } from "../middleware/error/errorHandlerMiddleware";
import userPublicRoutes from "../modules/User/User.public.routes";
import userPrivateRoutes from "../modules/User/User.private.routes";
import cartRoutes from "../modules/Cart/Cart.routes";
import orderRoutes from "../modules/Order/Order.routes";
import dashboardRoutes from "../modules/Dashboard/Dashboard.routes";

import { authJwt } from "../middleware/auth/authMiddleware";

const registerRoutes = (app: Express) => {
  app.use("/", userPublicRoutes);
  app.use("/", productRoutes);

  const authRoutes = Router();
  authRoutes.use("/", dashboardRoutes);
  authRoutes.use("/", messageRoutes);
  authRoutes.use("/", userPrivateRoutes);
  authRoutes.use("/", favoriteRoutes);
  authRoutes.use("/", orderRoutes);
  authRoutes.use("/", cartRoutes);

  app.use(authJwt, authRoutes);

  // should be placed AFTER all routes
  app.use(errorHandler);
};

export { registerRoutes };
