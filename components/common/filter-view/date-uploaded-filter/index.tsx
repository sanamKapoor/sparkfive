import { IDateRange } from "../../../../interfaces/filters";

import DateTypeFilter from "../../filter/date-type-filter";

interface DateUploadedFilterProps {
  options: IDateRange;
  setOptions: (options: IDateRange) => void;
  setFilters: (val: unknown) => void;
}

const DateUploadedFilter: React.FC<DateUploadedFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <DateTypeFilter
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
      filterKeyName="dateUploaded"
    />
  );
};

export default DateUploadedFilter;
