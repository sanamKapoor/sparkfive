import React, { useContext, useEffect, useState } from "react";
import styles from "./Navheading.module.css";
import { Utilities } from "../../assets";
import Button from "../common/buttons/button";
import { AssetContext, FilterContext } from "../../context";

const NavHeading = () => {
  const {
    headerName,
    setHeaderName
  } = useContext(AssetContext);
  const {
    activeSortFilter
  } = useContext(FilterContext) as any;

  useEffect(() => {
    setHeaderName(`${activeSortFilter.mainFilter === "folders" ? "All Collections" : "All Assets"}`)
  }, [])
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
          <span className={styles.navigationLinkheading}>{headerName}</span>
        </div>
        <span className={styles.count}>396</span>
      </div>
    </>
  );
};
export default NavHeading;
