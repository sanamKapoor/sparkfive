import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { useState } from "react";
import { DateUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Utilities } from "../../../assets";
import { dateRanges } from "../../../config/data/filter";
import { IDateRange } from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import styles from "./date-uploaded.module.css";

interface DateUploadedProps {
  data: IDateRange;
  setData: (options: IDateRange) => void;
  setFilters: (val: unknown) => void;
}

const DateUploaded: React.FC<DateUploadedProps> = ({
  data,
  setData,
  setFilters,
}) => {
  const [showCustomRange, setShowCustomRange] = useState(false);

  const onSelectDateRange = (dateRange: IDateRange) => {
    setData({
      last,
    });
  };

  const onDeselectDateRange = (dateRange: IDateRange) => {};

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
      {dateRanges.map((option) => (
        <div key={option.id} className={`${styles["outer-wrapper"]}`}>
          {option.id === data?.id ? (
            <IconClickable
              src={Utilities.radioButtonEnabled}
              onClick={() => onDeselectDateRange(option)}
            />
          ) : (
            <IconClickable
              src={Utilities.radioButtonNormal}
              onClick={() => onSelectDateRange(option)}
            />
          )}
          <span className={`${styles["select-name"]}`}>{option.label}</span>
        </div>
      ))}

      <div className={styles["dates-container"]}>
        <div className={`${styles["outer-wrapper"]}`}>
          {data?.id === "custom" ? (
            <IconClickable src={Utilities.radioButtonEnabled} />
          ) : (
            <IconClickable src={Utilities.radioButtonNormal} />
          )}
          <span className={`${styles["select-name"]}`}>Custom Range</span>
        </div>
        {showCustomRange && (
          <div className={styles["dates-wrapper"]}>
            <div>
              <DayPickerInput
                value={data.beginDate ?? new Date()}
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
                value={data.endDate ?? new Date()}
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
                    before: data.beginDate ?? new Date(),
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateUploaded;
