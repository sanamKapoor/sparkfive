import React from "react";

import {
  IAttributeValue,
  OptionDataProps,
} from "../../../../interfaces/filters";
import Divider from "../../filter-option-popup/divider";
import OptionDataItem from "../../filter-option-popup/option-data-item";
import styles from "../../filter-option-popup/options-data.module.css";

interface AiTagsFilterProps extends OptionDataProps {}

const AiTagsFilter: React.FC<AiTagsFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  const onSelectValue = (data: IAttributeValue) => {
    const index = options.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);
    setFilters((prevState) => {
      return {
        filterAiTags:
          prevState?.filterAiTags?.length > 0
            ? [...prevState?.filterAiTags, { ...data, value: data.id }]
            : [{ ...data, value: data.id }],
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
    setFilters({
      filterAiTags: newFilters,
    });
  };

  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        {options.map((item) => (
          <div className={styles["grid-item"]} key={item.id}>
            <OptionDataItem
              name={item.name}
              count={item.count}
              onSelect={() => onSelectValue(item)} //TODO
              onDeselect={() => onDeselectValue(item)} //TODO
              isSelected={item.isSelected}
            />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default AiTagsFilter;
