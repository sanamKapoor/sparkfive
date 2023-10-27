//🚧 work in progress 🚧
import React from "react";

import {
  FilterAttributeVariants,
  IAttributeValue,
  OptionDataProps,
} from "../../../interfaces/filters";
import Divider from "./divider";
import OptionDataItem from "./option-data-item";
import styles from "./options-data.module.css";

const OptionData: React.FC<OptionDataProps> = ({
  values,
  setValues,
  setFilters,
  activeAttribute,
}) => {
  const onSelectValue = (data: IAttributeValue) => {
    const index = values.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      values[index].isSelected = true;
    }
    setValues([...values]);

    if (activeAttribute.id === FilterAttributeVariants.TAGS) {
      setFilters((prevState) => {
        return {
          filterNonAiTags:
            prevState?.filterNonAiTags?.length > 0
              ? [...prevState?.filterNonAiTags, { ...data, value: data.id }]
              : [{ ...data, value: data.id }],
        };
      });
    } else if (activeAttribute.id === FilterAttributeVariants.AI_TAGS) {
      setFilters((prevState) => {
        return {
          filterAiTags:
            prevState?.filterAiTags?.length > 0
              ? [...prevState?.filterAiTags, { ...data, value: data.id }]
              : [{ ...data, value: data.id }],
        };
      });
    } else if (activeAttribute.id === FilterAttributeVariants.CAMPAIGNS) {
      setFilters((prevState) => {
        return {
          filterCampaigns:
            prevState?.filterCampaigns?.length > 0
              ? [...prevState?.filterCampaigns, { ...data, value: data.id }]
              : [{ ...data, value: data.id }],
        };
      });
    } else if (activeAttribute.id === FilterAttributeVariants.FILE_TYPES) {
      setFilters((prevState) => {
        return {
          filterFileTypes:
            prevState?.filterFileTypes?.length > 0
              ? [...prevState?.filterFileTypes, { ...data, value: data.id }]
              : [{ ...data, value: data.id }],
        };
      });
    } else {
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
    }
  };

  const onDeselectValue = (data: IAttributeValue) => {
    const index = values.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      values[index].isSelected = false;
    }
    setValues([...values]);

    const newFilters = values
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.id, ...item }));

    let filters;
    if (activeAttribute.id === FilterAttributeVariants.TAGS) {
      filters = {
        filterNonAiTags: newFilters,
      };
    } else if (activeAttribute.id === FilterAttributeVariants.AI_TAGS) {
      filters = {
        filterAiTags: newFilters,
      };
    } else if (activeAttribute.id === FilterAttributeVariants.CAMPAIGNS) {
      filters = {
        filterCampaigns: newFilters,
      };
    } else if (activeAttribute.id === FilterAttributeVariants.FILE_TYPES) {
      filters = {
        filterFileTypes: newFilters,
      };
    } else {
      const filterKey = `custom-p${activeAttribute.id}`;
      filters = {
        [filterKey]: newFilters,
      };
    }
    setFilters(filters);
  };

  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        {values.map((item) => (
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

export default OptionData;
