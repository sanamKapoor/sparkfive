import React from 'react'
import styles from "./asset-table-header.module.css"
import { Utilities } from "../../../../assets";

const AssetTableHeader = ({
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
            <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("asset.name")} />
          </div>
          <div className={styles.headContent}>
            <span>Size</span>
            <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("asset.size")} />
          </div>
          <div className={`${styles['headContent']} ${styles['upload-date']}`}>
            <span>Uploaded date</span>
            <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("asset.created-at")} />
          </div>
          <div className={`${styles['headContent']} ${styles['date-modified']}`} >
            <span>Date modified</span>
            <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("asset.created-at")} />
          </div>
          <div className={`${styles['headContent']} ${styles['extension']}`} >
            <span>Extension</span>
            <img src={Utilities.arrowDownUpLight} onClick={() => setSortAttribute("asset.extension")} />
          </div>
          <div className={styles.headContent6}>
            <span>Action</span>
          </div>
        </div>
      </div>
    ) : (
      null
    )}
  </div>
}
export default AssetTableHeader
