import React, { ReactNode } from "react";
import styles from "./nested-heading.module.css";
import { Utilities } from "../../assets";
import IconClickable from "../common/buttons/icon-clickable";

const ReusableHeading = ({ headingTrue, totalCount, text, icon, headingClick, headingClickType = "", description = "", customStyle }: {
  totalCount?: number, text: string, icon: ReactNode,
  headingClick?: Function,
  headingClickType?: string,
  headingTrue?: boolean
  description?: string
  customStyle?: React.CSSProperties;
}) => {

  return (
    <div className={styles["heading-contents"]} style={customStyle}>
      <div className={`${styles["sidenav-heading"]} ${headingTrue ? styles["active"] : ""}`}
        onClick={() => headingClick(headingClickType, description)}
        style={{ cursor: "pointer" }}
      >
        {`${text} ${totalCount ? `(${totalCount})` : ""}`}
        <IconClickable additionalClass={styles.addIcon} src={Utilities.addCollection} />
      </div>
      {icon && <div className="left-icon">{icon}</div>}
    
    </div >
  );
};

export default ReusableHeading;