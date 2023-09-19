import React, { useState } from "react";
import styles from "./Navheading.module.css";
import { Utilities } from "../../assets";
import Button from "../common/buttons/button";

const NavHeading = () => {

  return (
    <>
      <div className={styles.menuWrapper}>
        <div className={styles.icon}>
          <img src={Utilities.menu} />
        </div>
        <span className={styles.menuHeading}>Menu</span>
      </div>
      <div className={styles.navHeadings}>
        <div className={styles.headingWrapper}>
          <div className={styles.icon}>
            <img src={Utilities.assets} />
          </div>
          <span className={styles.navigationLinkheading}>All assets</span>
        </div>
        <span className={styles.count}>396</span>
      </div>
    </>
  );
};
export default NavHeading;
