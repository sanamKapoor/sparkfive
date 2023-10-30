import React from "react";

import { CommonFilterProps } from "../../../../interfaces/filters";
import OptionsData from "../../filter-option-popup/options-data";

interface CampaignFilterProps extends CommonFilterProps {}

const CampaignFilter: React.FC<CampaignFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <OptionsData
      filterKey="filterCampaigns"
      dataKey="name"
      compareKey="id"
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
    />
  );
};

export default CampaignFilter;
