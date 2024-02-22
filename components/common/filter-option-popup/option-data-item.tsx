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
    <div data-drag="false" className={`${styles["tags-wrapper"]}`}>
      <div data-drag="false" className={`${styles["tags-left-side"]}`}>
        {isSelected ? (
          <IconClickable
            src={Utilities.radioButtonEnabled}
            onClick={onDeselect}
            additionalClass={styles["radio-icon"]}
          />
        ) : (
          <IconClickable additionalClass={styles["radio-icon"]} src={Utilities.radioButtonNormal} onClick={onSelect} />
        )}
        <span data-drag="false" className={`${styles["select-name"]}`}>{name}</span>
      </div>
      <div data-drag="false" className={styles.filterCount}>
        <span data-drag="false">{count}</span>
      </div>
    </div>
  );
};

export default OptionDataItem;
