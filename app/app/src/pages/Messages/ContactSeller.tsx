import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createMessage } from "@core/modules/message/Message.api";
import { useAuth } from "@contexts/AuthContext";
import { getProductById } from "@core/modules/product/Product.api";
import styles from "./Messages.module.css";

const ContactSeller: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const [content, setContent] = useState<string>("");
  const { user, isAuthenticated } = useAuth();
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const productResponse = await getProductById(productId);
          setReceiverId(productResponse.data.ownerId);
        } catch (error) {
          console.error("Failed to fetch product", error);
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      alert("You need to be logged in to send a message.");
      return;
    }

    if (!user || !receiverId) {
      console.error("User is not authenticated or receiverId is not set");
      return;
    }

    try {
      const messageBody = {
        senderId: user._id,
        receiverId,
        productId: productId ?? "",
        content,
      };
      console.log("Sending message:", messageBody);
      await createMessage(messageBody);
      alert("Message sent!");
      setContent("");
      navigate("/messages");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className={styles.contactSeller}>
      <h2>Contact Seller</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message here"
      />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default ContactSeller;
