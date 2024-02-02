import React, { useEffect, useState } from 'react'
import styles from "../../index.module.css";
import Heading from '../../common/header/heading';
import DateFilter from '../../common/date-filter';
import useInsights from '../../../../hooks/useInsights';
import { DashboardSections, InsightsApiEndpoint, analyticsLayoutSection } from '../../../../constants/analytics';
import Team from '../../team';
import ChartComp from '../../common/chart';

const TeamSession = ({ initialData }) => {
  const { filter, setFilter, customDates, setCustomDates, data } = useInsights({ section: analyticsLayoutSection.DASHBOARD, endpoint: DashboardSections.TEAM });
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    setChartData(data)
  }, [data])

  useEffect(() => {
    setChartData(initialData)
  }, [initialData])
  const handleDownload = () => {
    const canvas = document.getElementById("chart");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = url;
    link.click();
  };

  return (
    <div className={styles.tableResponsive}>
      <div className={styles.headerContainer}>
        <Heading mainText="Top Team Session" smallHeading={true} />
        <div className={`${styles["table-header-tabs"]}`}>
          <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
          <button className={styles.downloadChart} onClick={handleDownload} >Download Chart</button>
        </div>
      </div>
      <ChartComp data={chartData} />
    </div>
  );
}

export default TeamSession