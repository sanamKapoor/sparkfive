import React from "react";
import styles from "./all-collection.module.css";
import { AppImg,Utilities } from "../../assets";
import Button from "../common/buttons/button";

const AllCollection = ()  => {


return (
    <>
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
     
    

    </>
)
}
export default AllCollection;