

import React, { useContext } from 'react';
import styles from './insight-table.module.css';
import { AnalyticsContext } from '../../../context';
import { analyticsLayoutSection } from '../../../constants/analytics';
import DateFormatter from '../../../utils/date';

const TableHeading = ({ mainText, descriptionText, smallHeading = false }) => {

  const { filter, activeSection } = useContext(AnalyticsContext);
  
  return (
    <section className={styles.tableHeading}>
      <span className={smallHeading ? styles.smallHeading : styles.heading}>{mainText}</span>
      {
        (activeSection !== analyticsLayoutSection.DASHBOARD && filter) && 
        <span className={styles.description}>
          {DateFormatter.analyticsRecordsDateRange(filter)}
        </span>
      }
    </section>
  );
};

export default TableHeading;
