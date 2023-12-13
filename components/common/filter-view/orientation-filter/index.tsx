import React, { useContext, useEffect } from "react";
import {
  CommonFilterProps,
  FilterAttributeVariants,
} from "../../../../interfaces/filters";

import { FilterContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import OptionsData from "../../filter-option-popup/options-data";

interface OrientationFilterProps extends CommonFilterProps {}

const OrientationFilter: React.FC<OrientationFilterProps> = ({
  options,
  setOptions,
}) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { fetchValuesById } = useFilters([]);

  const fetchFilters = async () => {
    const newValues = await fetchValuesById(
      FilterAttributeVariants.ORIENTATION
    );
    setOptions(newValues);
  };

  useEffect(() => {
    fetchFilters();
  }, [activeSortFilter]);

  return (
    <OptionsData
      filterKey="filterOrientations"
      dataKey="name"
      compareKey="name"
      options={options}
      setOptions={setOptions}
    />
  );
};

export default OrientationFilter;
