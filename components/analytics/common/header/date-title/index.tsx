import React from 'react'
import DateFormatter from "../../../../../utils/date";
import styles from "../index.module.css";

const DateRangeTitle = ({ filter }: {
    filter: {
        beginDate: Date,
        endDate: Date
}}) => {
  return <span className={styles.description}>{DateFormatter.analyticsRecordsDateRange(filter)}</span>;
}

export default DateRangeTitle