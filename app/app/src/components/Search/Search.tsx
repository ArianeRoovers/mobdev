import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import styles from "./Search.module.css";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <form onSubmit={handleSearch} className={styles.form}>
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <img
              src="/svg/search.svg"
              alt="Search"
              className={styles.searchIcon}
            />
          </button>
        </form>
        <Link to="/">
          <img
            src="/images/Logo.png"
            alt="Beauty Bay Logo"
            className={styles.logo}
          />
        </Link>
        <Link to="/profile">
          <img src="/svg/profile.svg" alt="Profile" className={styles.icon} />
        </Link>
        {isAuthenticated && (
          <div className={styles.icons}>
            <Link to="/cart">
              <img src="/svg/cart.svg" alt="Cart" className={styles.icon} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
