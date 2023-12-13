import React from "react";
import { Utilities } from "../../../../assets";
import styles from "./folder-table.module.css";

const FolderTableHeader = ({ index, activeView, setSortAttribute }) => {
  return (
    <div className={styles.listHeader}>
      <div className={styles.listWrapper}>
        <div className={styles.headContent}>
          <span>Name</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("folder.name")}
          />
        </div>
        <div className={styles.headContent}>
          <span>Assets</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("folder.length")}
          />
        </div>
        <div className={styles.headContent3}>
          <span>Create date</span>
          <img
            src={Utilities.arrowDownUpLight}
            onClick={() => setSortAttribute("folder.created-at")}
          />
        </div>
        <div className={styles.headContent}>
          <span>Action</span>
        </div>
      </div>
    </div>
  );
};

export default FolderTableHeader;
