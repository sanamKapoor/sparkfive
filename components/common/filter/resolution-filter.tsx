import React, { useContext, useState } from "react";
import { Utilities } from "../../../assets";
import { FilterContext } from "../../../context";
import { IResolutionFilter } from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import Divider from "../filter-option-popup/divider";
import OptionDataItem from "../filter-option-popup/option-data-item";
import styles from "../filter-option-popup/options-data.module.css";

interface ResolutionFilterProps {
  options: IResolutionFilter[];
  setFilters: (val: any) => void; //TODO
}

//TODO: handle selection/ deselection separately at first stage
const ResolutionFilter: React.FC<ResolutionFilterProps> = ({
  options,
  setFilters,
}) => {
  const { activeSortFilter } = useContext(FilterContext);
  const getInitialResFilters = () => {
    if (activeSortFilter?.filterResolutions?.length > 0) {
      return options.map((item) => {
        const itemExists = activeSortFilter.filterResolutions.find(
          (filter) => filter.dpi === item.dpi
        );
        if (itemExists) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return { ...item, isSelected: false };
        }
      });
    }

    return options.map((item) => ({ ...item, isSelected: false }));
  };

  const [resValues, setResValues] = useState<
    { dpi: number | "highres"; count: string; isSelected: boolean }[]
  >(getInitialResFilters());

  const [highResActive, setHighResActive] = useState<boolean>(
    activeSortFilter?.filterResolutions?.find((item) => item.dpi === "highres")
      ? true
      : false
  );

  const onSelectHighResFilter = () => {
    setHighResActive(true);
    onSelectResolution("highres");
  };

  const onDeselectHighResFilter = () => {
    setHighResActive(false);
    onDeselectResolution("highres");
  };

  const onSelectResolution = (val: number | "highres") => {
    if (val !== "highres") {
      const index = resValues.findIndex((value) => value.dpi === val);
      if (index !== -1) {
        resValues[index].isSelected = true;
      }
      setResValues([...resValues]);
    }
    setFilters((prevState) => {
      return {
        filterResolutions:
          prevState?.filterResolutions?.length > 0
            ? [
                ...prevState?.filterResolutions,
                {
                  value: val,
                  dpi: val,
                },
              ]
            : [
                {
                  value: val,
                  dpi: val,
                },
              ],
      };
    });
  };

  console.log("highResActive outside...", highResActive); //giving correct value
  const onDeselectResolution = (val: number | "highres") => {
    console.log("highResActive inside function: ", highResActive); //giving state result
    let newFilters;
    if (val !== "highres") {
      const index = resValues.findIndex((value) => value.dpi === val);
      if (index !== -1) {
        resValues[index].isSelected = false;
      }
      setResValues([...resValues]);

      if (highResActive) {
        newFilters = [{ value: "highres", dpi: "highres" }];
      }
    }

    newFilters = [...resValues]
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.dpi, dpi: item.dpi }));

    setFilters({
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
        <span>All High-Res (above 250 DPI)</span>
      </div>
      <div className={styles["outer-wrapper"]}>
        {resValues.map((item) => (
          <div className={styles["grid-item"]} key={item.dpi}>
            <OptionDataItem
              name={item.dpi}
              count={item.count}
              isSelected={item.isSelected}
              onSelect={() => onSelectResolution(item.dpi)}
              onDeselect={() => onDeselectResolution(item.dpi)}
            />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default ResolutionFilter;
