import React from "react";
import { CommonFilterProps } from "../../../../interfaces/filters";

import OptionsData from "../../filter-option-popup/options-data";

interface TagsFilterProps extends CommonFilterProps {}

const TagsFilter: React.FC<TagsFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <OptionsData
      filterKey="filterNonAiTags"
      dataKey="name"
      compareKey="id"
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
    />
  );
};

export default TagsFilter;
