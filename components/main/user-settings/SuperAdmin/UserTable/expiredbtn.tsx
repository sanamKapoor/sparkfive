import styles from "./expiredbtn.module.css";
import React from "react";
const Expiredbtn = () => {
  return (
    <>
      <button className={`${styles.expired}`}>Expired</button>
    </>
  );
};
export default Expiredbtn;
