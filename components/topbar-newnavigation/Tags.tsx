import React from "react";
import styles from "./Tags.module.css";
const Tags = () => {
  return (
    <div>
    <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Tags
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          AI Tags
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Compaigns
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          File Types
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Products
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Last Updated
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Orientation
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Dimensions
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Custom fields #1
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
      </div>
      <div className={styles["custom-select"]}>
      <select>
        <option value="" selected>
          Custom fields #2
        </option>
        <option value="option1">Option 1</option>
        <option value="option2"> 2</option>
      </select>
    </div>
    <div className={styles.morefilter}>
        <span>More filters</span>

    </div>
    </div>
  );
};
export default Tags;
