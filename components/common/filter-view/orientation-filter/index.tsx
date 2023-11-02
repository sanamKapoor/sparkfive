import React from "react";
import { CommonFilterProps } from "../../../../interfaces/filters";

import OptionsData from "../../filter-option-popup/options-data";

interface OrientationFilterProps extends CommonFilterProps {}

const OrientationFilter: React.FC<OrientationFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <OptionsData
      filterKey="filterOrientations"
      dataKey="name"
      compareKey="name"
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
    />
  );
};

export default OrientationFilter;
