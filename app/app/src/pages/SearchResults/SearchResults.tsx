import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProductsByQuery } from "@core/modules/product/Product.api";
import { Product } from "@core/modules/product/Product.types";
import ProductItem from "@components/ProductItem/ProductItem";
import { useCart } from "@contexts/CartContext";
import { useAuth } from "@contexts/AuthContext";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "@core/modules/favorite/Favorite.api";
import styles from "./SearchResults.module.css";

const SearchResults: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const location = useLocation();
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      const query = new URLSearchParams(location.search).get("query");
      if (query) {
        try {
          const response = await getProductsByQuery(query);
          setProducts(response.data);

          if (isAuthenticated) {
            const favoritesResponse = await getFavorites();
            const favoriteProductIds = new Set(
              favoritesResponse.data.map((fav) => fav.productId?._id)
            );

            setFavorites(favoriteProductIds);
          }
        } catch (err) {
          setError("Error fetching products");
        }
      }
    };

    fetchProducts();
  }, [location.search, isAuthenticated]);

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

  if (!products.length) {
    return <div>No products found</div>;
  }

  return (
    <div className={styles.searchResults}>
      {products.map((product) => (
        <ProductItem
          key={product._id}
          product={product}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};

export default SearchResults;
