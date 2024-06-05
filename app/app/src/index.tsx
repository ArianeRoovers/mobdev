import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Header from "@components/Header/Header";
import { AuthProvider } from "@contexts/AuthContext";
import Footer from "@components/Footer/Footer";
import { CartProvider } from "@contexts/CartContext";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <CartProvider>
          <AuthProvider>
            {/* <CartProvider> */}
            {/* <Search /> */}
            <Header />
            <App />
            <Footer />
            {/* </CartProvider> */}
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
