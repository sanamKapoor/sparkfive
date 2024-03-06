import React, { useEffect, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";

import styles from "./date-filter.module.css";
import { insights } from "../../../../assets";
import Button from "../../../common/buttons/button";
import { calculateBeginDate } from "../../../../config/data/filter";
import DateUtils from "../../../../utils/date";
import IconClickable from "../../../common/buttons/icon-clickable";
import DatePickerModal from "../modal/date-picker";
import { ANALYTICS_DATE_FORMAT, ANALYTICS_DATE_PLACEHOLDER } from "../../../../constants/analytics";

export default function DateFilter({ filter, setFilter, customDates, setCustomDates }) {
  const [activeFilter, setActiveFilter] = useState("7d");
  const [activeDays, setActiveDays] = useState(7);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customDateVal, setCustomDateVal] = useState({
    endDate: "",
    beginDate: "",
  });
  const [dateError, setDateError] = useState("");
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [tabView, setTabView] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const handleFilterClick = (filter, days) => {
    setShowCustomRange(false);
    setShowDatePopup(false);
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

  const calcelCustomDates = () => {
    if (showCustomRange) {
      handleFilterClick("7d", 7);
    } else {
      setActiveFilter("custom");
      setCustomDateVal({
        endDate: "",
        beginDate: "",
      });
    }
  }

  const handleCustomDateSelector = () => {
    if (tabView || mobileView) {
      setShowDatePopup(false)
    } else {
      calcelCustomDates()
      setShowDatePopup(!showDatePopup)
    }
  };

  const handleStartDay = (value) => {
    const validDate = DateUtils.parseDateToStringForAnalytics(value);

    setCustomDateVal((prev) => ({
      ...prev,
      beginDate: validDate ? validDate : "",
    }));
  };

  const handleEndDay = (value) => {
    const validDate = DateUtils.parseDateToStringForAnalytics(value);
    setCustomDateVal((prev) => ({
      ...prev,
      endDate: validDate ? validDate : "",
    }));
  };

  const handleApplyCustomDate = () => {
    console.log({ customDateVal });

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
    setShowDatePopup(false);
  };

  useEffect(() => {
    if (customDates && filter !== null && showCustomRange) {
      setCustomDateVal({
        beginDate: new Date(filter.beginDate).toDateString(),
        endDate: new Date(filter.endDate).toDateString(),
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
              onClick={() => {
                handleCustomDateSelector()
                setShowCustomRange(!showCustomRange);
              }}
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
            }} />
          </div>
        </section>

        {/* mobile-view button */}
        <section className={`${styles["calender-filer-outer"]}`}>
          <div className={`${styles["calender-filer"]}`}>
            <div className={styles.calenderDate} onClick={() => {
              setMobileView(!mobileView)
            }}>
              <img src={insights.calender} alt="" />
            </div>
          </div>
        </section>

        {/* web-view custom dates */}
        {
          (showDatePopup) && (
            <div className={`${styles["date-picker-wrapper"]} ${styles["date-picker-wrapper-web"]}`}>
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

              {showCustomRange && <div className={`${styles["date-filters"]}`}>
                <div className={styles.dummy}>
                  <label className={styles.label} htmlFor="">
                    From Date
                  </label>
                  <DayPickerInput
                    onDayChange={(day) => handleStartDay(day)}
                    value={
                      customDateVal.beginDate
                      && new Date(customDateVal.beginDate)
                    }
                    dayPickerProps={{
                      disabledDays: {
                        before: calculateBeginDate(365, 1),
                        after: customDateVal.endDate ? new Date(customDateVal.endDate) : new Date(),
                      },
                    }}
                    placeholder={ANALYTICS_DATE_PLACEHOLDER}
                    formatDate={DateUtils.formatDate}
                    format={ANALYTICS_DATE_FORMAT}
                    parseDate={DateUtils.parseDate}
                  />
                </div>
                <div className={styles.dummy}>
                  <label className={styles.label} htmlFor="">
                    To Date
                  </label>
                  <DayPickerInput
                    onDayChange={(day) => handleEndDay(day)}
                    value={
                      customDateVal.endDate
                      && new Date(customDateVal.endDate)
                    }
                    dayPickerProps={{
                      className: styles.calendar,
                      disabledDays: {
                        before: customDateVal.beginDate ? new Date(customDateVal.beginDate) : calculateBeginDate(365, 1),
                        after: new Date(),
                      },
                    }}
                    placeholder={ANALYTICS_DATE_PLACEHOLDER}
                    formatDate={DateUtils.formatDate}
                    format={ANALYTICS_DATE_FORMAT}
                    parseDate={DateUtils.parseDate}
                  />
                </div>
              </div>}
              {dateError && <small>{dateError}</small>}
              <div className={`${styles["datepicker-buttons-outer"]}`}>
                <Button text={"Cancel"} className={"cancel-btn"} onClick={handleCustomDateSelector}></Button>
                <Button
                  text={"Apply"}
                  className={!customDateVal.beginDate || !customDateVal.endDate ? "apply-btn-disable" : "apply-btn"}
                  onClick={handleApplyCustomDate}
                  disabled={!customDateVal.beginDate || !customDateVal.endDate}
                ></Button>
              </div>
            </div>
          )
        }
      </div>
      {/* mobile-view dates */}
      {(mobileView || tabView) &&
        <DatePickerModal
          activeFilter={activeFilter}
          activeDays={activeDays}
          handleStartDay={handleStartDay}
          handleEndDay={handleEndDay}
          customDateVal={customDateVal}
          dateError={dateError}
          handleApplyCustomDate={handleApplyCustomDate}
          showCustomRange={showCustomRange}
          setShowCustomRange={setShowCustomRange}
          setMobileView={setMobileView}
          setTabView={setTabView}
          setActiveFilter={setActiveFilter}
          setActiveDays={setActiveDays}
          setFilter={setFilter}
          setCustomDateVal={setCustomDateVal}
          setCustomDates={setCustomDates}
          customDates={customDates}
          tabView={tabView}
          mobileView={mobileView}
          setDateError={setDateError}
        />}
    </>
  );
}
