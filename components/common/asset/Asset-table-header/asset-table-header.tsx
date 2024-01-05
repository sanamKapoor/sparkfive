import React from "react";
import { Utilities } from "../../../../assets";
import styles from "./asset-table-header.module.css";

const AssetTableHeader = ({ index, activeView, setSortAttribute, type = false }) => {
  return (
    <div className={type ? styles.listHeaderCollection : styles.listHeader}>
      <div className={styles.listWrapper}>
        <div className={styles.headContent}>
          <span>Name</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("asset.name")}
          />
        </div>
        <div className={styles.headContent}>
          <span>Size</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("asset.size")}
          />
        </div>
        <div className={`${styles["headContent"]} ${styles["upload-date"]}`}>
          <span>Uploaded date</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("asset.created-at")}
          />
        </div>
        <div className={`${styles["headContent"]} ${styles["date-modified"]}`}>
          <span>Date modified</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("asset.created-at")}
          />
        </div>
        <div className={`${styles["headContent"]} ${styles["extension"]}`}>
          <span>Extension</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("asset.extension")}
          />
        </div>
        <div className={styles.headContent6}>
          <span>Action</span>
        </div>
      </div>
    </div>
  );
};
export default AssetTableHeader;
