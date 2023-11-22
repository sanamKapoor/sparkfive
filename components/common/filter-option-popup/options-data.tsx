import React, { useContext } from "react";

import { FilterContext } from "../../../context";
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
}) => {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const onSelectOption = (data) => {
    const index = options.findIndex(
      (value) => value[compareKey] === data[compareKey]
    );
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);

    let newState;

    if (activeSortFilter[filterKey] && activeSortFilter[filterKey].length > 0) {
      newState = [
        ...new Set([
          ...activeSortFilter[filterKey],
          {
            value: data[compareKey],
            ...data,
          },
        ]),
      ];
    } else {
      newState = [
        {
          value: data[compareKey],
          ...data,
        },
      ];
    }
    setActiveSortFilter({
      ...activeSortFilter,
      [filterKey]: newState,
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
        ...item,
      }));

    setActiveSortFilter({
      ...activeSortFilter,
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
