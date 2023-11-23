import React, { useContext, useEffect } from "react";

import { FilterContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import {
  CommonFilterProps,
  IAttributeValue,
} from "../../../../interfaces/filters";
import NoResults from "../../UI/NoResultsPopup";
import Divider from "../../filter-option-popup/divider";
import OptionDataItem from "../../filter-option-popup/option-data-item";
import styles from "../../filter-option-popup/options-data.module.css";

interface CustomFilterProps extends CommonFilterProps {}

const CustomFilter: React.FC<CustomFilterProps> = ({
  options,
  setOptions,
  setFilters,
  activeAttribute,
}) => {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const { fetchValuesById } = useFilters([]);
  const fetchFilters = async () => {
    const newValues = await fetchValuesById(activeAttribute?.id);
    setOptions(newValues);
  };

  useEffect(() => {
    fetchFilters();
  }, [activeSortFilter]);

  const onSelectValue = (data: IAttributeValue) => {
    const index = options.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);
    const filterKey = `custom-p${activeAttribute?.id}`;

    let newState;

    if (activeSortFilter[filterKey] && activeSortFilter[filterKey].length > 0) {
      newState = [
        ...new Set([
          ...activeSortFilter[filterKey],
          { ...data, value: data.id, label: data.name },
        ]),
      ];
    } else {
      newState = [{ ...data, value: data.id, label: data.name }];
    }

    setActiveSortFilter({
      ...activeSortFilter,
      [filterKey]: newState,
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

    setActiveSortFilter({
      ...activeSortFilter,
      [filterKey]: newFilters,
    });
  };

  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        {options?.length > 0 ? (
          options?.map((item) => (
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
