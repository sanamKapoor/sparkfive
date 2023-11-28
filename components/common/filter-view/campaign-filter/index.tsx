import React, { useContext, useEffect } from "react";

import { FilterContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import {
  CommonFilterProps,
  FilterAttributeVariants,
} from "../../../../interfaces/filters";
import OptionsData from "../../filter-option-popup/options-data";

interface CampaignFilterProps extends CommonFilterProps {}

const CampaignFilter: React.FC<CampaignFilterProps> = ({
  options,
  setOptions,
}) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { fetchValuesById } = useFilters([]);

  const fetchFilters = async () => {
    const newValues = await fetchValuesById(FilterAttributeVariants.CAMPAIGNS);
    setOptions(newValues);
  };

  useEffect(() => {
    fetchFilters();
  }, [activeSortFilter]);

  return (
    <OptionsData
      filterKey="filterCampaigns"
      dataKey="name"
      compareKey="id"
      options={options}
      setOptions={setOptions}
    />
  );
};

export default CampaignFilter;
