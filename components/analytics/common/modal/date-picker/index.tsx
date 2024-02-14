import React from 'react'
import DayPickerInput from "react-day-picker/DayPickerInput"
import modalStyles from "./date-picker.module.css"
import styles from "../../date-filter/date-filter.module.css";

import { Utilities } from "../../../../../assets";
import { insights } from "../../../../../assets"
import IconClickable from '../../../../common/buttons/icon-clickable'
import Button from '../../../../common/buttons/button'
import { calculateBeginDate } from '../../../../../config/data/filter';
import DateUtils from "../../../../../utils/date";

const DatePickerModal = ({
  handleClosePopup,
  activeFilter,
  handleFilterClick,
  handleCustomDateSelector,
  handleStartDay,
  handleEndDay,
  customDateVal,
  dateError,
  handleApplyCustomDate,
  showCustomRange,
  setMobileView
}) => {
  return (
    <div className={`${modalStyles.backdrop}`}>
      <section className={`${modalStyles["modal-outer"]}`}>
        <div className={`${styles["date-picker-wrapper"]}`}>
          <div className={`${styles["date-picker-top"]}`}>
            <div className={`${styles["left-side"]}`}>Date Range</div>
            <div className={`${styles["right-side"]}`}>
              <IconClickable
                src={insights.insightClose}
                additionalClass={styles["close-icon"]}
                onClick={() => {
                  setMobileView(false)
                }}
              />
            </div>
          </div>

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

          {showCustomRange &&
            <>
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
            </>}
        </div>
      </section>
    </div>
  )
}

export default DatePickerModal