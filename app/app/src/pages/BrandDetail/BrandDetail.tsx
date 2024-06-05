import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByBrand } from "@core/modules/product/Product.api";
import { getUserByBrandName } from "@core/modules/user/User.api";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "@core/modules/favorite/Favorite.api";
import { useCart } from "@contexts/CartContext";
import { useAuth } from "@contexts/AuthContext";
import { Product } from "@core/modules/product/Product.types";
import Loading from "../Loading/Loading";
import styles from "./BrandDetail.module.css";

const BrandDetail: React.FC = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProductsByBrand(brandName || "");

        if (Array.isArray(productResponse.data)) {
          setProducts(productResponse.data);
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

        const sellerResponse = await getUserByBrandName(brandName || "");
        setSellerInfo(sellerResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products or seller information");
        setLoading(false);
      }
    };

    fetchData();
  }, [brandName, isAuthenticated]);

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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      {user?.role !== "seller" && (
        <Link to="/brands" className={styles.backButton}>
          Back to Brands
        </Link>
      )}
      <h1 className={styles.pageTitle}>{brandName} Products</h1>
      {sellerInfo && (
        <div className={styles.sellerInfo}>
          <h2 className={styles.sellerTitle}>About {sellerInfo.brandName}</h2>
          <p>{sellerInfo.bio}</p>
          <p>Phone number: {sellerInfo.phone_number}</p>
        </div>
      )}
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <div className={styles.productImagePlaceholder}></div>
            <div className={styles.productDetails}>
              <h2 className={styles.productTitle}>
                <Link to={`/product/${product._id}`}>{product.name}</Link>
              </h2>
              <p className={styles.productPrice}>€{product.price.toFixed(2)}</p>
              {product.stock === 0 ? (
                <p className={styles.soldOut}>SOLD OUT</p>
              ) : (
                <>
                  <button
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className={styles.favoriteButton}
                    onClick={() => handleToggleFavorite(product._id)}
                  >
                    {favorites.has(product._id) ? "💖" : "🤍"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandDetail;
