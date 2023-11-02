import React, { useContext, useState } from "react";

import { FilterContext } from "../../../context";
import useFilters from "../../../hooks/use-filters";
import { IAttribute } from "../../../interfaces/filters";
import FilterTabs from "./filter-tabs";
import SelectedFilters from "./selected-filters";

const FilterView = () => {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const [attributes, setAttributes] = useState<IAttribute[]>([]);

  const { onClearAll, onRemoveFilter, selectedFilters } = useFilters(
    attributes,
    activeSortFilter,
    setActiveSortFilter
  );

  return (
    <>
      <FilterTabs attributes={attributes} setAttributes={setAttributes} />
      {selectedFilters.length > 0 && (
        <SelectedFilters
          data={selectedFilters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAll}
        />
      )}
    </>
  );
};

export default FilterView;
