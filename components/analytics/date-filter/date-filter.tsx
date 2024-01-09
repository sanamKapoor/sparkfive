import React, { useContext, useState } from 'react';
import DayPickerInput from "react-day-picker/DayPickerInput";

import styles from "./date-filter.module.css";
import { insights } from "../../../assets";
import Button from '../../common/buttons/button';
import { AnalyticsContext } from '../../../context';
import { calculateBeginDate } from '../../../config/data/filter';

const FORMAT = "MM/dd/yyyy";

export default function DateFilter() {
  const { filter, setFilter } = useContext(AnalyticsContext);
  const [activeFilter, setActiveFilter] = useState('7d');
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleFilterClick = (filter, days) => {
    setShowCustomRange(false)
    setActiveFilter(filter);
    setFilter(prev => ({
      endDate: new Date(),
      beginDate: calculateBeginDate(days)
    }))
  };

  const handleCustomDateSelector = () => {
    setActiveFilter('custom');
    setShowCustomRange(!showCustomRange)
  }

  const handleStartDay = (value) => {
    setFilter(prev => ({
      ...prev,
      beginDate: value
    }))
  };

  const handleEndDay = (value) => {
    setFilter(prev => ({
      ...prev,
      endDate: value
    }))
  };

  return (
    <>
      {/* web-view  */}
      <section className={styles.dateFilter}>
        <div className={styles.gridBox}>
          <div
            className={`${styles['data']} ${activeFilter === '7d' && styles['active']}`}
            onClick={() => handleFilterClick('7d', 7)}
          >
            7d
          </div>
          <div
            className={`${styles['data']} ${activeFilter === '1m' && styles['active']}`}
            onClick={() => handleFilterClick('1m', 30)}
          >
            1m
          </div>
          <div
            className={`${styles['data']} ${activeFilter === '6m' && styles['active']}`}
            onClick={() => handleFilterClick('6m', 182)}
          >
            6m
          </div>
          <div
            className={`${styles['data']} ${activeFilter === '12m' && styles['active']}`}
            onClick={() => handleFilterClick('12m', 365)}
          >
            12m
          </div>
          <div className={`${styles['data']} ${activeFilter === 'custom' && styles['active']}`} onClick={handleCustomDateSelector}>
            <img src={insights.calender} alt="" />
          </div>
        </div>
        {showCustomRange &&
          <div className={`${styles['date-filters']}`}>
            <div>
              <DayPickerInput
                format={FORMAT}
                onDayChange={(day) => handleStartDay(day)}
                placeholder={"Start Date"}
                dayPickerProps={{
                  className: styles.calendar,
                }}
              />
            </div>
            <div>
              <DayPickerInput
                format={FORMAT}
                onDayChange={(day) => handleEndDay(day)}
                placeholder={"End Date"}
                dayPickerProps={{
                  className: styles.calendar,
                  disabledDays: {
                    before: filter?.beginDate,
                  },
                }}
              />
            </div>
          </div>
        }
      </section>

      {/* tab-view */}
      <section>
        <div className={`${styles['date-filter-teb']}`}>
          <Button text="Date Range" className={'outline-text-btn'} />
        </div>
      </section>
      {/* mobile-view */}
      <section className={`${styles['calender-filer-outer']}`} >
        <div className={`${styles['calender-filer']}`}>
          <div className={styles.calenderDate}>
            <img src={insights.calender} alt="" />
          </div>
        </div>
      </section>
    </>

  );
}
