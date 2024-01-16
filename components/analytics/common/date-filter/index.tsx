import React, { useContext, useEffect, useState } from 'react';
import DayPickerInput from "react-day-picker/DayPickerInput";

import styles from "./date-filter.module.css";
import { insights } from "../../../../assets";
import Button from "../../../common/buttons/button";
import { AnalyticsContext } from "../../../../context";
import { calculateBeginDate } from "../../../../config/data/filter";
import DateUtils from "../../../../utils/date";
import dateStyles from "../../../common/filter/date-uploaded.module.css";
import IconClickable from "../../../common/buttons/icon-clickable";

export default function DateFilter() {
  const { filter, setFilter, customDates, setCustomDates } = useContext(AnalyticsContext);
  const [activeFilter, setActiveFilter] = useState("7d");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customDateVal, setCustomDateVal] = useState({
    endDate: '',
    beginDate: ''
  });
  const [dateError, setDateError] = useState('');

  const handleFilterClick = (filter, days) => {
    setShowCustomRange(false);
    setActiveFilter(filter);
    setCustomDates(false);
    setFilter((prev) => ({
      endDate: new Date(),
      beginDate: calculateBeginDate(days, 1)
    }))
  };

  const handleCustomDateSelector = () => {
    setActiveFilter("custom");
    setShowCustomRange(!showCustomRange);
    setCustomDateVal({
      endDate: '',
      beginDate: ''
    });
  };

  const handleStartDay = (value) => {
    setCustomDateVal((prev) => ({
      ...prev,
      beginDate: value,
    }));
  };

  const handleEndDay = (value) => {
    setCustomDateVal((prev) => ({
      ...prev,
      endDate: value,
    }));
  };

  const handleApplyCustomDate = () => {
    if (!customDateVal.beginDate || !customDateVal.endDate) {
      setDateError('Invalid Dates.');
      return;
    }
    setFilter(customDateVal);
    setCustomDates(true);
  }

  const handleClearDates = () => {
    setCustomDateVal({
      endDate: '',
      beginDate: ''
    })
    setFilter(null)
  }

  useEffect(() => {
    if (customDates && filter && showCustomRange) {      
      setCustomDateVal({
        beginDate: filter.beginDate.toDateString(),
        endDate: filter.endDate.toDateString()
      })
    }
  }, [customDates, showCustomRange])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDateError('')
    }, 4000)

    return () => {
      clearTimeout(timeOut)
    }
  }, [dateError])

  useEffect(() => {
    setDateError('')
  }, [])

  return (
    <>
      {/* web-view  */}
      <section className={styles.dateFilter}>
        <div className={styles.gridBox}>
          <div
            className={`${styles["data"]} ${activeFilter === "7d" && styles["active"]}`}
            onClick={() => handleFilterClick("7d", 7)}
          >
            7d
          </div>
          <div
            className={`${styles["data"]} ${activeFilter === "1m" && styles["active"]}`}
            onClick={() => handleFilterClick("1m", 30)}
          >
            1m
          </div>
          <div
            className={`${styles["data"]} ${activeFilter === "6m" && styles["active"]}`}
            onClick={() => handleFilterClick("6m", 182)}
          >
            6m
          </div>
          <div
            className={`${styles["data"]} ${activeFilter === "12m" && styles["active"]}`}
            onClick={() => handleFilterClick("12m", 365)}
          >
            12m
          </div>
          <div
            className={`${styles["data"]} ${styles["last-child"]} ${activeFilter === "custom" && styles["active"]}`}
            onClick={handleCustomDateSelector}
          >
            <img src={insights.calender} alt="" />
          </div>
        </div>
        {showCustomRange && (
          <div className={`${styles["date-picker-wrapper"]}`}>
            <div className={`${styles["date-picker-top"]}`}>
              <div className={`${styles["left-side"]}`}>Date Range</div>
              <div className={`${styles["right-side"]}`}>
                {(customDateVal.beginDate && customDateVal.endDate) && <Button text={"Clear"} className={"text-success-btn"} onClick={handleClearDates}></Button>}
                <IconClickable src={insights.insightClose} additionalClass={styles["close-icon"]} onClick={handleCustomDateSelector} />
              </div>
            </div>
            <div className={`${styles["date-filters"]}`}>
              <div className={styles.dummy}>
                <label className={styles.label} htmlFor="">From Date</label>
                <DayPickerInput
                  onDayChange={(day) => handleStartDay(day)}
                  value={customDateVal.beginDate !== null ? DateUtils.parseDateToStringForAnalytics(customDateVal.beginDate) : ''}
                  dayPickerProps={{
                    disabledDays: {
                      before: calculateBeginDate(365, 1),
                      after: customDateVal.endDate ? new Date(customDateVal.endDate) : new Date(),
                    }
                  }}
                />
              </div>
              <div className={styles.dummy}>
                <label className={styles.label} htmlFor="">To Date</label>
                <DayPickerInput
                  onDayChange={(day) => handleEndDay(day)}
                  value={customDateVal.endDate !== null ? DateUtils.parseDateToStringForAnalytics(customDateVal.endDate) : ''}
                  dayPickerProps={{
                    className: styles.calendar,
                    disabledDays: {
                      before: customDateVal.beginDate ? new Date(customDateVal.beginDate) : calculateBeginDate(365, 1),
                      after: customDateVal.endDate ? new Date(customDateVal.endDate) : new Date(),
                    },
                  }}
                />
              </div>
            </div>
            {dateError && <small>{dateError}</small>}
            <div className={`${styles["datepicker-buttons-outer"]}`}>
              <Button text={"Apply"} className={(!customDateVal.beginDate || !customDateVal.endDate) ? "apply-btn-disable" : "apply-btn"} onClick={handleApplyCustomDate} disabled={!customDateVal.beginDate || !customDateVal.endDate}></Button>
              <Button text={"Cancel"} className={"cancel-btn"} onClick={handleCustomDateSelector}></Button>
            </div>
          </div>
        )}
      </section>

      {/* tab-view */}
      <section>
        <div className={`${styles["date-filter-teb"]}`}>
          <Button text="Date Range" className={"outline-text-btn"} />
        </div>
      </section>
      {/* mobile-view */}
      <section className={`${styles["calender-filer-outer"]}`}>
        <div className={`${styles["calender-filer"]}`}>
          <div className={styles.calenderDate}>
            <img src={insights.calender} alt="" />
          </div>
        </div>
      </section>
    </>
  );
}
