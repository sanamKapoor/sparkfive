import React, { useContext, useEffect } from "react";

import { FilterContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import {
  CommonFilterProps,
  FilterAttributeVariants,
} from "../../../../interfaces/filters";
import OptionsData from "../../filter-option-popup/options-data";

interface AiTagsFilterProps extends CommonFilterProps {}

const AiTagsFilter: React.FC<AiTagsFilterProps> = ({ options, setOptions }) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { fetchValuesById } = useFilters([]);
  const fetchFilters = async () => {
    const newValues = await fetchValuesById(FilterAttributeVariants.AI_TAGS);
    setOptions(newValues);
  };

  useEffect(() => {
    fetchFilters();
  }, [activeSortFilter]);

  return (
    <OptionsData
      filterKey="filterAiTags"
      dataKey="name"
      compareKey="id"
      options={options}
      setOptions={setOptions}
    />
  );
};

export default AiTagsFilter;
