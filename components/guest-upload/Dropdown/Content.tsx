import React from "react";
import IconClickable from "../../common/buttons/icon-clickable";
import styles from "./index.module.css";

interface ContentProps {
  onClick: () => void;
  icon: string;
  label: string;
  text: string;
}

const Content: React.FC<ContentProps> = (option) => {
  return (
    <li className={styles.option} onClick={option.onClick}>
      <IconClickable src={option.icon} additionalClass={styles.icon} />
      <div className={styles["option-label"]}>{option.label}</div>
      <div className={styles["option-text"]}>{option.text}</div>
    </li>
  );
};

export default Content;
