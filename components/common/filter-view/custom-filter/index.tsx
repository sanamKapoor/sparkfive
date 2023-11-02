import React from "react";

import {
  CommonFilterProps,
  IAttributeValue,
} from "../../../../interfaces/filters";
import Divider from "../../filter-option-popup/divider";
import OptionDataItem from "../../filter-option-popup/option-data-item";
import styles from "../../filter-option-popup/options-data.module.css";
import NoResults from "../../UI/NoResultsPopup";

interface CustomFilterProps extends CommonFilterProps {}

const CustomFilter: React.FC<CustomFilterProps> = ({
  options,
  setOptions,
  setFilters,
  activeAttribute,
}) => {
  const onSelectValue = (data: IAttributeValue) => {
    const index = options.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);
    const filterKey = `custom-p${activeAttribute?.id}`;

    setFilters((prevState) => {
      return {
        [filterKey]:
          prevState && prevState[filterKey]?.length > 0
            ? [
                ...(prevState && prevState[filterKey]),
                { ...data, value: data.id, label: data.name },
              ]
            : [{ ...data, value: data.id, label: data.name }],
      };
    });
  };

  const onDeselectValue = (data: IAttributeValue) => {
    const index = options.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      options[index].isSelected = false;
    }
    setOptions([...options]);

    const newFilters = options
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.id, ...item }));

    const filterKey = `custom-p${activeAttribute?.id}`;

    setFilters({
      [filterKey]: newFilters,
    });
  };

  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        {options.length > 0 ? (
          options.map((item) => (
            <div className={styles["grid-item"]} key={item.id}>
              <OptionDataItem
                name={item.name}
                count={item.count}
                onSelect={() => onSelectValue(item)}
                onDeselect={() => onDeselectValue(item)}
                isSelected={item.isSelected}
              />
            </div>
          ))
        ) : (
          <NoResults />
        )}
      </div>
      <Divider />
    </>
  );
};

export default CustomFilter;
