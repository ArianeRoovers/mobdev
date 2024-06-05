import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {!isAuthenticated ? (
              <>
                <li className={styles.navItem}>
                  <Link to="/products">All products</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/products/Haircare">Haircare</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/products/Skincare">Skincare</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/products/Make-up">Make-up</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/products/Tools">Tools</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/brands">Brands</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/login">
                    <button className={styles.navButton}>Login</button>
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/register">
                    <button className={styles.navButton}>Register</button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user && user.role === "seller" ? (
                  <>
                    <li className={styles.navItem}>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to={`/brand/${user.brandName}`}>My Store</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="/profile">Profile</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className={styles.navItem}>
                      <Link to="/products">All products</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="/products/Haircare">Haircare</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="/products/Skincare">Skincare</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="/products/Make-up">Make-up</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="/products/Tools">Tools</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="/brands">Brands</Link>
                    </li>
                  </>
                )}
                <li className={styles.navItem}>
                  <button className={styles.navButton} onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
