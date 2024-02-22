import React, { useContext } from 'react'
import styles from "./download.module.css";
import { Utilities } from "../../../../assets";
import ButtonIcon from "../../../common/buttons/button-icon";

export default function Download({ setDownloadCSV, text }: {
  setDownloadCSV: (download: boolean) => void,
  text?: string
}) {

  return (
   <section className={styles.mobile}>
    <button className={`${styles['download-btn']}`} onClick={() => setDownloadCSV(true)}>
        Download {text ? text : 'CSV'}
    </button>
    <div className={styles.downloadIcon}>
      <ButtonIcon  text=""  icon={Utilities.download} additionalClass={styles.downloadBtnIcon} onClick={() => setDownloadCSV(true)} />
      </div>
   </section>
  )
}
