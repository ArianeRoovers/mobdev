import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import UserModel from "./User.model";
import bcrypt from "bcryptjs";

const login = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req as AuthRequest;

  res.json({
    token: user.generateToken(),
  });
};

const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req as AuthRequest;
  res.json(user);
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // If the update includes a password, hash it before updating > fix later
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
    res.status(500).send({ message: "Error updating user" });
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, role, phone_number } = req.body;

  const user = new UserModel({
    firstName,
    lastName,
    email,
    password,
    role,
    phone_number,
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

//keep for later
// const getDashboard = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { user } = req as AuthRequest;

//     // how many notes?
//     const notes = await NoteModel.countDocuments({ ownerId: user._id });
//     // how many trips?
//     const trips = await TripModel.countDocuments({ ownerId: user._id });
//     //how many activities?
//     const activities = await ActivityModel.countDocuments({
//       ownerId: user._id,
//     });
//     //how many expenses?
//     const expenses = await ExpenseModel.countDocuments({ ownerId: user._id });

//     res.json({
//       notes,
//       trips,
//       activities,
//       expenses,
//     });
//   } catch (e) {
//     next(e);
//   }
// };

const deleteUser = async (req: Request, res: Response) => {
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
    console.log("Delete user error", error);
    res.status(500).send({ message: "Error deleting user" });
  }
};

export { login, getCurrentUser, register, updateUser, deleteUser };
