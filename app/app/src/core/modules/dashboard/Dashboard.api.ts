import { API } from "@core/network/api";
import { DashboardData, ProductBody, MessageBody } from "./Dashboard.types";
import { Product } from "../product/Product.types";

// Fetch dashboard data
const getDashboardData = () => {
  return API.get<DashboardData>("/dashboard");
};

// Product-related API calls
const createProduct = (product: ProductBody) => {
  return API.post("/dashboard/products", product);
};

const updateProduct = (id: string, product: ProductBody) => {
  return API.patch(`/dashboard/products/${id}`, product);
};

const deleteProduct = (id: string) => {
  return API.delete(`/dashboard/products/${id}`);
};

const getProduct = (id: string) => {
  return API.get<Product>(`/dashboard/products/${id}`);
};

// Message-related API calls
const getMessages = () => {
  return API.get("/dashboard/messages");
};

const sendMessage = (message: MessageBody) => {
  return API.post("/dashboard/messages", message);
};

export {
  getDashboardData,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getMessages,
  sendMessage,
};
