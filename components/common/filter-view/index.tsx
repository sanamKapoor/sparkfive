import React, { useState } from "react";
import useFilters from "../../../hooks/use-filters";
import { IAttribute } from "../../../interfaces/filters";
import FilterTabs from "./filter-tabs";
import SelectedFilters from "./selected-filters";

const FilterView: React.FC<{ setRender: any, render: boolean }> = ({ setRender = null, render = false }) => {
  const [attributes, setAttributes] = useState<IAttribute[]>([]);

  const { onClearAll, onRemoveFilter, selectedFilters } =
    useFilters(attributes, setRender);

  return (
    <>
      <FilterTabs attributes={attributes} setAttributes={(args) => {
        setAttributes(args);
        if (setRender) {
          setTimeout(() => {
            setRender(!render)
          })
        }

      }} />
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
