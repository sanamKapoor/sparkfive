import styles from "./CsvBtn.module.css";
import React from "react";
import { Utilities } from "../../../../../assets";
const CsvBtn = () => {
  function handleImageClick() {
    console.log("Image clicked!");
  }
  return (
    <>
      <button className={styles.csvBtn}>Download CSV</button>
      <button className={`${styles["csvBtn"]} ${styles["csvicon"]}`}>
        <img
          className={styles.image}
          src={Utilities.download}
          onClick={handleImageClick}
        />
      </button>
    </>
  );
};
export default CsvBtn;
