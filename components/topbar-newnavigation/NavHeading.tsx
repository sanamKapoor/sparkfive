import React, { useContext, useEffect, useState } from "react";
import styles from "./Navheading.module.css";
import { Utilities } from "../../assets";
import Button from "../common/buttons/button";
import { AssetContext, FilterContext } from "../../context";

const NavHeading = ({ isShare = false }) => {

  const {
    headerName,
    setHeaderName,
    sidebarOpen,
    setSidebarOpen
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
        <div className={styles.icon} onClick={() => { setSidebarOpen(!sidebarOpen) }}>
          <img src={Utilities.menu} />
          {/* close icon : should be used when we want to close the sidenav */}
          {/* <img src={Utilities.bigblueClose} alt="" /> */}
        </div>
        <span className={styles.menuHeading} >Menu</span>
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