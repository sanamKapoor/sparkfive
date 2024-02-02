import React, { useEffect, useState } from 'react'
import styles from "../index.module.css";
import ChartComp from '../common/chart';
import InsightsHeader from '../common/headline';
import Heading from '../common/header/heading';
import DateRangeTitle from '../common/header/date-title';
import useInsights from '../../../hooks/useInsights';
import { InsightsApiEndpoint, analyticsLayoutSection } from '../../../constants/analytics';
import DateFilter from '../common/date-filter';
import Download from '../common/download-button';

const Team = ({ initialData }) => {

  const { filter, customDates, setFilter, setCustomDates, setDownloadCSV, setData, data } = useInsights({
    section: analyticsLayoutSection.TEAM,
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
              {/* <Download setDownloadCSV={setDownloadCSV} text='Chart' /> */}
            </div>
          </div>
          <ChartComp data={chartData} />
        </div>
      </section>
      </div>
    </section>
  )
}

export default Team