import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardData,
  deleteProduct,
} from "@core/modules/dashboard/Dashboard.api";
import { getOrdersBySeller } from "@core/modules/order/Order.api";
import { DashboardData } from "@core/modules/dashboard/Dashboard.types";
import { Order } from "@core/modules/order/Order.types";
import { useAuth } from "@contexts/AuthContext";
import Loading from "../Loading/Loading";
import styles from "./Dashboard.module.css";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState<boolean>(false);
  const [showAllProducts, setShowAllProducts] = useState<boolean>(false);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "seller") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      const response = await getDashboardData();
      setData(response.data);
    };

    const fetchOrders = async () => {
      try {
        const ordersResponse = await getOrdersBySeller();
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchData();
    fetchOrders();
  }, [userRole, navigate]);

  if (!data) return <Loading />;

  const visibleProducts = showAllProducts
    ? data.products
    : data.products.slice(0, 5);

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Link to="/dashboard/products/create">Create Product</Link>
          <Link to="/dashboard/messages">View Messages</Link>
          <button onClick={() => setShowOrders(!showOrders)}>
            {showOrders ? "Hide Orders" : "View Orders"}
          </button>
        </aside>
        <main className={styles.mainContent}>
          {!showOrders && (
            <section>
              <h2>Products</h2>
              <ul className={styles.productList}>
                {visibleProducts.map((product) => (
                  <li key={product._id} className={styles.productItem}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>${product.price}</p>
                    <p>Stock: {product.stock}</p>
                    <Link
                      to={`/dashboard/products/edit/${product._id}`}
                      className={styles.actionButton}
                    >
                      Edit
                    </Link>
                    <button
                      className={styles.actionButton}
                      onClick={async () => {
                        await deleteProduct(product._id);
                        setData((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            products: prev.products.filter(
                              (p) => p._id !== product._id
                            ),
                          };
                        });
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              {data.products.length > 5 && (
                <button
                  className={styles.showMoreButton}
                  onClick={() => setShowAllProducts(!showAllProducts)}
                >
                  {showAllProducts ? "Show Less" : "Show More"}
                </button>
              )}
            </section>
          )}
          {showOrders && (
            <section>
              <h2>Orders</h2>
              {orders.length === 0 ? (
                <p>No orders placed yet.</p>
              ) : (
                <ul className={styles.orderList}>
                  {orders.map((order) => (
                    <li key={order._id} className={styles.orderItem}>
                      <h3>Order Number: {order._id}</h3>
                      <p>
                        Order Date:{" "}
                        {new Date(order.createdAt!).toLocaleDateString()}
                      </p>
                      <p>Total: ${order.total.toFixed(2)}</p>
                      <p>User Email: {order.userId.email}</p>
                      <p>
                        User Name: {order.userId.firstName}{" "}
                        {order.userId.lastName}
                      </p>
                      <h4>Items:</h4>
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.productId._id}>
                            <p>Product: {item.productId.name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
