import React, { useState } from "react";
import styles from "./sub-collection.module.css";
import { AppImg, Utilities } from "../../assets";
import Button from "../common/buttons/button";

const SubCollection = () => {
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
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
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
      <div className={styles.cardsWrapper}>
        <div>
          <div className={styles.subcollectionCard}>
            <div className={styles.imageGrid}>
              <div className={styles.image}>
                <img src={AppImg.abstraction1} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.abstraction2} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.abstraction3} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.abstraction4} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
                className="container primary"
                text={"View Collection"}
                type={"button"}
              />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <div>
              <span className={styles.heading}>House</span>
              <span className={styles.totalCount}>7 Assets</span>
            </div>
            <div>
              <img src={Utilities.horizontalDots} />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.subcollectionCard}>
            <div className={styles.imageGrid}>
              <div className={styles.image}>
                <img src={AppImg.subcollection5} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection6} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection7} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection8} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
                className="container primary"
                text={"View Collection"}
                type={"button"}
              />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <div>
              <span className={styles.heading}>House</span>
              <span className={styles.totalCount}>7 Assets</span>
            </div>
            <div>
              <img src={Utilities.horizontalDots} />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.subcollectionCard}>
            <div className={styles.imageGrid}>
              <div className={styles.image}>
                <img src={AppImg.subcollection9} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection10} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection11} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection12} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
                className="container primary"
                text={"View Collection"}
                type={"button"}
              />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <div>
              <span className={styles.heading}>House</span>
              <span className={styles.totalCount}>7 Assets</span>
            </div>
            <div>
              <img src={Utilities.horizontalDots} />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.subcollectionCard}>
            <div className={styles.imageGrid}>
              <div className={styles.image}>
                <img src={AppImg.subcollection13} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection14} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection15} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.subcollection16} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
                className="container primary"
                text={"View Collection"}
                type={"button"}
              />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <div>
              <span className={styles.heading}>House</span>
              <span className={styles.totalCount}>7 Assets</span>
            </div>
            <div>
              <img src={Utilities.horizontalDots} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SubCollection;
