import React, { useEffect, useState } from "react";
import { useCart } from "@contexts/CartContext";
import { useAuth } from "@contexts/AuthContext";
import { PopulatedCartItem } from "@core/modules/cart/Cart.types";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import { createOrder } from "@core/modules/order/Order.api";
import styles from "./Cart.module.css";

const Cart: React.FC = () => {
  const {
    cart,
    getCart,
    removeItemFromCart,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchCart = async () => {
      if (isAuthenticated) {
        await getCart();
        setLoading(false);
      } else {
        navigate("/login");
      }
    };

    checkAuthAndFetchCart();
  }, [getCart, isAuthenticated, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  if (!cart) {
    return <Loading />;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        Your cart is empty, browse products..
        <Link to="/products">
          <button className={styles.browseButton}>Browse</button>
        </Link>
      </div>
    );
  }

  const handleRemoveItem = async (productId: string) => {
    await removeItemFromCart(productId);
    await getCart();
  };

  const handleIncreaseQuantity = async (productId: string) => {
    const item = cart.items.find((item) => item.productId._id === productId);
    if (item && item.quantity < item.productId.stock) {
      increaseItemQuantity(productId);
      getCart();
    } else {
      alert("Cannot add more than available stock.");
    }
  };

  const handleDecreaseQuantity = async (productId: string) => {
    const item = cart.items.find((item) => item.productId._id === productId);
    if (item && item.quantity > 1) {
      await decreaseItemQuantity(productId);
      await getCart();
    } else {
      await handleRemoveItem(productId);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        userId: user._id,
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
      };
      const response = await createOrder(orderData);
      const { _id: orderId } = response.data;
      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error("Failed to create order", error);
    }
  };

  const totalPrice = cart.items.reduce((acc, item) => {
    const product = item.productId as PopulatedCartItem["productId"];
    return acc + (product.price || 0) * item.quantity;
  }, 0);

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Cart</h1>
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.items.map((item) => {
            const product = item.productId as PopulatedCartItem["productId"];
            return (
              <div key={product._id} className={styles.cartItem}>
                <div className={styles.itemImagePlaceholder}></div>
                <div className={styles.itemDetails}>
                  <h2 className={styles.itemTitle}>
                    {product.name || "Loading.."}
                  </h2>
                  <p className={styles.itemBrand}>
                    {product.brandName || "Loading.."}
                  </p>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleDecreaseQuantity(product._id)}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleIncreaseQuantity(product._id)}
                    >
                      +
                    </button>
                  </div>
                  <p className={styles.itemPrice}>
                    €{product.price ? product.price.toFixed(2) : "Loading..."}
                  </p>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(product._id)}
                  >
                    &#10005;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.cartSummary}>
          <h2>Total</h2>
          <p>Total (BTW included): €{totalPrice.toFixed(2)}</p>
          <input
            type="text"
            className={styles.promoInput}
            placeholder="Promotional code (optional)"
          />
          <button className={styles.buyButton} onClick={handleCheckout}>
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
