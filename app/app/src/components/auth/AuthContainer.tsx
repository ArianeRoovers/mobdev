
import React, { ReactNode, useEffect } from "react";
import { useUserContext } from "./userContext";
import { useCart } from "@contexts/CartContext"; 
import { useNavigate } from "react-router-dom";
import { getAuthToken, saveAuthToken } from "@core/storage";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getCurrentUser } from "@core/modules/user/User.api";
import { User } from "@core/modules/user/User.types";
import Loading from "../../pages/Loading/Loading";

interface AuthContainerProps {
  children: ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const { user, isLoading, error, setUser, setError, setIsLoading } =
    useUserContext();
  const { clearCart } = useCart(); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
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

      // Fetch user data
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
  }, [navigate, setUser, setError, setIsLoading]);

  const logout = () => {
    saveAuthToken(null);
    localStorage.removeItem("userRole");
    clearCart(); 
    navigate("/login");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div
      style={{
        display: "grid",
        height: "100vh",
        gridTemplateColumns: "14rem auto",
      }}
    >
      <nav> </nav>
      <main>{children}</main>
    </div>
  );
};

export default AuthContainer;
