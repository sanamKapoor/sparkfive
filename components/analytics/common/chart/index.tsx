import React, { useEffect, useState } from 'react';
import ChartWrapper from '../../../common/charts/chart-wrapper';
import { ChartLines } from '../../../../constants/analytics';

const ChartComp = ({ data, fileName = '' }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    })

    useEffect(() => {
        const datasets = data?.data?.map(d => {            
            return {
                ...ChartLines[d.key],
                data: d.data
            }
        })

        setChartData(prev => ({
            labels: data.labels,
            datasets
        }))
    }, [data])


    return (
        <ChartWrapper
            chartObj={{
                type: 'line'
            }}
            data={chartData}
            // height={200}
            fileName={fileName}
        />
    )
}

export default ChartComp