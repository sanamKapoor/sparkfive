import React from "react";
import styles from "./all-collection-header.module.css";
import { Utilities } from "../../../assets";

const CollectionHeader = () => {
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
              <span>Assets</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Create date</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.fourthColumn}>Action</th>
          </tr>
        </thead>
     
    </>
  );
};
export default CollectionHeader;
