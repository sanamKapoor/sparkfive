import Chart from "chart.js";
import { useEffect, useRef, useState } from "react";
import styles from "./chart-wrapper.module.css";
import { useRouter } from "next/router";
import { analyticsRoutes } from "../../../constants/analytics";

const ChartWrapper = ({ chartObj, data, width = 400,  height = 400, fileName = '' }) => {
  const router = useRouter();
  const wrapperRef = useRef();
  const ctx = "chart";

  const [chart, setChart] = useState();

  useEffect(() => {
    if (wrapperRef && chartObj) {
      drawChart();
    }
  }, [chartObj.type]);

  useEffect(() => {    
    if (chart && data.labels && data.datasets) {
      updateChart();
    }
  }, [data]);

  const drawChart = () => {
    setChart(new Chart(ctx, { ...chartObj, data, 
      options: {
        color: "#ffffff",
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
        },
        plugins: {
          customCanvasBackgroundColor: {
            color: '#ffffff',
          }
        }
      },  
      plugins: [
        {
          id: 'chart',
          beforeDraw: (chart, args, options) => {
            const {ctx} = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = options.color || '#ffffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          }
        },
        
      ]  
    }));
  };

  const updateChart = () => {      
    chart.data = data;
    chart.update();
  };  

  const handleDownload = () => {
    const canvas = document.getElementById("chart");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fileName}.png` || "chart.png";
    link.href = url;
    link.click();
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* {router.pathname !== analyticsRoutes.DASHBOARD && <button onClick={handleDownload}>Download Chart</button>} */}
      <canvas id="chart" width={width} height={height} style={{ background: "white" }}></canvas>
    </div>
  );
};

export default ChartWrapper;
