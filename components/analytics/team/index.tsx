import React, { useEffect, useState } from 'react';
import { AnalyticsLayoutSection, InsightsApiEndpoint } from '../../../constants/analytics';
import useInsights from '../../../hooks/useInsights';
import ChartComp from '../common/chart';
import DateFilter from '../common/date-filter';
import DateRangeTitle from '../common/header/date-title';
import Heading from '../common/header/heading';
import InsightsHeader from '../common/headline';
import styles from "../index.module.css";
import DownloadChart from '../common/chart/download-button';

const Team = ({ initialData }) => {

  const { filter, customDates, setFilter, setCustomDates, setDownloadCSV, setData, data } = useInsights({
    section: AnalyticsLayoutSection.TEAM,
    endpoint: InsightsApiEndpoint.TEAM
  })
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    setChartData(data)
  }, [data])

  useEffect(() => {
    setChartData(initialData)
  }, [initialData])

  return (
    <section className={styles.mainContainer}>
      <div className={styles.tableHeader}>
        <InsightsHeader title="Team" />
      </div>
      <div className={`${styles["inner-container"]}`}>
      <section className={`${styles["outer-wrapper"]}`}>
        <div className={styles.tableResponsive}>
          <div className={styles.headerContainer}>
            <div className={styles.inline}>
                <Heading mainText="Team Engagement" />
                <DateRangeTitle filter={filter} />
            </div>
            <div className={`${styles["table-header-tabs"]}`}>
              <DateFilter
                filter={filter}
                setFilter={setFilter}
                customDates={customDates}
                setCustomDates={setCustomDates}
              />
              <DownloadChart fileName='Team Engagement' />
            </div>
          </div>
          <ChartComp data={chartData} fileName='Team Engagement' />
        </div>
      </section>
      </div>
    </section>
  )
}

export default Team