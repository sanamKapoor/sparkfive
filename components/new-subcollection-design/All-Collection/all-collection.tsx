import React from "react";
import styles from "./all-collection.module.css";
import { AppImg, Utilities } from "../../../assets";
import Button from "../../common/buttons/button";
import SubCollectionHeading from "../sub-collection-heading/sub-collection-heading";

const AllCollection = () => {
  return (
    <>
      <SubCollectionHeading></SubCollectionHeading>
      <div className={styles.cardsWrapper}>
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
                <img src={AppImg.collection1} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection2} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection3} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection4} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
              data-drag="false"
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
                <img src={AppImg.collection5} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection6} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection7} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection8} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
                className="container primary"
                text={"View Collection"}
                type={"button"}
                data-drag="false"
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
                <img src={AppImg.collection9} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection10} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection11} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection12} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
                className="container primary"
                text={"View Collection"}
                type={"button"}
                data-drag="false"
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
                data-drag="false"
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
                <img src={AppImg.collection1} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection2} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection3} />
              </div>
              <div className={styles.image}>
                <img src={AppImg.collection4} />
              </div>
            </div>
            <div className={styles["image-button-wrapper"]}>
              <Button
                className="container primary"
                text={"View Collection"}
                type={"button"}
                data-drag="false"
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
                data-drag="false"
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
export default AllCollection;
