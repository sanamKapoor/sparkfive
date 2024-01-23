import React, { useContext } from 'react'
import styles from "./download.module.css";
import { Utilities } from "../../../../assets";
import ButtonIcon from "../../../common/buttons/button-icon";
import { AnalyticsContext } from '../../../../context';

export default function Download({ setDownloadCSV }: {
  setDownloadCSV: (download: boolean) => void
}) {

  return (
   <section>
    <button className={`${styles['download-btn']}`} onClick={() => setDownloadCSV(true)}>
        Download CSV
    </button>
    <div className={styles.downloadIcon}>
      <ButtonIcon  text=""  icon={Utilities.download} additionalClass={styles.downloadBtnIcon} onClick={() => setDownloadCSV(true)} />
      </div>
   </section>
  )
}
