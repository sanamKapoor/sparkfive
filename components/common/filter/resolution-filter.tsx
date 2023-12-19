import React, { useContext, useState } from "react";
import { Utilities } from "../../../assets";
import { filterKeyMap } from "../../../config/data/filter";
import { FilterContext } from "../../../context";
import {
  CommonFilterProps,
  FilterAttributeVariants,
} from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import OptionDataItem from "../filter-option-popup/option-data-item";
import styles from "../filter-option-popup/options-data.module.css";

interface ResolutionFilterProps extends CommonFilterProps {}

const ResolutionFilter: React.FC<ResolutionFilterProps> = ({
  options,
  setOptions,
}) => {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const [highResActive, setHighResActive] = useState<boolean>(
    !!activeSortFilter?.filterResolutions.find((item) => item.dpi === "highres")
  );

  const highResLabel = "All High-Res (above 250 DPI)";

  const onSelectHighResFilter = () => {
    setHighResActive(true);
    onSelectResolution("highres");
  };

  const onDeselectHighResFilter = () => {
    setHighResActive(false);
    onDeselectResolution("highres");
  };

  const onSelectResolution = (val: number | "highres") => {
    const filterKey = filterKeyMap[FilterAttributeVariants.RESOLUTION];
    if (val !== "highres") {
      const index = options.findIndex((value) => value.dpi === val);
      if (index !== -1) {
        options[index].isSelected = true;
      }
    } else {
      options = [
        ...options,
        {
          value: "highres",
          dpi: "highres",
          label: highResLabel,
          isSelected: true,
        },
      ];
    }

    setOptions([...options]);

    let newState;

    if (activeSortFilter[filterKey] && activeSortFilter[filterKey].length > 0) {
      newState = [
        ...new Set([
          ...activeSortFilter[filterKey],
          {
            value: val,
            dpi: val,
            label: val === "highres" ? highResLabel : val,
          },
        ]),
      ];
    } else {
      newState = [
        {
          value: val,
          dpi: val,
          label: val === "highres" ? highResLabel : val,
        },
      ];
    }

    setActiveSortFilter({
      ...activeSortFilter,
      [filterKey]: newState,
    });
  };

  const onDeselectResolution = (val: number | "highres") => {
    const index = options.findIndex((value) => value.dpi === val);

    if (index !== -1) {
      options[index].isSelected = false;
    }
    setOptions([...options]);

    let newFilters = options
      .filter((item) => item.isSelected)
      .map((item) => ({
        value: item.dpi,
        dpi: item.dpi,
        label: val === "highres" ? highResLabel : item.dpi,
      }));

    setActiveSortFilter({
      ...activeSortFilter,
      filterResolutions: newFilters,
    });
  };

  return (
    <>
      <div className={styles["heading-tag"]}>
        {highResActive ? (
          <IconClickable
            src={Utilities.radioButtonEnabled}
            onClick={onDeselectHighResFilter}
          />
        ) : (
          <IconClickable
            src={Utilities.radioButtonNormal}
            onClick={onSelectHighResFilter}
          />
        )}
        <span>{highResLabel}</span>
      </div>
      <div className={styles["outer-wrapper"]}>
        {(options?.length === 0) ? (
        <p>No Results Found.</p>
      ) : options?.map((item) =>
          item.dpi === "highres" ? null : (
            <div className={styles["grid-item"]} key={item.dpi}>
              <OptionDataItem
                name={item.dpi}
                count={item.count}
                isSelected={item.isSelected}
                onSelect={() => onSelectResolution(item.dpi)}
                onDeselect={() => onDeselectResolution(item.dpi)}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default ResolutionFilter;
