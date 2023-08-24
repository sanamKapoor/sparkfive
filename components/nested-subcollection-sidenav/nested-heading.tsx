import React, { ReactNode } from "react";
import styles from "./nested-heading.module.css";

const ReusableHeading = ({ totalCount, text, icon, }: { totalCount?: number, text: string, icon: ReactNode }) => {

  return (
    <div className={styles["heading-contents"]}>
      <div className={styles["sidenav-heading"]}>{`${text} ${totalCount ? totalCount : ""}`}</div>
      {icon && <div className="left-icon">{icon}</div>}
    </div>
  );
};

export default ReusableHeading;
