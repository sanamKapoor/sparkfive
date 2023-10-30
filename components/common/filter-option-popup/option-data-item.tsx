import React from "react";
import { Utilities } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import styles from "./option-data-item.module.css";

interface OptionDataItemProps {
  name: string | number;
  count: string;
  isSelected?: boolean;
  onSelect: (val: number) => void;
  onDeselect: (val: number) => void;
}

const OptionDataItem: React.FC<OptionDataItemProps> = ({
  name,
  count,
  isSelected = false,
  onSelect,
  onDeselect,
}) => {
  return (
    <div className={`${styles["tags-wrapper"]}`}>
      <div className={`${styles["tags-left-side"]}`}>
        {isSelected ? (
          <IconClickable
            src={Utilities.radioButtonEnabled}
            onClick={onDeselect}
          />
        ) : (
          <IconClickable src={Utilities.radioButtonNormal} onClick={onSelect} />
        )}
        <span className={`${styles["select-name"]}`}>{name}</span>
      </div>
      <div>
        <span>{count}</span>
      </div>
    </div>
  );
};

export default OptionDataItem;
