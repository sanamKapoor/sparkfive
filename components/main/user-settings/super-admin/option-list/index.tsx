import IconClickable from "../../../../../components/common/buttons/icon-clickable";

import styles from "./index.module.css";

import { Utilities } from "../../../../../assets";

interface OptionListProps {
  data: { label: string; value: boolean }[];
  oneColumn?: boolean;
  value: boolean;
  setValue: (val: boolean) => void;
  additionalClass?: string;
  capitalize?: boolean;
}

const OptionList: React.FC<OptionListProps> = ({
  data,
  oneColumn = false,
  setValue,
  value,
  additionalClass = "",
  capitalize = false,
}) => {
  const toggleSelected = (selectedValue) => {
    setValue(selectedValue);
  };

  return (
    <ul
      className={`${styles["item-list"]} ${oneColumn && styles["one-column"]} ${
        capitalize && "capitalize"
      }`}
    >
      {data.map((filter, index) => {
        const isSelected = value !== undefined && value === filter.value;
        return (
          <li
            key={index}
            className={`${styles["select-item"]} ${styles[additionalClass]}`}
          >
            <div
              className={`${styles["selectable-wrapper"]} ${
                isSelected && styles["selected-wrapper"]
              }`}
            >
              {isSelected ? (
                <IconClickable
                  src={Utilities.radioButtonEnabled}
                  additionalClass={styles["select-icon"]}
                  onClick={() => toggleSelected(filter.value)}
                />
              ) : (
                <IconClickable
                  src={Utilities.radioButtonNormal}
                  additionalClass={styles["select-icon"]}
                  onClick={() => toggleSelected(filter.value)}
                />
              )}
            </div>
            <p className={styles["item-name"]}>{filter.label}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default OptionList;
