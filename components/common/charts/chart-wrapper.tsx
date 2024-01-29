import Chart from "chart.js";
import { useEffect, useRef, useState } from "react";
import styles from "./chart-wrapper.module.css";

const ChartWrapper = ({ chartObj, data, width = 400,  height = 400 }) => {
  const wrapperRef = useRef();
  const ctx = "chart";

  const [chart, setChart] = useState();

  useEffect(() => {
    if (wrapperRef && chartObj) {
      drawChart();
    }
  }, [chartObj.type]);

  useEffect(() => {
    updateChart();
  }, [data]);

  const drawChart = () => {
    setChart(new Chart(ctx, { ...chartObj, data }));
  };

  const updateChart = () => {
    if (chart) {
      chart.data = Object.assign({}, data);
      chart.update();
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <canvas id="chart" width={width} height={height}></canvas>
    </div>
  );
};

export default ChartWrapper;
