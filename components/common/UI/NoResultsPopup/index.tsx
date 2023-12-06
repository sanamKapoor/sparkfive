import React from "react";
import { Utilities } from "../../../../assets";

import styles from "./index.module.css";

interface NoResultsProps {
  onClose: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ onClose }) => {
  return (
    <div className={styles.wrapper}>
      <p>No Result Found</p>
      <img
        className={styles.closeIcon}
        src={Utilities.closeIcon}
        onClick={onClose}
        onKeyDown={onClose}
      />
    </div>
  );
};

export default NoResults;