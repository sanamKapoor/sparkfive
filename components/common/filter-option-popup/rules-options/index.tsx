import React from "react";

import { Utilities } from "../../../../assets";
import IconClickable from "../../buttons/icon-clickable";
import Dropdown from "../../inputs/dropdown";
import Divider from "../divider";
import styles from "../index.module.css";

interface RulesOptionsProps {
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
  onChangeRule: (ruleName: string) => void;
  activeRuleName: string;
}

const RulesOptions: React.FC<RulesOptionsProps> = ({
  showDropdown,
  setShowDropdown,
  onChangeRule,
  activeRuleName,
}) => {
  return (
    <div>
      <div
        className={`${styles["rule-tag"]}`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <label>Rule:</label>
        <div className={`${styles["select-wrapper"]}`}>
          <p>{activeRuleName}</p>
          <IconClickable
            additionalClass={styles["dropdown-icon"]}
            src={Utilities.downIconLight}
          />
        </div>
      </div>
      {showDropdown && (
        <Dropdown
          additionalClass={styles["dropdown-menu"]}
          onClickOutside={() => {}}
          options={[
            {
              label: "All selected",
              id: "All selected",
              onClick: () => onChangeRule("all"),
            },
            {
              label: "Any Selected",
              id: "Any",
              onClick: () => onChangeRule("any"),
            },
            {
              label: "No Tags",
              id: "None",
              onClick: () => onChangeRule("none"),
            },
          ]}
        />
      )}
    </div>
  );
};

export default RulesOptions;
