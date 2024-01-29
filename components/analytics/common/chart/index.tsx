import React from 'react'
import ChartWrapper from '../../../common/charts/chart-wrapper';

const ChartComp = () => {
    const data = {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        datasets: [
            {
                data: [114, 106, 106, 107, 0, 111, 133, 170],
                borderColor: "#3e95cd",
                backgroundColor: "#7bb6dd",
                fill: true,
            },            
        ]
    }

    return (
        // <canvas id='myChart'></canvas>
        <ChartWrapper 
            chartObj={{
                type: 'line'
            }} 
            data={data} 
            height={200}
        />
    )
}

export default ChartComp