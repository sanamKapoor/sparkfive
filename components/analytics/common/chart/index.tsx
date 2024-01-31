import React, { useEffect, useState } from 'react';
import ChartWrapper from '../../../common/charts/chart-wrapper';
import { ChartLines } from '../../../../constants/analytics';

const ChartComp = ({ data }) => {
    const [chartData, setChartData] = useState({
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        datasets: [
            {
                data: [23, 56, 124, 342, 22, 69],
                borderColor: "#3e95cd",
                backgroundColor: "#7bb6dd",
                fill: true,
            },
        ]
    })

    useEffect(() => {

        const datasets = data?.data?.map(d => {            
            return {
                ...ChartLines[d.key],
                data: d.data
            }
        })

        setChartData({
            labels: data.labels,
            datasets
        })
    }, [data])


    return (
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