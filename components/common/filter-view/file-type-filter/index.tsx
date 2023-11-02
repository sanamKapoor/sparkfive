import React from "react";
import { CommonFilterProps } from "../../../../interfaces/filters";

import OptionsData from "../../filter-option-popup/options-data";

interface FileTypeFilterProps extends CommonFilterProps {}

const FileTypeFilter: React.FC<FileTypeFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <OptionsData
      filterKey="filterFileTypes"
      dataKey="name"
      compareKey="name"
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
    />
  );
};

export default FileTypeFilter;
