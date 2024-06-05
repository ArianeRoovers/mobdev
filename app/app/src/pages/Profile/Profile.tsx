import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { getFavorites } from "@core/modules/favorite/Favorite.api";
import { getOrdersByUser } from "@core/modules/order/Order.api";
import { Product } from "@core/modules/product/Product.types";
import { Order } from "@core/modules/order/Order.types";
import UserSettingsForm from "@components/UserSettings/UserSettings";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showOrders, setShowOrders] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setError("You need to be logged in to view this page.");
      return;
    }

    if (user) {
      const fetchFavorites = async () => {
        try {
          const favoritesResponse = await getFavorites();
          const favoriteProducts = favoritesResponse.data.map(
            (fav) => fav.productId
          );
          setFavorites(favoriteProducts);
        } catch (err) {
          setError("Error fetching favorite products");
          console.error(err);
        }
      };

      const fetchOrders = async () => {
        if (!user || !user._id) {
          setError("User ID is missing");
          return;
        }

        try {
          const ordersResponse = await getOrdersByUser(user._id);
          setOrders(ordersResponse.data);
        } catch (err) {
          setError("Error fetching orders");
          console.error(err);
        }
      };

      fetchFavorites();
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <h1 className={styles.profileTitle}>Hello, {user.firstName}!</h1>
        <p className={styles.profileEmail}>Email: {user.email}</p>
        <h2 className={styles.sectionTitle}>Settings</h2>
        <button
          className={styles.settingsButton}
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings
            ? "I have changed my mind about settings"
            : "Update Settings"}
        </button>
        {showSettings && <UserSettingsForm />}
        {user.role === "user" && (
          <>
            <Link to="/messages" className={styles.messagesLink}>
              View Messages
            </Link>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Favorite Products</h2>
              {favorites.length === 0 ? (
                <p>No favorite products yet.</p>
              ) : (
                <ul className={styles.productList}>
                  {favorites.map((product) =>
                    product ? (
                      <li key={product._id} className={styles.productItem}>
                        <h3 className={styles.productName}>
                          <Link to={`/product/${product._id}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <p className={styles.productDescription}>
                          {product.description}
                        </p>
                        <p className={styles.productPrice}>
                          Price: €{product.price.toFixed(2)}
                        </p>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Orders</h2>
              <button
                className={styles.ordersButton}
                onClick={() => setShowOrders(!showOrders)}
              >
                {showOrders ? "Hide Orders" : "View Orders"}
              </button>
              {showOrders && (
                <>
                  {orders.length === 0 ? (
                    <p>No orders placed yet.</p>
                  ) : (
                    <ul className={styles.orderList}>
                      {orders.map((order) =>
                        order ? (
                          <li key={order._id} className={styles.orderItem}>
                            <h3 className={styles.orderNumber}>
                              Order Number: {order._id}
                            </h3>
                            <p className={styles.orderDate}>
                              Order Date:{" "}
                              {new Date(order.createdAt!).toLocaleDateString()}
                            </p>
                            <p className={styles.orderTotal}>
                              Total: €{order.total.toFixed(2)}
                            </p>
                            <h4 className={styles.itemsTitle}>Items:</h4>
                            <ul className={styles.itemsList}>
                              {order.items.map((item) =>
                                item ? (
                                  <li
                                    key={item.productId._id}
                                    className={styles.item}
                                  >
                                    <p className={styles.itemName}>
                                      Product: {item.productId.name}
                                    </p>
                                    <p className={styles.itemQuantity}>
                                      Quantity: {item.quantity}
                                    </p>
                                    <p className={styles.itemPrice}>
                                      Price: €{item.price.toFixed(2)}
                                    </p>
                                  </li>
                                ) : null
                              )}
                            </ul>
                          </li>
                        ) : null
                      )}
                    </ul>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
