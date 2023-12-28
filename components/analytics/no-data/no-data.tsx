import React from 'react'
import styles from "./index.module.css"
import {insights} from "../../../assets"

function NoData() {
  return (
  <section className={styles.wrapper}>
  <div className={styles.innerBox}>
    <img src={insights.noData} alt="" />
    <div className={styles.heading}>No Data</div>
    <div className={styles.description}>If the data changes, the page will update itself</div>

  </div>
  </section>
  )
}

export default NoData