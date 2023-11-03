import React, { useContext, useEffect, useState } from "react";
import styles from "./Navheading.module.css";
import { Utilities } from "../../assets";
import Button from "../common/buttons/button";
import { AssetContext, FilterContext } from "../../context";

const NavHeading = ({ isShare = false }) => {
  const {
    headerName,
    setHeaderName
  } = useContext(AssetContext);
  const {
    activeSortFilter
  } = useContext(FilterContext) as any;

  useEffect(() => {
    if (!isShare) {
      setHeaderName(`${activeSortFilter.mainFilter === "folders" ? "All Collections" : "All Assets"}`)
    }
  }, [])
  return (
    <>
      <div className={styles.menuWrapper}>
        <div className={styles.icon}>
          <img src={Utilities.menu} />
          {/* close icon  :need to add functionality*/}
          {/* <img src={Utilities.bigblueClose}/> */}
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
      </div>
    </>
  );
};
export default NavHeading;
