import React, { useContext, useState } from "react";
import styles from "./sub-collection.module.css";
import { AppImg, Utilities } from "../../assets";
import Button from "../common/buttons/button";
import { AssetContext } from "../../context";

const SubCollection = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };
  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const {
    setSubFoldersViewList,
    subFoldersViewList: { results, next, total },
  } = useContext(AssetContext);

  const array = new Array<number>(4, 2, 3, 4);
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
        {array.map((item) => {
          return (
            <div className={`${styles["sub-collection-wrapper"]}`}>
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
                <div className={styles["checked-button"]} onClick={handleClick}>
                  {isClicked ? (
                    <img
                      src={Utilities.radioButtonEnabled}
                      alt="Enabled Image"
                    />
                  ) : (
                    <img src={Utilities.radioButtonNormal} alt="Normal Image" />
                  )}
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
          );
        })}
      </div>
      <div className={styles.LoadMorebtn}>
        <Button text="Load More" type="button" className="container primary" />
      </div>
    </>
  );
};
export default SubCollection;
