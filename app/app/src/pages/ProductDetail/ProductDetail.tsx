import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@core/modules/product/Product.api";
import { Product } from "@core/modules/product/Product.types";
import { useCart } from "@contexts/CartContext";
import { useAuth } from "@contexts/AuthContext";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "@core/modules/favorite/Favorite.api";
import styles from "./ProductDetail.module.css";
import Loading from "../Loading/Loading";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error("ProductDetail component rendered without id");
      return;
    }

    const fetchProductAndFavorites = async () => {
      try {
        const productResponse = await getProductById(id);
        setProduct(productResponse.data);

        if (isAuthenticated) {
          const favoritesResponse = await getFavorites();
          const favoriteProductIds = new Set(
            favoritesResponse.data.map((fav) => fav.productId?._id)
          );
          setIsFavorite(favoriteProductIds.has(id));
        }
      } catch (err) {
        setError("Error fetching product details");
        console.error("Fetch error:", err);
      }
    };

    fetchProductAndFavorites();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async (productId: string) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to do this.");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(productId);
        setIsFavorite(false);
      } else {
        await addFavorite(productId);
        setIsFavorite(true);
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

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      alert("You need to be logged in to do this.");
      return;
    }
    navigate(`/product/${id}/contact-seller`);
  };

  if (!id) {
    return <div>Product ID is missing in the URL</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <Loading />;
  }

  const cartItem = cart?.items.find(
    (item) => item.productId._id === product._id
  );
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isDisabled = currentQuantity >= product.stock;

  return (
    <div className={styles.productDetailContainer}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        Back
      </button>
      <div className={styles.productDetail}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <button
              className={styles.favoriteButton}
              onClick={() => handleToggleFavorite(product._id)}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
          <div className={styles.thumbnailContainer}>
            <div className={styles.thumbnail}></div>
            <div className={styles.thumbnail}></div>
            <div className={styles.thumbnail}></div>
            <div className={styles.thumbnail}></div>
          </div>
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <p className={styles.productPrice}>€{product.price?.toFixed(2)}</p>
          <p className={styles.productBrand}>{product.brandName}</p>
          <p className={styles.productDescription}>{product.description}</p>
          {product.stock === 0 ? (
            <p className={styles.soldOut}>SOLD OUT</p>
          ) : (
            <div className={styles.buttonContainer}>
              <button
                className={styles.addToCartButton}
                onClick={() => handleAddToCart(product._id)}
                disabled={isDisabled}
              >
                Add to Cart
              </button>
              <button
                className={styles.contactSellerButton}
                onClick={handleContactSeller}
              >
                Contact Seller
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
