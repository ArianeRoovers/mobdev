import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  updateUserData,
  deleteUser,
} from "@core/modules/user/User.api";
import { useAuth } from "@contexts/AuthContext";
import { UserBody } from "@core/modules/user/User.types";
import styles from "./UserSettings.module.css";

const UserSettingsForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UserBody>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    brandName: "",
    bio: "",
    phone_number: "",
  });
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      getCurrentUser().then((response) => {
        const userData = response.data;
        setData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          password: "",
          role: userData.role || "user",
          brandName: userData.brandName || "",
          bio: userData.bio || "",
          phone_number: userData.phone_number || "",
        });
      });
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (user && user._id) {
      setIsLoading(true);
      const updatedData = { ...data, role: user.role };
      updateUserData(user._id, updatedData)
        .then(() => {
          alert("Settings are successfully updated!");
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault();
    if (user && user._id) {
      if (
        confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      ) {
        deleteUser(user._id)
          .then(() => {
            alert("Your account has been successfully deleted.");
            logout();
          })
          .catch((error) => {
            alert(`There was an error deleting your account: ${error.message}`);
          });
      }
    }
  };

  const updateField = (field: keyof UserBody, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <div className={styles.userSettingsForm}>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formControl}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            required
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            required
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={data.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
          />
        </div>
        {user && user.role === "seller" && (
          <>
            <div className={styles.formControl}>
              <label htmlFor="brandName">Brand Name</label>
              <input
                type="text"
                id="brandName"
                value={data.brandName}
                onChange={(e) => updateField("brandName", e.target.value)}
                required
              />
            </div>
            <div className={styles.formControl}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={data.bio}
                onChange={(e) => updateField("bio", e.target.value)}
              />
            </div>
            <div className={styles.formControl}>
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                value={data.phone_number}
                onChange={(e) => updateField("phone_number", e.target.value)}
              />
            </div>
          </>
        )}
        <div className={styles.formActions}>
          <button type="submit" disabled={isLoading}>
            Update Settings
          </button>
          <button type="button" onClick={handleDelete} disabled={isLoading}>
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettingsForm;
