import React from 'react';
import styles from "./index.module.css";
import { Utilities } from "../../../../../assets";
import IconClickable from '../../../../common/buttons/icon-clickable';

const DownloadChart = ({ fileName = '' }) => {
    const handleDownload = () => {
        const canvas = document.getElementById("chart");
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = fileName || "chart.png";
        link.href = url;
        link.click();
      };

  return (
    <>
     <button className={styles.downloadChart} onClick={handleDownload} >Download Chart</button>
    <div className={styles.downloadIcon}>
    <IconClickable src={Utilities.download}  onClick={handleDownload}  additionalClass={styles.download} />
    </div>
      
    </>
   
  )
}

export default DownloadChart