import React from "react";

import styles from "./divider.module.css";

const Divider = () => {
  return (
    <div className={`${styles["outer-wrapper"]}`}>
      <hr className={styles.divider} />
    </div>
  );
};

export default Divider;
