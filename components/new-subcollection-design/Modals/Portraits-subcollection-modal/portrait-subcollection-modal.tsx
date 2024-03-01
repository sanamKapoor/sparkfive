import styles from "./portrait-subcollection-modal.module.css";
import React, { useState } from "react";
import { Utilities } from "../../../assets";
import Button from "../../common/buttons/button";
import NestedSelect from "../../common/inputs/nested-select";
import Select from "../../common/inputs/select";
import { sorts } from "../../../config/data/attributes";

const SubcollectionModal = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className={styles.tagModal}>
      <div className={styles.modalHead}>
        <span>Select filter values to show for Portraits subcollection</span>
        <div className={styles.buttons}>
          <img src={Utilities.closeIcon} />
        </div>
      </div>
      <div className={styles.searchWrapper}>
        <input
          placeholder="Search tags"
          className={styles.searchInput}
          type="search"
        />
        <img className={styles.searchIcon} src={Utilities.searchIcon} />
      </div>
      <div className={styles.tagOuter}>
        <div className={styles.gridItem}>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Tags</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Custom fields #2</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Custom fields #5</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>File Types</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Date Uploaded</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Dimensions</span>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
        <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Tags</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Custom fields #2</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Custom fields #5</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Product</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Orientation</span>
            </div>
          </div>
          
         
        </div>
        <div className={styles.gridItem}>
        <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Custom fields #1</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Custom fields #4</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Campaigns</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Last Updated</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Resolution</span>
            </div>
          </div>
          
        </div>
      </div>
           <div className={styles.modalBtn}>
        <Button className={"apply"} text={"Apply"}></Button>
        <Button className={"cancel"} text={"Cancel"}></Button>
      </div>
    </div>
  );
};
export default SubcollectionModal;
