import React from "react";
import styles from "./InputChip.module.css";
import ClearBtn from "./ClearBtn";
const InputChip = () => {
  return (
    <div className={styles.chips}>
    <div className={styles.chipSet}>
      <div className={styles.chip}>
       80s
        <span className={styles.closebtn}>&times;</span>
      </div>
      <div className={styles.chip}>
      Digital
        <span className={styles.closebtn}>&times;</span>
      </div>
      <div className={styles.chip}>
     Painting
        <span className={styles.closebtn}>&times;</span>
      </div>
      <div className={styles.chip}>
    Abstract
        <span className={styles.closebtn}>&times;</span>
      </div>
      <div className={styles.chip}>
Discovery
        <span className={styles.closebtn}>&times;</span>
      </div>
      <ClearBtn />
    </div>
    </div>
  );
};
export default InputChip;
