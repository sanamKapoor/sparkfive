import React, { useState } from 'react'
import styles from "./insights-chart.module.css"
// import { Line } from 'react-chartjs-2';

// import {Chart as ChartJS,Title,Tooltip,LineElement,Legend,CategoryScale,LinearScale,PointElement} from 'chart.js'

// ChartJS.register(
//     Title,Tooltip,LineElement,Legend,CategoryScale,LinearScale,PointElement
// )



function AssetChart() {
   const [data,setData] = useState({
    labels:["jan","feb","march","april","may","june","july","august","sepetember","october","november","december"],
    datasets:[
        {
            label:"First Dataset",
            data:[10,20,30,43,31,59,61,73,91,58,82,51],
            backgroundColor:"yellow"
        }
    ]
   })
  return (
    <>
     <div  className={`${styles['chart-wrapper']}`}>insights-chart</div>
     {/* <Line data={data}/> */}
   
    </>
   
  )
}

export default AssetChart