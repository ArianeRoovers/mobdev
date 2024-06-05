import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "@core/modules/auth/Auth.api";
import PasswordGenerator from "@components/PasswordGenerator/PasswordGenerator";
import styles from "./Register.module.css";

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handlePasswordGenerated = (newPassword: string) => {
    setPassword(newPassword);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const brandName =
      role === "seller" ? (formData.get("brandName") as string) : "";

    setIsLoading(true);

    registerUser({
      email,
      password,
      firstName,
      lastName,
      brandName,
      role: role as "user" | "seller",
    })
      .then(() => {
        setIsLoading(false);
        navigate("/login");
      })
      .catch((error: any) => {
        setIsLoading(false);
        setError(error.message);
      });
  };

  const navigateToLogin = () => {
    navigate("/login");
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
        {error && <div className={styles.errorView}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <h2 className={styles.formTitle}>Registreren</h2>
          <div className={styles.formControl}>
            <label className={styles.formLabel} htmlFor="role">
              Role
            </label>
            <select
              className={styles.formInput}
              name="role"
              id="role"
              value={role}
              onChange={handleRoleChange}
              disabled={isLoading}
              required
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <div className={styles.formControl}>
            <label className={styles.formLabel} htmlFor="firstName">
              First Name
            </label>
            <input
              className={styles.formInput}
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              disabled={isLoading}
              required
            />
          </div>
          <div className={styles.formControl}>
            <label className={styles.formLabel} htmlFor="lastName">
              Last Name
            </label>
            <input
              className={styles.formInput}
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              disabled={isLoading}
              required
            />
          </div>
          {role === "seller" && (
            <div className={styles.formControl}>
              <label className={styles.formLabel} htmlFor="brandName">
                Brand Name
              </label>
              <input
                className={styles.formInput}
                type="text"
                name="brandName"
                id="brandName"
                placeholder="Brand Name"
                disabled={isLoading}
                required
              />
            </div>
          )}
          <div className={styles.formControl}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              className={styles.formInput}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
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
              value={password}
              onChange={handleChangePassword}
              disabled={isLoading}
              required
            />
            <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
          </div>
          <button
            className={styles.btnPrimary}
            type="submit"
            disabled={isLoading}
          >
            Register
          </button>
          <button
            className={styles.btnSecondary}
            type="button"
            onClick={navigateToLogin}
            disabled={isLoading}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
