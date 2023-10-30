import React, { useState } from "react";
import { Utilities } from "../../../assets";
import { IResolutionFilter } from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import Divider from "../filter-option-popup/divider";
import OptionDataItem from "../filter-option-popup/option-data-item";
import styles from "../filter-option-popup/options-data.module.css";

interface ResolutionFilterProps {
  options: IResolutionFilter[];
  setOptions: (data: unknown) => void;
  setFilters: (val: any) => void; //TODO
}

//TODO: handle selection/ deselection separately at first stage
const ResolutionFilter: React.FC<ResolutionFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  const [highResActive, setHighResActive] = useState<boolean>(false);

  const onSelectHighResFilter = () => {
    console.log("selected high res...");
    setHighResActive(true);
    onSelectResolution("highres");
  };

  const onDeselectHighResFilter = () => {
    setHighResActive(false);
    onDeselectResolution("highres");
  };

  const onSelectResolution = (val: number | "highres") => {
    if (val !== "highres") {
      const index = options.findIndex((value) => value.dpi === val);
      if (index !== -1) {
        options[index].isSelected = true;
      }
    } else {
      options = [...options, { dpi: "highres" }];
    }

    setOptions([...options]);

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

  const onDeselectResolution = (val: number | "highres") => {
    const index = options.findIndex((value) => value.dpi === val);
    if (index !== -1) {
      options[index].isSelected = false;
    }
    setOptions([...options]);

    let newFilters = options
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
        {options.map((item) =>
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
      <Divider />
    </>
  );
};

export default ResolutionFilter;
