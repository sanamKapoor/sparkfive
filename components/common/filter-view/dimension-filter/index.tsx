import React from "react";
import styles from "./index.module.css";


// Components

interface DimensionsFilterProps {
  limits: {
    maxHeight: number;
    minHeight: number;
    maxWidth: number;
    minWidth: number;
  };
}

const DimensionsFilter: React.FC<DimensionsFilterProps> = ({ limits }) => {
  const { maxHeight, minHeight, maxWidth, minWidth } = limits;
  return (
    <div className={`${styles.container}`}>
      <p className={styles.heading}>Width</p>
      <div className={styles.outer}>
        <input className={styles.inputField} value={minWidth} />
        <div className={styles.line}></div>
        <input className={styles.inputField} value={maxWidth} />
      </div>
      <p className={styles.heading}>Height</p>
      <div className={styles.outer}>
        <input className={styles.inputField} value={minHeight} />
        <div className={styles.line}></div>
        <input className={styles.inputField} value={maxHeight} />
      </div>
      
    </div>
  );
};

export default DimensionsFilter;
