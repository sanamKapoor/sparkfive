import styles from "./Loadbtn.module.css";
import React from "react";
const LoadBtn = () => {
  return (
    <>
      <div className={styles.loadbtnWrapper}>
        <button className={styles.loadmore}>Load More</button>
      </div>
    </>
  );
};
export default LoadBtn;
