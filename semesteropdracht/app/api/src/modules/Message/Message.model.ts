import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { Message } from "./Message.types";

const messageSchema = new mongoose.Schema<Message>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const MessageModel = mongoose.model<Message>("Message", messageSchema);

export default MessageModel;
