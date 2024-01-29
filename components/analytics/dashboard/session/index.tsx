import React from 'react'
import styles from "../../index.module.css";
import Heading from '../../common/header/heading';
import DateFilter from '../../common/date-filter';
import useInsights from '../../../../hooks/useInsights';
import { InsightsApiEndpoint, analyticsLayoutSection } from '../../../../constants/analytics';
import Team from '../../team';

const TeamSession = () => {
  const { filter,setFilter,customDates,setCustomDates } = useInsights({ section: analyticsLayoutSection.DASHBOARD, endpoint: InsightsApiEndpoint.TEAM });

  return (
    <div className={styles.tableResponsive}>
        <div className={styles.headerContainer}>
            <Heading mainText="Total Team Sessions" smallHeading={true} />
            <div className={`${styles["table-header-tabs"]}`}>
            <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
            </div>
        </div>
        <Team />
    </div>
  );
}

export default TeamSession