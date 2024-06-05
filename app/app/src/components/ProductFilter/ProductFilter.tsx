import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ProductFilter.module.css";

const ProductFilter: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortOrder(event.target.value);
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams(location.search);
    if (sortOrder) {
      queryParams.set("sortOrder", sortOrder);
    } else {
      queryParams.delete("sortOrder");
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  return (
    <div className={styles.filterContainer}>
      <label className={styles.filterLabel}>Filter:</label>
      <select
        value={sortOrder}
        onChange={handleSortOrderChange}
        className={styles.filterSelect}
      >
        <option value="">Select</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <button className={styles.applyButton} onClick={handleApplyFilters}>
        Apply Filters
      </button>
    </div>
  );
};

export default ProductFilter;
