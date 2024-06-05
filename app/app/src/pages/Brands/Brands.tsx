import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBrands } from "@core/modules/user/User.api";
import Loading from "../Loading/Loading";
import styles from "./Brands.module.css";

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch brands");
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Brand Overview</h1>
      <ul className={styles.brandList}>
        {brands.map((brand, index) => (
          <li key={index} className={styles.brandItem}>
            <Link to={`/brand/${brand}`}>{brand}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Brands;
