import styles from "./filter-modal.module.css";
import React, { useState } from "react";
import { Utilities } from "../../../assets";
import Button from "../../common/buttons/button";

const Filtermodal = ({ onClose }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className={styles.modalContainer}>
    <div className={styles.tagModal}>
      <div className={styles.modalHead}>
        <span>More filters</span>
        <div className={styles.buttons}>
          <button onClick={onClose}  className={styles.clear}>clear</button>
          <img src={Utilities.closeIcon} />
        </div>
      </div>
      <div className={styles.searchWrapper}>
        <input className={styles.searchInput} type="search" />
        <img className={styles.searchIcon} src={Utilities.searchIcon} />
      </div>
      <div className={styles.tagOuter}>
        <div className={styles.left}>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Tags</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>AI Tags</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Campaigns</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>File Types</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Product</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Orientation</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Dimensions</span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Tags</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>AI Tags</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Campaigns</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>File Types</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Product</span>
          </div>
          <div className={styles.TagsInfo}>
            <div
              className={`${styles.circle} ${isChecked ? styles.checked : ""}`}
              onClick={handleCircleClick}
            >
              {isChecked && <img src={Utilities.checkIcon} />}
            </div>
            <span>Orientation</span>
          </div>
        </div>
      </div>
      <div className={styles.modalBtn}>
        <Button className="apply" text={"Apply"}></Button>
        <Button className="cancel" text={"Cancel"}></Button>
      </div>
    </div>
    </div>
  );
};
export default Filtermodal;
