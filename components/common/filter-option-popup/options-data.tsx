import React from "react";

import { OptionsDataProps } from "../../../interfaces/filters";
import Divider from "./divider";
import OptionDataItem from "./option-data-item";
import styles from "./options-data.module.css";

const OptionsData: React.FC<OptionsDataProps> = ({
  filterKey,
  dataKey,
  compareKey,
  options,
  setOptions,
  setFilters,
}) => {
  const onSelectOption = (data) => {
    const index = options.findIndex(
      (value) => value[compareKey] === data[compareKey]
    );
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);
    setFilters((prevState) => {
      return {
        [filterKey]:
          prevState && prevState[filterKey]?.length > 0
            ? [
                ...prevState[filterKey],
                {
                  value: data[compareKey],
                  ...data,
                },
              ]
            : [
                {
                  value: data[compareKey],
                  ...data,
                },
              ],
      };
    });
  };

  const onDeselectOption = (data) => {
    const index = options.findIndex(
      (value) => value[compareKey] === data[compareKey]
    );
    if (index !== -1) {
      options[index].isSelected = false;
    }
    setOptions([...options]);

    let newFilters = options
      .filter((item) => item.isSelected)
      .map((item) => ({
        value: item[compareKey],
        ...data,
      }));

    setFilters({
      [filterKey]: newFilters,
    });
  };

  return (
    <>
      <div className={styles["outer-wrapper"]}>
        {options.length === 0 ? (
          <p>No Results Found.</p>
        ) : (
          options.map((item, index) => (
            <div className={styles["grid-item"]} key={index}>
              <OptionDataItem
                name={item[dataKey]}
                count={item.count}
                isSelected={item.isSelected}
                onSelect={() => onSelectOption(item)}
                onDeselect={() => onDeselectOption(item)}
              />
            </div>
          ))
        )}
      </div>
      <Divider />
    </>
  );
};

export default OptionsData;
