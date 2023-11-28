import { IDateRange } from "../../../../interfaces/filters";

import DateTypeFilter from "../../filter/date-type-filter";

interface DateUploadedFilterProps {
  options: IDateRange;
  setOptions: (options: IDateRange) => void;
}

const DateUploadedFilter: React.FC<DateUploadedFilterProps> = ({
  options,
  setOptions,
}) => {
  return (
    <DateTypeFilter
      options={options}
      setOptions={setOptions}
      filterKeyName="dateUploaded"
    />
  );
};

export default DateUploadedFilter;
