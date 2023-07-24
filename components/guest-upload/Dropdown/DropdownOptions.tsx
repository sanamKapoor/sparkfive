import React from "react";
import Content from "./Content";

import styles from "./index.module.css";

interface DropdownOptionProps {
  dropdownOptions: {
    onClick: () => void;
    icon: string;
    label: string;
    text: string;
    CustomContent?: any;
  }[];
}

const DropdownOptions: React.FC<DropdownOptionProps> = ({
  dropdownOptions,
}) => {
  return (
    <ul className={`${styles["options-list"]} dropdown`}>
      {dropdownOptions.map((option) => (
        <>
          {option.CustomContent ? (
            <option.CustomContent>
              <Content {...option} />
            </option.CustomContent>
          ) : (
            <Content {...option} />
          )}
        </>
      ))}
    </ul>
  );
};

export default DropdownOptions;
