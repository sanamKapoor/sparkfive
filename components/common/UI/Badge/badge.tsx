import React from "react";
import styles from "./badge.module.css";

interface BadgeProps {
  count: number;
}

const Badge: React.FC<BadgeProps> = ({ count }) => {
  return (
    <>
      <div className={styles.badge}>
        <span>{count}</span>
      </div>
    </>
  );
};

export default Badge;
