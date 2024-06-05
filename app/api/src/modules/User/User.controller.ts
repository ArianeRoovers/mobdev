import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import UserModel from "./User.model";
import bcrypt from "bcryptjs";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: user.generateToken(),
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req as AuthRequest;
  res.json(user);
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    phone_number,
    brandName,
  } = req.body;

  const user = new UserModel({
    firstName,
    lastName,
    email,
    password,
    role,
    phone_number,
    brandName,
  });

  try {
    await user.save();
    res.json({
      message: "User registered successfully",
    });
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { user } = req as AuthRequest;

    if (user._id.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this user" });
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await UserModel.find({ role: "seller" }).select("brandName");
    res.json(brands.map((brand) => brand.brandName));
  } catch (error) {
    next(error);
  }
};

const getUserByBrandName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { brandName } = req.params;
    const user = await UserModel.findOne({ brandName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export {
  login,
  getCurrentUser,
  register,
  updateUser,
  deleteUser,
  getAllBrands,
  getUserByBrandName,
};
