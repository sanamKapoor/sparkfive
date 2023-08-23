import styles from "./nested-sidenav-firstlist.module.css";
import { Utilities } from "../../assets";

import React from "react";
const NestedFirstlist = () => {
  return (
    <div className={styles["sidenav-list1"]}>
      <ul>
        <li className={`${styles["list1-description"]} ${styles.active}`}>
          <div className={styles["list1-left-contents"]}>
            <div className={styles.icon}>
              <img src={Utilities.assets} />
            </div>
            <div className={styles["icon-description"]}>
              <span>All Assets</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span>396</span>
          </div>
        </li>
        <li className={`${styles["list1-description"]}`}>
          <div className={styles["list1-left-contents"]}>
            <div className={styles.icon}>
              <img src={Utilities.vedio} />
            </div>
            <div className={styles["icon-description"]}>
              <span>Video</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span>96</span>
          </div>
        </li>
        <li className={`${styles["list1-description"]}`}>
          <div className={styles["list1-left-contents"]}>
            <div className={styles.icon}>
              <img src={Utilities.images} />
            </div>
            <div className={styles["icon-description"]}>
              <span>Images</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span>300</span>
          </div>
        </li>
        <li className={`${styles["list1-description"]}`}>
          <div className={styles["list1-left-contents"]}>
            <div className={styles.icon}>
              <img src={Utilities.product} />
            </div>
            <div className={styles["icon-description"]}>
              <span>Product</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span></span>
          </div>
        </li>
        <li className={`${styles["list1-description"]}`}>
          <div className={styles["list1-left-contents"]}>
            <div className={styles.icon}>
              <img src={Utilities.archive} />
            </div>
            <div className={styles["icon-description"]}>
              <span>Archived</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span></span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default NestedFirstlist;
