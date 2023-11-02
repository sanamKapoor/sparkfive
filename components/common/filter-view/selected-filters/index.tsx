import React from "react";
import { Utilities } from "../../../../assets";
import { ISelectedFilter } from "../../../../interfaces/filters";
import Button from "../../buttons/button";
import IconClickable from "../../buttons/icon-clickable";

import styles from "../index.module.css";

interface SelectedFilterProps {
  data: ISelectedFilter[];
  onRemoveFilter: (item: ISelectedFilter) => void;
  onClearAll: () => void;
}

const SelectedFilters: React.FC<SelectedFilterProps> = ({
  data,
  onRemoveFilter,
  onClearAll,
}) => {
  return (
    <div className={styles["selected-filters-wrapper"]}>
      {data.map((item) => (
        <div key={item.id} className={styles["selected-filter-item"]}>
          <p>{item.label}</p>
          <IconClickable
            src={Utilities.closeIcon}
            onClick={() => onRemoveFilter(item)}
          />
        </div>
      ))}
      <Button text="Clear All" className="text-success-btn" onClick={onClearAll} />
    </div>
  );
};

export default SelectedFilters;
