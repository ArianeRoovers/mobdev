import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
// import { useCart } from "@contexts/CartContext";
import { getCurrentUser } from "@core/modules/user/User.api";
import { User } from "@core/modules/user/User.types";

type UserContextProps = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { clearCart } = useCart();

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setUser(null);
    // clearCart();
    navigate("/login");
  };

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

      setIsLoading(true);
      getCurrentUser()
        .then(({ data }: { data: User }) => {
          setUser(data);
        })
        .catch((error: AxiosError) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        logout,
        setUser,
        setError,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
