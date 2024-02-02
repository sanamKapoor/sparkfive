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

  return (
    <div className={styles.tableResponsive}>
      <div className={styles.headerContainer}>
        <Heading mainText="Top Team Session" smallHeading={true} />
        <div className={`${styles["table-header-tabs"]}`}>
          <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
        </div>
      </div>
      <ChartComp data={chartData} fileName="Team Session" />
    </div>
  );
}

export default TeamSession