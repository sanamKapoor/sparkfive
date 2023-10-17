import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { useState } from "react";
import { DateUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Utilities } from "../../../assets";
import { dateFilterOptions } from "../../../config/data/filter";
import IconClickable from "../buttons/icon-clickable";
import styles from "./date-uploaded.module.css";

interface DateUploadedProps {
  startDate: Date;
  endDate: Date;
  setStartDate: (val: Date) => void;
  setEndDate: (val: Date) => void;
}

const DateUploaded: React.FC<DateUploadedProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [activeInput, setActiveInput] = useState("");

  const handleStartDay = (value) => {
    toggleActiveInput("startDate");
    setStartDate(value);
  };
  const handleEndDay = (value) => {
    toggleActiveInput("endDate");
    setEndDate(value);
  };

  const toggleActiveInput = (input) => {
    if (input === activeInput) setActiveInput("");
    else setActiveInput(input);
  };

  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  const FORMAT = "MM/dd/yyyy";

  return (
    <div className={`${styles.container}`}>
      {dateFilterOptions.map((option) => (
        <div key={option} className={`${styles['outer-wrapper']}`}>
          <IconClickable src={Utilities.radioButtonNormal} />
          <span className={`${styles["select-name"]}`}>{option}</span>
        </div>
      ))}

      <div className={styles["dates-container"]}>
        <div  className={`${styles['outer-wrapper']}`}>
          <IconClickable src={Utilities.radioButtonNormal} />
          <span className={`${styles["select-name"]}`}>Custom Range</span>
        </div>
        <div className={styles["dates-wrapper"]}>
        <div>
          <DayPickerInput
        
            value={startDate}
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
          />
        </div>
        <div className={styles.line}></div>

        <div>
          <DayPickerInput
            value={endDate}
            formatDate={formatDate}
            format={FORMAT}
            parseDate={parseDate}
            classNames={{
              container: styles.input,
            }}
            onDayChange={(day) => handleEndDay(day)}
            placeholder={"mm/dd/yyyy"}
            dayPickerProps={{
              className: styles.calendar,
              disabledDays: {
                before: startDate,
              },
            }}
          />
        </div>

        </div>
      
      </div>
    </div>
  );
};

export default DateUploaded;
