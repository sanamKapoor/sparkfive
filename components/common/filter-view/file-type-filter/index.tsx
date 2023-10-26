import React from "react";
import { IFileTypeFilter } from "../../../../interfaces/filters";
import Divider from "../../filter-option-popup/divider";
import OptionDataItem from "../../filter-option-popup/option-data-item";

import styles from "../../filter-option-popup/options-data.module.css";

interface FileTypeFilterProps {
  values: IFileTypeFilter[];
  setValues: (data: unknown) => void;
  setFilters: (val: any) => void; //TODO
}

const FileTypeFilter: React.FC<FileTypeFilterProps> = ({
  values,
  setValues,
  setFilters,
}) => {
  const onSelectFileType = (val: string) => {
    const index = values.findIndex((value) => value.name === val);
    if (index !== -1) {
      values[index].isSelected = true;
    }
    setValues([...values]);
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
    const index = values.findIndex((value) => value.name === val);
    if (index !== -1) {
      values[index].isSelected = false;
    }
    setValues([...values]);

    let newFilters = values
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.name, name: item.name }));

    setFilters({
      filterFileTypes: newFilters,
    });
  };

  return (
    <>
      <div className={styles["outer-wrapper"]}>
        {values.map((item) => (
          <div className={styles["grid-item"]} key={item.dpi}>
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
