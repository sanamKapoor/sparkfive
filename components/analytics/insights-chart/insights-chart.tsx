import React, { useState } from 'react'
import styles from "./insights-chart.module.css"
import DateFilter from '../date-filter/date-filter'
import TableHeading from '../insight-table/table-heading'



function AssetChart({
  activeSection
}: { activeSection: string }) {

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

export default AssetChart