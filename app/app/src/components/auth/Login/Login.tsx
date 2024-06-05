import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "@core/modules/auth/Auth.api";
import { useAuth } from "@contexts/AuthContext";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);

    try {
      const response = await apiLogin({ email, password });
      setIsLoading(false);
      login(response.token, response.role);
      if (response.role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className={styles.split}>
      <img
        className={styles.splitImage}
        src="/home-image.png"
        alt="Background"
      />
      <div className={styles.splitContent}>
        <div className={styles.logo}></div>
        {error && (
          <div className={styles.errorView}>
            {error} E-mail or password is incorrect
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2 className={styles.formTitle}>Login</h2>
          <div className={styles.formControl}>
            <label className={styles.formLabel} htmlFor="email">
              E-mail
            </label>
            <input
              className={styles.formInput}
              type="email"
              name="email"
              id="email"
              placeholder="E-mail"
              disabled={isLoading}
              required
            />
          </div>
          <div className={styles.formControl}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input
              className={styles.formInput}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              disabled={isLoading}
              required
            />
          </div>
          <button
            className={styles.btnPrimary}
            type="submit"
            disabled={isLoading}
          >
            Login
          </button>
          <p className={styles.forgotPassword}>Wachtwoord vergeten?</p>
          <button
            className={styles.btnSecondary}
            type="button"
            onClick={navigateToRegister}
            disabled={isLoading}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
