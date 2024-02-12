import React, { useEffect, useState } from 'react';
import { AnalyticsLayoutSection, DashboardSections } from '../../../../constants/analytics';
import useInsights from '../../../../hooks/useInsights';
import ChartComp from '../../common/chart';
import DateFilter from '../../common/date-filter';
import Heading from '../../common/header/heading';
import styles from "../../index.module.css";

const TeamSession = ({ initialData }) => {
  const { filter, setFilter, customDates, setCustomDates, data } = useInsights({ section: AnalyticsLayoutSection.DASHBOARD, endpoint: DashboardSections.TEAM });
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    setChartData(data)
  }, [data])

  useEffect(() => {
    setChartData(initialData)
  }, [initialData])


  return (
    <div className={`${styles["tableResponsive"]} ${styles["dashboard-chart"]}`}>
      <div className={styles.headerContainer}>
        <Heading mainText="Total Team Sessions" smallHeading={true} />
        <div className={`${styles["table-header-tabs"]}`}>
          <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
        </div>
      </div>
      <div className={`${styles["dashboard-chart-container"]}`}>
      <ChartComp data={chartData} fileName="Team Session" />
      </div>
    </div>
  );
}

export default TeamSession