import React, { useState } from "react";
import styles from "./sub-collection-heading.module.css";
import { Utilities, AppImg } from "../../../assets";
import { utimesSync } from "fs";
import IconClickable from "../../common/buttons/icon-clickable";

const SubCollectionHeading = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div className={`${styles["sub-collection-heading"]}`}>
        <div className={styles.rightSide}>
          <span>Subcollection(4)</span>
          <img src={Utilities.downIcon} />
        </div>
        <div className={styles.tagOuter}>
          <div className={styles.left}>
            <div className={styles.TagsInfo}>
              <div
                className={`${styles.circle} ${isChecked ? styles.checked : ""
                  }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span className={`${styles["sub-collection-content"]}`}>
                Show subcollection content
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SubCollectionHeading;
