import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  getProduct,
} from "@core/modules/dashboard/Dashboard.api";
import { useAuth } from "@contexts/AuthContext";
import Loading from "@components/Loading/Loading";
import styles from "./ProductManager.module.css";

const ProductManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<
    "Haircare" | "Skincare" | "Make-up" | "Tools" | "Other"
  >("Haircare");
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await getProduct(id);
          setName(response.data.name);
          setDescription(response.data.description);
          setPrice(response.data.price.toString());
          setCategory(response.data.category);
          setStock(response.data.stock);
        } catch (err) {
          if ((err as any).response && (err as any).response.status === 404) {
            setError("Product not found");
          } else {
            setError("Failed to fetch product data");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      brandName: user?.brandName || "",
      stock,
    };

    try {
      if (id) {
        await updateProduct(id, newProduct);
      } else {
        await createProduct(newProduct);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save product", error);
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
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>
          {id ? "Edit Product" : "Create Product"}
        </h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | "Haircare"
                    | "Skincare"
                    | "Make-up"
                    | "Tools"
                    | "Other"
                )
              }
              required
              className={styles.select}
            >
              <option value="Haircare">Haircare</option>
              <option value="Skincare">Skincare</option>
              <option value="Make-up">Make-up</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              required
              min="0"
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductManager;
