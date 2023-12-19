import React, { useContext, useEffect } from "react";
import {
  CommonFilterProps,
  FilterAttributeVariants,
} from "../../../../interfaces/filters";

import { FilterContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import OptionsData from "../../filter-option-popup/options-data";

interface FileTypeFilterProps extends CommonFilterProps {}

const FileTypeFilter: React.FC<FileTypeFilterProps> = ({
  options,
  setOptions,
}) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { fetchValuesById } = useFilters([]);

  const fetchFilters = async () => {
    const newValues = await fetchValuesById(FilterAttributeVariants.FILE_TYPES);
    setOptions(newValues);
  };

  useEffect(() => {
    fetchFilters();
  }, [activeSortFilter]);
  return (
    <OptionsData
      filterKey="filterFileTypes"
      dataKey="name"
      compareKey="name"
      options={options}
      setOptions={setOptions}
    />
  );
};

export default FileTypeFilter;
