import React, { useState } from "react";
import styles from "./PasswordGenerator.module.css";

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const newPassword = Math.random().toString(36).slice(-8);
    setPassword(newPassword);
  };

  return (
    <div>
      <button
        type="button"
        className={styles.button}
        onClick={generatePassword}
      >
        Generate Password
      </button>
      {password && <p>Your generated password is: {password}</p>}
    </div>
  );
};

export default PasswordGenerator;
