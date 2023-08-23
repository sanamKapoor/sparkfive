import styles from "./button.module.css";
import { Utilities } from "../../assets";
import React from "react";

const NestedButton = ({ children }) => {
  return (
    <div>
      <button className={styles.nestedButton}>
        <img src={Utilities.add} alt="Add Icon" />
        <span>{children}</span>
      </button>
    </div>
  );
};

export default NestedButton;
