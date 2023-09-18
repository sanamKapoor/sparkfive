import React, { ReactNode } from "react";
import styles from "./nested-heading.module.css";

const ReusableHeading = ({ headingTrue, totalCount, text, icon, headingClick, headingClickType = "" }: {
  totalCount?: number, text: string, icon: ReactNode,
  headingClick?: Function,
  headingClickType?: string,
  headingTrue?: boolean
}) => {

  return (
    <div className={styles["heading-contents"]}>
      <div className={`${styles["sidenav-heading"]} ${headingTrue ? styles["active"] : ""}`} onClick={() => headingClick(headingClickType)}
        style={{ cursor: "pointer" }}
      >
        {`${text} ${totalCount ? `(${totalCount})` : ""}`}
      </div>
      {icon && <div className="left-icon">{icon}</div>}
    </div >
  );
};

export default ReusableHeading;