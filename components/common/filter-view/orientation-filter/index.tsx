import React from "react";
import { IFileTypeFilter } from "../../../../interfaces/filters";
import Divider from "../../filter-option-popup/divider";
import OptionDataItem from "../../filter-option-popup/option-data-item";

import styles from "../../filter-option-popup/options-data.module.css";

interface OrientationFilterProps {
  options: IFileTypeFilter[];
  setOptions: (data: unknown) => void;
  setFilters: (val: any) => void; //TODO
}

const OrientationFilter: React.FC<OrientationFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  const onSelectOrientation = (val: string) => {
    const index = options.findIndex((value) => value.name === val);
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);
    setFilters((prevState) => {
      return {
        filterOrientations:
          prevState?.filterOrientations?.length > 0
            ? [
                ...prevState?.filterOrientations,
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

  const onDeselectOrientation = (val: string) => {
    console.log("deselect: ", val);
    const index = options.findIndex((value) => value.name === val);
    if (index !== -1) {
      options[index].isSelected = false;
    }
    setOptions([...options]);

    let newFilters = options
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.name, name: item.name }));

    setFilters({
      filterOrientations: newFilters,
    });
  };

  return (
    <>
      <div className={styles["outer-wrapper"]}>
        {options.map((item) => (
          <div className={styles["grid-item"]} key={item.dpi}>
            <OptionDataItem
              name={item.name}
              count={item.count}
              isSelected={item.isSelected}
              onSelect={() => onSelectOrientation(item.name)}
              onDeselect={() => onDeselectOrientation(item.name)}
            />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default OrientationFilter;
