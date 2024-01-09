import React from 'react'
import styles from "./index.module.css"
import {insights} from "../../../assets"

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