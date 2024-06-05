import React, { createContext, useContext, useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getCurrentUser } from "@core/modules/user/User.api";
import { User } from "@core/modules/user/User.types";
import { useCart } from "@contexts/CartContext";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
  user: User | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("authToken");
  });
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem("userRole");
  });
  const { getCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.interceptors.request.use((config) => {
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });

      axios.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            setUser(null);
            logout();
          }
          return Promise.reject(error);
        }
      );

      getCurrentUser()
        .then(({ data }: { data: User }) => {
          setUser(data);
          setUserRole(data.role);
          getCart();
        })
        .catch((error: AxiosError) => {
          console.error("Failed to fetch user profile", error.message);
        });
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    setIsAuthenticated(true);
    setUserRole(role);

    getCurrentUser()
      .then(({ data }: { data: User }) => {
        setUser(data);
        getCart();
      })
      .catch((error: AxiosError) => {
        console.error("Failed to fetch user profile", error.message);
      });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    // clearCart(); // Clear the cart on logout
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, userRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
