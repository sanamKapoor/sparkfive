import React, { useState } from "react";

import useFilters from "../../../hooks/use-filters";
import { IAttribute } from "../../../interfaces/filters";
import FilterTabs from "./filter-tabs";
import SelectedFilters from "./selected-filters";

const FilterView = () => {
  const [attributes, setAttributes] = useState<IAttribute[]>([]);

  const { onClearAll, onRemoveFilter, selectedFilters } =
    useFilters(attributes);

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
