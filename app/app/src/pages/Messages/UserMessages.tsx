import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import {
  getMessagesByUser,
  createMessage,
  updateMessageStatus,
} from "@core/modules/message/Message.api";
import { Message } from "@core/modules/message/Message.types";
import styles from "./Messages.module.css";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<{
    [key: string]: Message[];
  }>({});
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setError("You need to be logged in to view this page.");
      return;
    }

    const fetchMessages = async () => {
      try {
        if (user) {
          const messagesResponse = await getMessagesByUser(user._id);
          const messagesData = messagesResponse.data;

          const groupedConversations: { [key: string]: Message[] } =
            messagesData.reduce(
              (acc: { [key: string]: Message[] }, message: Message) => {
                const key = [message.senderId._id, message.receiverId._id]
                  .sort()
                  .join("-");
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(message);
                return acc;
              },
              {}
            );

          setConversations(groupedConversations);
          setSelectedConversation(Object.keys(groupedConversations)[0] || null);
        }
      } catch (err) {
        setError("Error fetching messages");
        console.error(err);
      }
    };

    fetchMessages();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedConversation) {
      const updateStatus = async () => {
        const messages = conversations[selectedConversation];
        const unreadMessages = messages.filter((msg) => !msg.status);
        for (const message of unreadMessages) {
          await updateMessageStatus(message._id, true);
        }
      };
      updateStatus();
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      alert("You need to be logged in to send a message.");
      return;
    }

    if (!user || !selectedConversation) {
      console.error("User is not authenticated or no conversation selected");
      return;
    }

    try {
      const [user1, user2] = selectedConversation.split("-");
      const receiverId = user._id === user1 ? user2 : user1;

      const messageBody = {
        senderId: user._id,
        receiverId,
        productId: conversations[selectedConversation][0]?.productId?._id || "",
        content,
      };
      await createMessage(messageBody);
      // alert("Message sent!");
      setContent("");

      const messagesResponse = await getMessagesByUser(user._id);
      const messagesData = messagesResponse.data;

      const groupedConversations: { [key: string]: Message[] } =
        messagesData.reduce(
          (acc: { [key: string]: Message[] }, message: Message) => {
            const key = [message.senderId._id, message.receiverId._id]
              .sort()
              .join("-");
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(message);
            return acc;
          },
          {}
        );

      setConversations(groupedConversations);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className={styles.messages}>
      <Link to="/profile">Go back to profile</Link>
      <h1>Your Messages</h1>
      <div className={styles.conversations}>
        <div className={styles.conversationList}>
          <h2>Conversations</h2>
          {Object.keys(conversations).length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            <ul>
              {Object.keys(conversations).map((convKey) => (
                <li
                  key={convKey}
                  onClick={() => setSelectedConversation(convKey)}
                  className={
                    selectedConversation === convKey
                      ? styles.activeConversation
                      : ""
                  }
                >
                  {conversations[convKey][0]?.senderId?._id === user._id
                    ? conversations[convKey][0]?.receiverId?.brandName ||
                      "Unknown"
                    : conversations[convKey][0]?.senderId?.firstName ||
                      "Unknown"}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.conversationDetail}>
          {selectedConversation ? (
            <>
              <h2>
                Messages with{" "}
                {conversations[selectedConversation][0]?.senderId?._id ===
                user._id
                  ? conversations[selectedConversation][0]?.receiverId
                      ?.brandName || "Unknown"
                  : conversations[selectedConversation][0]?.senderId
                      ?.firstName || "Unknown"}
              </h2>
              <ul className={styles.messageList}>
                {conversations[selectedConversation].map((message) => (
                  <li
                    key={message._id}
                    className={`${styles.messageItem} ${
                      message.senderId._id === user._id
                        ? styles.userMessage
                        : styles.sellerMessage
                    }`}
                  >
                    <p>{message.content}</p>
                    <p>
                      Product:{" "}
                      {message.productId?.name || "Product has been deleted"}
                    </p>
                    <p>
                      Sent at: {new Date(message.createdAt).toLocaleString()}
                    </p>
                    <p>Status: {message.status ? "Read" : "Unread"}</p>
                  </li>
                ))}
              </ul>
              <div className={styles.messageInputContainer}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message here"
                  className={styles.messageInput}
                />
                <button
                  onClick={handleSendMessage}
                  className={styles.sendMessageButton}
                >
                  Send Message
                </button>
              </div>
            </>
          ) : (
            <p>Select a conversation to view messages</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
