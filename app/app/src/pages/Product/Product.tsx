import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  getProducts,
  getProductsByCategory,
} from "@core/modules/product/Product.api";
import { Product } from "@core/modules/product/Product.types";
import { useCart } from "@contexts/CartContext";
import { useAuth } from "@contexts/AuthContext";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "@core/modules/favorite/Favorite.api";
import ProductFilter from "@components/ProductFilter/ProductFilter";
import styles from "./Product.module.css";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { category } = useParams<{ category?: string }>();
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchProductsAndFavorites = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const sortOrder = searchParams.get("sortOrder") || undefined;

        const response = category
          ? await getProductsByCategory(category, sortOrder)
          : await getProducts(sortOrder);

        if (response?.data) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }

        if (isAuthenticated) {
          const favoritesResponse = await getFavorites();
          const favoriteProductIds = new Set(
            favoritesResponse.data.map((fav) => fav.productId?._id)
          );

          setFavorites(favoriteProductIds);
        }
      } catch (err) {
        setError("Error fetching products or favorites");
        console.error(err);
      }
    };

    fetchProductsAndFavorites();
  }, [category, isAuthenticated, location.search]);

  const handleToggleFavorite = async (productId: string) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to do this.");
      return;
    }

    try {
      if (favorites.has(productId)) {
        await removeFavorite(productId);
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productId);
          return newFavorites;
        });
      } else {
        await addFavorite(productId);
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.add(productId);
          return newFavorites;
        });
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to do this.");
      return;
    }

    const product = products.find((p) => p._id === productId);
    const cartItem = cart?.items.find(
      (item) => item.productId._id === productId
    );

    const currentQuantity = cartItem ? cartItem.quantity : 0;
    if (product && currentQuantity < product.stock) {
      try {
        await addToCart(productId, 1);
      } catch (error: any) {
        alert("Failed to add item to cart: " + error.response.data.message);
      }
    } else {
      alert("Sorry we don't have any more of that item!");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.productPage}>
      <ProductFilter />
      <h1 className={styles.pageTitle}>
        {category
          ? `All ${category.charAt(0).toUpperCase() + category.slice(1)}`
          : "All Products"}
      </h1>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product?._id} className={styles.productCard}>
            <div className={styles.productImagePlaceholder}></div>
            <div className={styles.productDetails}>
              <h2 className={styles.productTitle}>
                <Link to={`/product/${product?._id}`}>{product?.name}</Link>
              </h2>
              <p className={styles.productPrice}>
                €{product?.price?.toFixed(2)}
              </p>
              <button
                className={styles.favoriteButton}
                onClick={() => handleToggleFavorite(product?._id)}
              >
                {favorites.has(product?._id) ? "❤️" : "🤍"}
              </button>
              <button
                className={styles.addToCartButton}
                onClick={() => handleAddToCart(product?._id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
