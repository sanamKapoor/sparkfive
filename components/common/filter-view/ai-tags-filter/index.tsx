import React from "react";

import { CommonFilterProps } from "../../../../interfaces/filters";
import OptionsData from "../../filter-option-popup/options-data";

interface AiTagsFilterProps extends CommonFilterProps {}

const AiTagsFilter: React.FC<AiTagsFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <OptionsData
      filterKey="filterAiTags"
      dataKey="name"
      compareKey="id"
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
    />
  );
};

export default AiTagsFilter;
