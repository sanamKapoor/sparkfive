import React from 'react'
import DateFilter from '../common/date-filter'
import TableHeading from '../insight-table/table-heading'
import styles from "./insights-chart.module.css"

function Chart() {
  return (
    <>
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <TableHeading mainText="Total Team Sessions" descriptionText="" smallHeading={true} />
        <DateFilter />
      </div>
      <div className={`${styles['chart-wrapper']}`}>
        <h2>Coming Soon...</h2>
      </div>
    </>

  )
}

export default Chart