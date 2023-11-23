import React, { useContext, useEffect } from "react";
import {
  CommonFilterProps,
  FilterAttributeVariants,
} from "../../../../interfaces/filters";

import { FilterContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import OptionsData from "../../filter-option-popup/options-data";

interface TagsFilterProps extends CommonFilterProps {}

const TagsFilter: React.FC<TagsFilterProps> = ({ options, setOptions }) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { fetchValuesById } = useFilters([]);
  const fetchFilters = async () => {
    const newValues = await fetchValuesById(FilterAttributeVariants.TAGS);
    setOptions(newValues);
  };

  useEffect(() => {
    fetchFilters();
  }, [activeSortFilter]);

  return (
    <OptionsData
      filterKey="filterNonAiTags"
      dataKey="name"
      compareKey="id"
      options={options}
      setOptions={setOptions}
    />
  );
};

export default TagsFilter;
