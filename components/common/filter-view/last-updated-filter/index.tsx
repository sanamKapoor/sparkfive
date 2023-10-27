import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { useState } from "react";
import { DateUtils } from "react-day-picker";
import { Utilities } from "../../../../assets";
import { dateRanges } from "../../../../config/data/filter";
import { IDateRange } from "../../../../interfaces/filters";
import IconClickable from "../../buttons/icon-clickable";

import DayPickerInput from "react-day-picker/DayPickerInput";
import styles from "../../filter/date-uploaded.module.css";

interface LastUpdatedFilterProps {
  options: IDateRange;
  setOptions: (options: IDateRange) => void;
  setFilters: (val: unknown) => void;
}

const LastUpdatedFilter: React.FC<LastUpdatedFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [activeInput, setActiveInput] = useState("");

  const onSelectDateRange = (dateRange: IDateRange) => {
    setOptions(dateRange);
    setFilters({
      lastUpdated: dateRange,
    });
  };

  const onDeselectDateRange = () => {
    setOptions(undefined);
    setFilters({
      lastUpdated: undefined,
    });
  };

  const handleStartDay = (value) => {
    setActiveInput("startDate");

    const obj = {
      ...options,
      beginDate: value,
      endDate: options?.endDate,
    };
    setOptions(obj);
    setFilters({
      lastUpdated: obj,
    });
  };

  const handleEndDay = (value) => {
    setActiveInput("endDate");

    const obj = {
      ...options,
      beginDate: options?.beginDate,
      endDate: value,
    };

    setOptions(obj);
    setFilters({ lastUpdated: obj });
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

  const onDeselectCustomRange = () => {
    setShowCustomRange(false);
  };

  const onSelectCustomRange = () => {
    setShowCustomRange(true);
    setOptions({
      id: "custom",
      label: "Custom Range",
      beginDate: undefined,
      endDate: undefined,
    });
  };

  const FORMAT = "MM/dd/yyyy";

  return (
    <div className={`${styles.container}`}>
      {dateRanges.map((option) => (
        <div key={option.id} className={`${styles["outer-wrapper"]}`}>
          {options && option.id === options?.id ? (
            <IconClickable
              src={Utilities.radioButtonEnabled}
              onClick={() => onDeselectDateRange()}
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
          {options?.id === "custom" ? (
            <IconClickable
              src={Utilities.radioButtonEnabled}
              onClick={onDeselectCustomRange}
            />
          ) : (
            <IconClickable
              src={Utilities.radioButtonNormal}
              onClick={onSelectCustomRange}
            />
          )}
          <span className={`${styles["select-name"]}`}>Custom Range</span>
        </div>
        {showCustomRange && (
          <div className={styles["dates-wrapper"]}>
            <div>
              <DayPickerInput
                value={options?.beginDate ?? new Date()}
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
                value={options?.endDate ?? new Date()}
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
                    before: data?.beginDate ?? new Date(),
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

export default LastUpdatedFilter;
