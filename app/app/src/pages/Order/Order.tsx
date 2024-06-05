import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "@core/modules/order/Order.api";
import { Order as OrderType } from "@core/modules/order/Order.types";
import Loading from "../Loading/Loading";
import styles from "./Order.module.css";

const Order: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await getOrderDetails(orderId);
          setOrder(response.data);
        } catch (error) {
          console.error("Failed to fetch order details", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <Loading />;
  if (!order) return <div>Order not found</div>;

  return (
    <div className={styles.orderContainer}>
      <div className={styles.orderHeader}>
        <img src="/images/Logo.png" alt="BeautyBay" className={styles.logo} />
        <h2>Thank you for choosing BeautyBay!</h2>
        <p>
          Your order with number <strong>#{order._id}</strong> is being
          prepared,
          <br />
          you will receive an order confirmation via e-mail.
        </p>
        <h3>Order #{order._id}</h3>
      </div>
      <div className={styles.orderDetails}>
        {order.items.map((item) => (
          <div key={item.productId._id} className={styles.orderItem}>
            <div className={styles.itemImagePlaceholder}></div>
            <div className={styles.itemDetails}>
              <p className={styles.itemName}>{item.productId.name}</p>
              <p className={styles.itemBrand}>
                {
                  (
                    item.productId as {
                      _id: string;
                      name: string;
                      brandName: string;
                    }
                  ).brandName
                }
              </p>
              <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
              <p className={styles.itemPrice}>€{item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.orderSummary}>
        <p>Total: €{order.total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Order;
