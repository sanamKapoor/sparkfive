import React from "react";
import { Utilities } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import styles from "./option-data-item.module.css";

interface OptionDataItemProps {
  name: string | number;
  count: string;
}

const OptionDataItem: React.FC<OptionDataItemProps> = ({ name, count }) => {
  return (
    <div className={`${styles["tags-wrapper"]}`}>
      <div className={`${styles["tags-left-side"]}`}>
        <IconClickable src={Utilities.radioButtonNormal} />
        <span className={`${styles["select-name"]}`}>{name}</span>
      </div>
      <div>
        <span>{count}</span>
      </div>
    </div>
  );
};

export default OptionDataItem;
