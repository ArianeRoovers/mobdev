import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@core/modules/product/Product.types";
import { useAuth } from "@contexts/AuthContext";
import styles from "./ProductItem.module.css";

interface ProductItemProps {
  product: Product;
  favorites: Set<string>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  favorites,
  onToggleFavorite,
  onAddToCart,
}) => {
  useAuth();

  return (
    <div className={styles.productCard}>
      <div className={styles.productImagePlaceholder}>
        <button
          className={styles.favoriteButton}
          onClick={() => onToggleFavorite(product._id)}
        >
          {favorites.has(product._id) ? "❤️" : "🤍"}
        </button>
      </div>
      <div className={styles.productDetails}>
        <h2 className={styles.productTitle}>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h2>
        <p className={styles.productPrice}>€{product.price.toFixed(2)}</p>
        {product.stock === 0 ? (
          <p className={styles.soldOut}>SOLD OUT</p>
        ) : (
          <button
            className={styles.addToCartButton}
            onClick={() => onAddToCart(product._id)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
