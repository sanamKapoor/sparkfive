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

interface DateUploadedFilterProps {
  data: IDateRange;
  setData: (options: IDateRange) => void;
  setFilters: (val: unknown) => void;
}

const DateUploadedFilter: React.FC<DateUploadedFilterProps> = ({
  data,
  setData,
  setFilters,
}) => {
  const [showCustomRange, setShowCustomRange] = useState(
    data?.id === "custom" ? true : false
  );
  const [activeInput, setActiveInput] = useState("");

  const onSelectDateRange = (dateRange: IDateRange) => {
    setData(dateRange);
    setFilters({
      dateUploaded: dateRange,
    });
  };

  const onDeselectDateRange = () => {
    setData(undefined);
    setFilters({
      dateUploaded: undefined,
    });
  };

  const handleStartDay = (value) => {
    setActiveInput("startDate");

    const obj = {
      id: "custom",
      label: "Custom Range",
      beginDate: value,
      endDate: data?.endDate,
    };
    setData(obj);
    setFilters({
      dateUploaded: obj,
    });
  };

  const handleEndDay = (value) => {
    setActiveInput("endDate");

    const obj = {
      id: "custom",
      label: "Custom Range",
      beginDate: data?.beginDate,
      endDate: value,
    };

    setData(obj);
    setFilters({ dateUploaded: obj });
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
  };

  const FORMAT = "MM/dd/yyyy";

  return (
    <div className={`${styles.container}`}>
      {dateRanges.map((option) => (
        <div key={option.id} className={`${styles["outer-wrapper"]}`}>
          {data && option.id === data?.id ? (
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
          {data?.id === "custom" ? (
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
        {showCustomRange ||
          (data?.id === "custom" && (
            <div className={styles["dates-wrapper"]}>
              <div>
                <DayPickerInput
                  value={data?.beginDate ?? new Date()}
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
                  value={data?.endDate ?? new Date()}
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
          ))}
      </div>
    </div>
  );
};

export default DateUploadedFilter;
