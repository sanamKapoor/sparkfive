import React, { useState } from 'react';
import dateFnsFormat from "date-fns/format";

import styles from "./date-filter.module.css";
import DayPickerInput from 'react-day-picker/types/DayPickerInput';
import { insights } from "../../../assets";
import Button from '../../common/buttons/button';

const FORMAT = "MM/dd/yyyy";

export default function DateFilter() {
  const [activeFilter, setActiveFilter] = useState('7d');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    
  };

  const formatDate = (date, format, locale?) => {
    return dateFnsFormat(date, format, { locale });
  };

  const handleStartDay = (value) => {
    setActiveInput("startDate");

    const obj = {
      id: "custom",
      label: getLabelForCustomRangeInput(value, options?.endDate),
      beginDate: value,
      endDate: options?.endDate,
    };
    setOptions(obj);

    setActiveSortFilter({
      ...activeSortFilter,
      [filterKeyName]: obj,
    });
  };

  const handleEndDay = (value) => {
    setActiveInput("endDate");

    const obj = {
      id: "custom",
      label: getLabelForCustomRangeInput(options?.beginDate, value),
      beginDate: options?.beginDate,
      endDate: value,
    };

    setOptions(obj);
    setActiveSortFilter({
      ...activeSortFilter,
      [filterKeyName]: obj,
    });
  };

  return (
    <>
    {/* web-view  */}
    <section className={styles.dateFilter}>
      <div className={styles.gridBox}>
        <div
          className={`${styles['data']} ${activeFilter === '7d' && styles['active']}`}
          onClick={() => handleFilterClick('7d')}
        >
          7d
        </div>
        <div
          className={`${styles['data']} ${activeFilter === '1m' && styles['active']}`}
          onClick={() => handleFilterClick('1m')}
        >
          1m
        </div>
        <div
          className={`${styles['data']} ${activeFilter === '6m' && styles['active']}`}
          onClick={() => handleFilterClick('6m')}
        >
          6m
        </div>
        <div
          className={`${styles['data']} ${activeFilter === '12m' && styles['active']}`}
          onClick={() => handleFilterClick('12m')}
        >
          12m
        </div>
        <div className={styles.data} onClick={() => handleFilterClick('custom')}>
          <img src={insights.calender} alt="" />
        </div>
        {/* <DayPickerInput
                value={options?.beginDate}
                formatDate={formatDate}
                format={FORMAT}
                parseDate={parseDate}
                classNames={{
                  container: `${styles.input} dayPicker`,
                }}
                onDayChange={(day) => handleStartDay(day)}
                placeholder={"mm/dd/yyyy"}
                dayPickerProps={{
                  className: styles.calendar,
                }}
              /> */}
      </div>
      </section>
   
 {/* tab-view */}
 <section>
    <div className={`${styles['date-filter-teb']}`}>
    <Button text="Date Range" className={'outline-text-btn'}/>
    </div>
   </section>
   {/* mobile-view */}
   <section className={`${styles['calender-filer-outer']}`} >
    <div className={`${styles['calender-filer']}`}>
    <div className={styles.calenderDate} onClick={() => handleFilterClick('custom')}>
          <img src={insights.calender} alt="" />
        </div>
    </div>
   

   </section>
 </>
    
  );
}
