import { IDateRange } from "../../../../interfaces/filters";

import DateTypeFilter from "../../filter/date-type-filter";

interface LastUpdatedFilterProps {
  options: IDateRange;
  setOptions: (options: IDateRange) => void;
}

const DateUploadedFilter: React.FC<LastUpdatedFilterProps> = ({
  options,
  setOptions,
}) => {
  return (
    <DateTypeFilter
      options={options}
      setOptions={setOptions}
      filterKeyName="lastUpdated"
    />
  );
};

export default DateUploadedFilter;
