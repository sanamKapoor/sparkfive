import React, { useEffect, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";

import styles from "./date-filter.module.css";
import { insights } from "../../../../assets";
import Button from "../../../common/buttons/button";
import { calculateBeginDate } from "../../../../config/data/filter";
import DateUtils from "../../../../utils/date";
import IconClickable from "../../../common/buttons/icon-clickable";
import { Utilities } from "../../../../assets";
import DatePickerModal from "../modal/date-picker";

export default function DateFilter({ filter, setFilter, customDates, setCustomDates }) {
  const [activeFilter, setActiveFilter] = useState("7d");
  const [activeDays, setActiveDays] = useState(7);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customDateVal, setCustomDateVal] = useState({
    endDate: "",
    beginDate: "",
  });
  const [dateError, setDateError] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [tabView, setTabView] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const handleFilterClick = (filter, days) => {
    setShowCustomRange(false);
    setActiveFilter(filter);
    setCustomDates(false);
    if (days !== activeDays) {
      setFilter({
        endDate: new Date(),
        beginDate: calculateBeginDate(days, 1),
      });
    }
    setActiveDays(days);
  };

  const handleCustomDateSelector = () => {
    if (showCustomRange) {
      handleFilterClick("7d", 7);
    } else {
      setActiveFilter("custom");
      setCustomDateVal({
        endDate: "",
        beginDate: "",
      });
    }
    setShowCustomRange(!showCustomRange);
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
      setDateError("Invalid Dates.");
      return;
    }
    setActiveDays(DateUtils.daysBetweenDates(customDateVal.beginDate, customDateVal.endDate));
    setFilter(customDateVal);
    setCustomDates(true);
  };

  const handleClosePopup = () => {
    if (customDates) {
      setShowCustomRange(false);
    } else {
      handleCustomDateSelector();
    }
    if (tabView) setTabView(false);
  };

  useEffect(() => {
    if (customDates && filter !== null && showCustomRange) {
      setCustomDateVal({
        beginDate: filter.beginDate.toDateString(),
        endDate: filter.endDate.toDateString(),
      });
    }
  }, [customDates, showCustomRange]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDateError("");
    }, 4000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [dateError]);

  useEffect(() => {
    setDateError("");
  }, []);

  return (
    <>
    
    <div className={styles.dateOuterBox}>
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
      </section>

      {/* tab-view button */}
      <section>
        <div className={`${styles["date-filter-teb"]}`}>
          <Button text="Date Range" className={"outline-text-btn"} onClick={() => {
            setTabView(!tabView)
            setShowCustomRange(true)
          }} />
        </div>
      </section>

      {/* mobile-view button */}
      <section className={`${styles["calender-filer-outer"]}`}>
        <div className={`${styles["calender-filer"]}`}>
          <div className={styles.calenderDate} onClick={() => {
            setMobileView(!mobileView)
            setShowCustomRange(true)
          }}>
            <img src={insights.calender} alt="" />
          </div>
        </div>
      </section>

      {/* web-view custom dates */}
      {
        (showCustomRange) && (
          <div className={`${styles["date-picker-wrapper"]}`}>
            <div className={`${styles["date-picker-top"]}`}>
              <div className={`${styles["left-side"]}`}>Date Range</div>
              <div className={`${styles["right-side"]}`}>
                <IconClickable
                  src={insights.insightClose}
                  additionalClass={styles["close-icon"]}
                  onClick={handleClosePopup}
                />
              </div>
            </div>

            {/* tab-view dates */}
            {
              tabView &&
              <div className={`${styles["date-range-mobile"]}`}>
                <div className={styles.radioButtons}>
                  <div
                    className={`${styles.circle} ${activeFilter === "7d" && styles.active}`}
                    onClick={() => handleFilterClick("7d", 7)}
                  >
                    {activeFilter === "7d" && <img src={Utilities.radio} />}
                  </div>
                  <label className={styles.radioLabel} htmlFor="7d">
                    7 Day
                  </label>
                </div>
                <div className={styles.radioButtons}>
                  <div
                    className={`${styles.circle} ${activeFilter === "1m" && styles.active}`}
                    onClick={() => handleFilterClick("1m", 30)}
                  >
                    {activeFilter === "1m" && <img src={Utilities.radio} />}
                  </div>
                  <label className={styles.radioLabel} htmlFor="1m">
                    1 Month
                  </label>
                </div>
                <div className={styles.radioButtons}>
                  <div
                    className={`${styles.circle} ${activeFilter === "6m" && styles.active}`}
                    onClick={() => handleFilterClick("6m", 182)}
                  >
                    {activeFilter === "6m" && <img src={Utilities.radio} />}
                  </div>
                  <label className={styles.radioLabel} htmlFor="6m">
                    6 Month
                  </label>
                </div>
                <div className={styles.radioButtons}>
                  <div
                    className={`${styles.circle} ${activeFilter === "12m" && styles.active}`}
                    onClick={() => handleFilterClick("12m", 365)}
                  >
                    {activeFilter === "12m" && <img src={Utilities.radio} />}
                  </div>
                  <label className={styles.radioLabel} htmlFor="12m">
                    12 Month
                  </label>
                </div>
                <div className={styles.radioButtons}>
                  <div
                    className={`${styles.circle} ${activeFilter === "custom" && styles.active}`}
                    onClick={handleCustomDateSelector}
                  >
                    {activeFilter === "custom" && <img src={Utilities.radio} />}
                  </div>
                  <label className={styles.radioLabel} htmlFor="custom">
                    Custom Range
                  </label>
                </div>
              </div>
            }

            <div className={`${styles["date-filters"]}`}>
              <div className={styles.dummy}>
                <label className={styles.label} htmlFor="">
                  From Date
                </label>
                <DayPickerInput
                  onDayChange={(day) => handleStartDay(day)}
                  value={
                    customDateVal.beginDate !== null
                      ? DateUtils.parseDateToStringForAnalytics(customDateVal.beginDate)
                      : ""
                  }
                  dayPickerProps={{
                    disabledDays: {
                      before: calculateBeginDate(365, 1),
                      after: customDateVal.endDate ? new Date(customDateVal.endDate) : new Date(),
                    },
                  }}
                />
              </div>
              <div className={styles.dummy}>
                <label className={styles.label} htmlFor="">
                  To Date
                </label>
                <DayPickerInput
                  onDayChange={(day) => handleEndDay(day)}
                  value={
                    customDateVal.endDate !== null ? DateUtils.parseDateToStringForAnalytics(customDateVal.endDate) : ""
                  }
                  dayPickerProps={{
                    className: styles.calendar,
                    disabledDays: {
                      before: customDateVal.beginDate ? new Date(customDateVal.beginDate) : calculateBeginDate(365, 1),
                      after: new Date(),
                    },
                  }}
                />
              </div>
            </div>
            {dateError && <small>{dateError}</small>}
            <div className={`${styles["datepicker-buttons-outer"]}`}>
              <Button
                text={"Apply"}
                className={!customDateVal.beginDate || !customDateVal.endDate ? "apply-btn-disable" : "apply-btn"}
                onClick={handleApplyCustomDate}
                disabled={!customDateVal.beginDate || !customDateVal.endDate}
              ></Button>
              <Button text={"Cancel"} className={"cancel-btn"} onClick={handleCustomDateSelector}></Button>
            </div>
          </div>
        )
      }
    </div>
    {/* mobile-view dates */}
    {mobileView &&
        <DatePickerModal
          handleClosePopup={handleClosePopup}
          activeFilter={activeFilter}
          handleFilterClick={handleFilterClick}
          handleCustomDateSelector={handleCustomDateSelector}
          handleStartDay={handleStartDay}
          handleEndDay={handleEndDay}
          customDateVal={customDateVal}
          dateError={dateError}
          handleApplyCustomDate={handleApplyCustomDate}
          showCustomRange={showCustomRange}
          setMobileView={setMobileView}
        />}
    </>
  );
}
