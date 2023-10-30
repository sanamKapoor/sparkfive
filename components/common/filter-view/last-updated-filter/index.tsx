import { IDateRange } from "../../../../interfaces/filters";

import DateTypeFilter from "../../filter/date-type-filter";

interface LastUpdatedFilterProps {
  options: IDateRange;
  setOptions: (options: IDateRange) => void;
  setFilters: (val: unknown) => void;
}

const DateUploadedFilter: React.FC<LastUpdatedFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <DateTypeFilter
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
      filterKeyName="lastUpdated"
    />
  );
};

export default DateUploadedFilter;
