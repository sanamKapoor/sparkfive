import React from "react";
import { Assets } from "../../../../../assets";
import styles from "./index.module.css";
import { CompanyListHeaderProps, defaultSortData } from "./types";

const CompanyListHeader: React.FC<CompanyListHeaderProps> = ({
  setSortData,
  sortData,
  sortId,
  title,
  big,
}) => {
  const isActive = sortData.sortBy === sortId;

  const toggleSortHandler = () =>
    setSortData({
      ...defaultSortData,
      sortBy:
        isActive && sortData.sortDirection === "DESC"
          ? defaultSortData.sortBy
          : sortId,
      sortDirection: !isActive
        ? "ASC"
        : sortData.sortDirection === "ASC"
        ? "DESC"
        : "ASC",
    });

  return (
    <span onClick={toggleSortHandler} className={styles.container}>
      <div className={styles.title}>{title}</div>

      <img
        src={Assets.arrowDown}
        className={`
          ${big ? styles.big : ""}
          ${styles.icon} 
          ${isActive ? styles["icon_active"] : ""}
          ${sortData.sortDirection === "ASC" ? "" : styles.desc}
          `}
      />
    </span>
  );
};

export default CompanyListHeader;
