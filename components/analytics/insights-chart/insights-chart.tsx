import React, { useState } from 'react'
import styles from "./insights-chart.module.css"
import DateFilter from '../date-filter/date-filter'



function AssetChart() {
 
  return (
    <>
    <DateFilter/>
     <div  className={`${styles['chart-wrapper']}`}>insights-chart</div>
     {/* <Line data={data}/> */}
   
    </>
   
  )
}

export default AssetChart