import { API } from "@core/network/api";
import { Product, ProductBody } from "./Product.types";

const getProductById = (id: string) => {
  return API.get<Product>(`/product/${id}`);
};

const getProducts = (sortOrder?: string) => {
  const queryParams = new URLSearchParams();
  if (sortOrder) queryParams.append("sortOrder", sortOrder);
  return API.get<Product[]>(`/products?${queryParams.toString()}`);
};

const createProduct = (product: ProductBody) => {
  return API.post<Product>("/products", product);
};

const updateProduct = async (id: string, product: ProductBody) => {
  try {
    const response = await API.patch<Product>(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error("Failed to update product", error);
    throw error;
  }
};

const deleteProduct = (id: string) => {
  return API.delete<Product>(`/products/${id}`);
};

const getProductsByCategory = (category: string, sortOrder?: string) => {
  const queryParams = new URLSearchParams();
  if (sortOrder) queryParams.append("sortOrder", sortOrder);
  return API.get<Product[]>(`/products/${category}?${queryParams.toString()}`);
};

const getProductsByQuery = (query: string) => {
  return API.get<Product[]>(`/products/search?query=${query}`);
};

const getProductsByBrand = (brandName: string) => {
  return API.get<Product[]>(`/products/brand/${brandName}`);
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByQuery,
  getProductsByBrand,
};
