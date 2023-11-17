import React from 'react'
import styles from "./folder-table.module.css"
import { Utilities } from "../../../../assets";

 const FolderTableHeader = ({
    index,
    activeView,
    setSortAttribute
  }) => {
    return <div>
      {index === 0 && activeView === "list" ? (
        <div className={styles.listHeader}>
          <div className={styles.listWrapper}>
            <div className={styles.headContent}>
              <span>Name</span>
              <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("folder.name")} />
            </div>
            <div className={styles.headContent}>
              <span>Assets</span>
              <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("folder.length")} />
            </div>
            <div className={styles.headContent3} >
              <span>Create date</span>
              <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("folder.created-at")} />
            </div>
            <div className={styles.headContent}>
              <span>Action</span>
            </div>
          </div>
        </div>
      ) : (
        null
      )}
    </div>
  }
  
  export default  FolderTableHeader;
  