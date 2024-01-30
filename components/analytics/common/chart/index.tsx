import React, { useState } from 'react';
import ChartWrapper from '../../../common/charts/chart-wrapper';

const ChartComp = ({ data }) => {
    const [chartData, setChartData] = useState({
        // labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        datasets: [
            {
                data: [{x:10,y:10},{x:5,y:5}],
                borderColor: "#3e95cd",
                backgroundColor: "#7bb6dd",
                fill: true,
                
            },
        ]
    })

    // useEffect(() => {
    //     setChartData({
    //         labels: data.dates,
    //         datasets: [
    //             {
    //                 data: data.data,
    //                 borderColor: "#3e95cd",
    //                 backgroundColor: "#7bb6dd",
    //                 fill: true,
    //             },
    //         ]
    //     })
    // }, [data])


return (
    // <canvas id='myChart'></canvas>
    <ChartWrapper
        chartObj={{
            type: 'line'
        }}
        data={chartData}
        height={200}
    />
)
}

export default ChartComp