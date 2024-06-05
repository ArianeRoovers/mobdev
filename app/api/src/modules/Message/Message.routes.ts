import express from "express";
import {
  createMessage,
  getMessagesByUser,
  getMessageDetail,
  updateMessageStatus,
} from "./Message.controller";
import { authJwt } from "../../middleware/auth/authMiddleware";

const router = express.Router();

router.post("/message", authJwt, createMessage);
router.get("/messages/:userId", authJwt, getMessagesByUser);
router.get("/message/:messageId", authJwt, getMessageDetail);
router.patch("/message/:messageId/status", authJwt, updateMessageStatus);

export default router;
