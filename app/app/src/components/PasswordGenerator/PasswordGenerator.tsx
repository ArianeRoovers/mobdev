import React, { useState } from "react";
import styles from "./PasswordGenerator.module.css";

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onPasswordGenerated,
}) => {
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const newPassword = Math.random().toString(36).slice(-8);
    setPassword(newPassword);
    onPasswordGenerated(newPassword);
  };

  return (
    <div>
      <button className={styles.button} onClick={generatePassword}>
        Generate Password
      </button>
      {password && <p>Your password is: {password}</p>}
    </div>
  );
};

export default PasswordGenerator;
