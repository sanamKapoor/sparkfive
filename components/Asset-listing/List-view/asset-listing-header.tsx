import React from "react";
import styles from "./asset-listing-header.module.css";
import { Utilities } from "../../../assets";

const AssetHeader = () => {
  return (
    <>
     
        <thead>
          <tr className={`${styles["table-head-row"]}`}>
            <th className={styles.firstColumn}>
                <div className={styles.headContent}>
                <span>Name</span>
              <img src={Utilities.arrowDownUp} />
                </div>
             
            </th>
            <th className={styles.secondColumn}>
            <div className={styles.headContent}>
              <span>Size</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Uploaded date</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Date modified</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Extension</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.fourthColumn}>Action</th>
          </tr>
        </thead>
     
    </>
  );
};
export default AssetHeader;
