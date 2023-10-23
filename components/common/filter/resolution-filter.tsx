import React, { useState } from "react";
import { Utilities } from "../../../assets";
import { IResolutionFilter } from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import Divider from "../filter-option-popup/divider";
import OptionDataItem from "../filter-option-popup/option-data-item";
import styles from "../filter-option-popup/options-data.module.css";

interface ResolutionFilterProps {
  data: IResolutionFilter[];
  setFilters: (val: any) => void; //TODO
}

const ResolutionFilter: React.FC<ResolutionFilterProps> = ({
  data,
  setFilters,
}) => {
  const [resValues, setResValues] = useState<
    { dpi: number | string; count: string; isSelected: boolean }[]
  >([...data.map((item) => ({ ...item, isSelected: false }))]);

  const [highResActive, setHighResActive] = useState(false);

  const handleResolutionFilters = (val: string | number) => {
    console.log("coming inside addResolutionFilters");

    const curIndex = resValues.findIndex((res) => res.dpi === val);

    if (curIndex !== -1) {
      resValues[curIndex].isSelected = !resValues[curIndex].isSelected;
    }

    setResValues([...resValues]);
    setFilters((prevFilters) => {
      console.log("prevFilters: ", prevFilters);
      if (prevFilters?.filterResolutions) {
        const checkIfDpiAlreadyExists = prevFilters.filterResolutions.find(
          (item) => item === String(val)
        );

        if (checkIfDpiAlreadyExists) {
          const newFilters = prevFilters.filterResolutions.filter(
            (item) => item !== String(val)
          );
          return {
            filterResolutions: [...newFilters],
          };
        } else {
          return {
            filterResolutions: [
              ...prevFilters.filterResolutions,
              { value: String(val) },
            ],
          };
        }
      }
      return {
        filterResolutions: [{ value: String(val) }],
      };
    });
  };

  const onSelectHighResFilter = () => {
    setHighResActive((prevHighResActive) => !prevHighResActive);
    setFilters((prevFilters) => {
      return {
        filterResolutions: [
          ...(prevFilters?.filterResolutions ?? []),
          { value: "highres" },
        ],
      };
    });
  };

  return (
    <>
      <div className={styles["heading-tag"]}>
        {highResActive ? (
          <IconClickable
            src={Utilities.radioButtonEnabled}
            onClick={onSelectHighResFilter}
          />
        ) : (
          <IconClickable
            src={Utilities.radioButtonNormal}
            onClick={onSelectHighResFilter}
          />
        )}
        <span>All High-Res (above 250 DPI)</span>
      </div>
      <div className={styles["outer-wrapper"]}>
        {resValues.map((item) => (
          <div className={styles["grid-item"]} key={item.dpi}>
            <OptionDataItem
              name={item.dpi}
              count={item.count}
              isSelected={item.isSelected}
              onSelect={handleResolutionFilters}
            />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default ResolutionFilter;
