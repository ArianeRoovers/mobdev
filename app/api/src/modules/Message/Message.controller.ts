import { Request, Response, NextFunction } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import MessageModel from "./Message.model";

// Create a message
const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { receiverId, productId, content } = req.body;
    const senderId = (req as AuthRequest).user._id;

    console.log("Creating message with payload:", {
      senderId,
      receiverId,
      productId,
      content,
    });

    if (!receiverId || !productId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const message = new MessageModel({
      senderId,
      receiverId,
      productId,
      content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (e) {
    console.error("Error creating message:", e);
    next(e);
  }
};

// Get messages by user
const getMessagesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user._id;
    const messages = await MessageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "firstName lastName")
      .populate("receiverId", "brandName")
      .populate("productId", "name");

    res.status(200).json(messages);
  } catch (e) {
    next(e);
  }
};

// Get message detail
const getMessageDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;
    const userId = (req as AuthRequest).user._id;

    const message = await MessageModel.findOne({
      _id: messageId,
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "firstName lastName")
      .populate("receiverId", "brandName")
      .populate("productId", "name");

    if (!message) {
      throw new NotFoundError("Message not found");
    }

    res.status(200).json(message);
  } catch (e) {
    next(e);
  }
};

const updateMessageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export {
  createMessage,
  getMessagesByUser,
  getMessageDetail,
  updateMessageStatus,
};
