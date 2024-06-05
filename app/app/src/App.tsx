import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Notfound from "./pages/Notfound/Notfound";
import ProductPage from "./pages/Product/Product";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import ContactSeller from "./pages/Messages/ContactSeller";
import Messages from "./pages/Messages/UserMessages";
import SellerMessages from "./pages/Messages/SellerMessages";
import SearchResults from "./pages/SearchResults/SearchResults";
import Brands from "./pages/Brands/Brands";
import Login from "@components/auth/Login/Login";
import ProductManager from "@components/ProductManager/ProductManager";
import BrandDetail from "./pages/BrandDetail/BrandDetail";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Search from "@components/Search/Search";
import ROUTES from "./consts/Routes";
import "@styles/main.css";
import { useAuth } from "@contexts/AuthContext";
import Register from "@components/auth/Register/Register";

function App() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <div className="content-wrap">
        {user?.role !== "seller" && <Search />}

        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.brands} element={<Brands />} />
          <Route path={ROUTES.brandDetail} element={<BrandDetail />} />
          <Route path={ROUTES.search} element={<SearchResults />} />
          <Route path={ROUTES.products} element={<ProductPage />} />
          <Route path={ROUTES.productDetail} element={<ProductDetail />} />
          <Route path={ROUTES.productsByCategory} element={<ProductPage />} />
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.register} element={<Register />} />

          <Route path={ROUTES.notFound} element={<Notfound />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.profile} element={<Profile />} />
            <Route path={ROUTES.messages} element={<Messages />} />
            <Route path={ROUTES.cart} element={<Cart />} />
            <Route path={ROUTES.contactSeller} element={<ContactSeller />} />
            <Route path={ROUTES.order} element={<Order />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="seller" />}>
            <Route path={ROUTES.dashboard} element={<Dashboard />} />
            <Route path={ROUTES.sellerMessages} element={<SellerMessages />} />
            <Route path={ROUTES.productManager} element={<ProductManager />} />
            <Route path={ROUTES.editProduct} element={<ProductManager />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
