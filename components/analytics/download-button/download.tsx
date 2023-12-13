import React from 'react'
import styles from "./download.module.css";
import { Utilities } from "../../../assets";
import ButtonIcon from "../../common/buttons/button-icon";

export default function Download() {
  return (
   <section>
    {/* <button className={`${styles['download-btn']}`}>
        Download
    </button> */}
    <div className={styles.downloadIcon}>
      <ButtonIcon  text=""  icon={Utilities.download} additionalClass={styles.downloadBtnIcon} />
      </div>
   </section>
  )
}
