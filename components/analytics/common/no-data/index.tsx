import React from 'react'
import { insights } from "../../../../assets"
import styles from "./no-data.module.css"

function NoData({ message = '' }) {
  return (
  <section className={styles.wrapper}>
  <div className={styles.innerBox}>
    <img src={insights.noData} alt="" />
    <div className={styles.heading}>No Data</div>
    <div className={styles.description}>{message ? message : 'If the data changes, the page will update itself'}</div>
  </div>
  </section>
  )
}

export default NoData