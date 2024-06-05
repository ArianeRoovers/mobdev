import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
