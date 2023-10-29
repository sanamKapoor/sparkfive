import React from "react";
import { IFileTypeFilter } from "../../../../interfaces/filters";
import Divider from "../../filter-option-popup/divider";
import OptionDataItem from "../../filter-option-popup/option-data-item";

import styles from "../../filter-option-popup/options-data.module.css";

interface FileTypeFilterProps {
  options: IFileTypeFilter[];
  setOptions: (data: unknown) => void;
  setFilters: (val: any) => void; //TODO
}

const FileTypeFilter: React.FC<FileTypeFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  const onSelectFileType = (val: string) => {
    const index = options.findIndex((value) => value.name === val);
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);
    setFilters((prevState) => {
      return {
        filterFileTypes:
          prevState?.filterFileTypes?.length > 0
            ? [
                ...prevState?.filterFileTypes,
                {
                  value: val,
                  name: val,
                },
              ]
            : [
                {
                  value: val,
                  name: val,
                },
              ],
      };
    });
  };

  const onDeselectFileType = (val: string) => {
    const index = options.findIndex((value) => value.name === val);
    if (index !== -1) {
      options[index].isSelected = false;
    }
    setOptions([...options]);

    let newFilters = options
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.name, name: item.name }));

    setFilters({
      filterFileTypes: newFilters,
    });
  };

  return (
    <>
      <div className={styles["outer-wrapper"]}>
        {options.map((item, index) => (
          <div className={styles["grid-item"]} key={index}>
            <OptionDataItem
              name={item.name}
              count={item.count}
              isSelected={item.isSelected}
              onSelect={() => onSelectFileType(item.name)}
              onDeselect={() => onDeselectFileType(item.name)}
            />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default FileTypeFilter;
