import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.container}>
      <div className={styles.banner}>
        <h1 className={styles.bannerText}>Welcome to BeautyBay</h1>
      </div>
      <div className="flex justify-center mt-8">
        <Link to="/products">
          <button className={styles.discoverButton}>Discover</button>
        </Link>
      </div>
      <div className={styles.circlesContainer}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </main>
  );
};

export default Home;
