import React from "react";
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
  return (
    <>
      <div className={styles["heading-tag"]}>
        <IconClickable src={Utilities.radioButtonNormal} />
        <span>All High-Res (above 250 DPI)</span>
      </div>
      <div className={styles["outer-wrapper"]}>
        {data.map((item) => (
          <div className={styles["grid-item"]} key={item.dpi}>
            <OptionDataItem
              name={item.dpi}
              count={item.count}
              isSelected={true}
            />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default ResolutionFilter;
