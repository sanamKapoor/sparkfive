import React, { useContext, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";

import styles from "./date-filter.module.css";
import { insights } from "../../../../assets";
import Button from "../../../common/buttons/button";
import { AnalyticsContext } from "../../../../context";
import { calculateBeginDate } from "../../../../config/data/filter";

import dateStyles from "../../../common/filter/date-uploaded.module.css";
import IconClickable from "../../../common/buttons/icon-clickable";

const FORMAT = "MM/dd/yyyy";

export default function DateFilter() {
  const { filter, setFilter } = useContext(AnalyticsContext);
  const [activeFilter, setActiveFilter] = useState("7d");
  const [showCustomRange, setShowCustomRange] = useState(false);


  const handleFilterClick = (filter, days) => {
    setShowCustomRange(false);
    setActiveFilter(filter);
    setFilter((prev) => ({
      endDate: new Date(),
      beginDate: calculateBeginDate(days),
    }));
  };

  const handleCustomDateSelector = () => {
    setActiveFilter("custom");
    setShowCustomRange(!showCustomRange);
  };

  const handleStartDay = (value) => {
    setFilter((prev) => ({
      ...prev,
      beginDate: value,
    }));
  };

  const handleEndDay = (value) => {
    setFilter((prev) => ({
      ...prev,
      endDate: value,
    }));
  };


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
                <Button text={"Clear"} className={"text-success-btn"}></Button>
                <IconClickable  src={insights.insightClose} additionalClass={styles["close-icon"]}   onClick={() => handleFilterClick("custom", 3) }   />
              </div> 
            </div>
            <div className={`${styles["date-filters"]}`}>
             
              <div className={styles.dummy}>
              <label className={styles.label} htmlFor="">From Date</label>
                <DayPickerInput
                  format={FORMAT}
                  onDayChange={(day) => handleStartDay(day)}
                  placeholder={"MM/DD/YY"}
                  dayPickerProps={{
                    className: styles.calendar,
                  }}
                />
              </div>
              <div className={styles.dummy}>
              <label  className={styles.label} htmlFor="">To Date</label>
                <DayPickerInput
                  format={FORMAT}
                  onDayChange={(day) => handleEndDay(day)}
                  placeholder={"MM//DD/YY"}
                  dayPickerProps={{
                    className: styles.calendar,
                    disabledDays: {
                      before: filter?.beginDate,
                    },
                  }}
                />
              </div>
            </div>
            <div className={`${styles["datepicker-buttons-outer"]}`}>
              <Button text={"Apply"} className={"apply-btn"}></Button>
              <Button text={"Cancel"} className={"cancel-btn"}></Button>

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
