import { API } from "@core/network/api";
import { Message, MessageBody } from "./Message.types";

// Fetch messages by user
const getMessagesByUser = (userId: string) => {
  return API.get<Message[]>(`/messages/${userId}`);
};

// Fetch a single message detail
const getMessageDetail = (messageId: string) => {
  return API.get<Message>(`/message/${messageId}`);
};

// Create a new message
const createMessage = (message: MessageBody) => {
  return API.post<Message>("/message", message);
};

// Update message status
const updateMessageStatus = (messageId: string, status: boolean) => {
  return API.patch<Message>(`/message/${messageId}/status`, { status });
};

export {
  getMessagesByUser,
  getMessageDetail,
  createMessage,
  updateMessageStatus,
};
