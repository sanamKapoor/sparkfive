// TableComponent.js

import React from "react";
import styles from "./insight-table.module.css";
import { Utilities } from "../../../assets";
import TableHeading from "./table-heading";
import SearchButton from "./analytics-search-button/analytics-search";
import Download from "../download-button/download";
import Datefilter from "../date-filter/date-filter";
import Pagination from "../Pagination/pagination";
const TableComponent = ({ columns, data, arrowColumns, buttonColumns, buttonTexts,imageSource }) => {
  return (
    <section className={`${styles["outer-wrapper"]}`}>
      <div className={styles.tableResponsive}>
      {/* for web */}
      <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
        <TableHeading mainText="User Engagement" descriptionText="May 18 - May 25, 2023" />
        <div className={`${styles["table-header-tabs"]}`}>
          <SearchButton label="Search User" />
          <Datefilter />
          <Download />
        </div>
      </div>
      {/* for laptop */}
      <div className={`${styles["laptop-view"]}`}>
        <div className={`${styles["heading-wrap"]}`}>
          <div>
            <TableHeading mainText="User Engagement" descriptionText="May 18 - May 25, 2023" />
            <div style={{ marginTop: "22px" }}>
              <SearchButton label="Search User" />
            </div>
          </div>
          <div className={`${styles["table-header-tabs"]}`}>
            <Datefilter />
            <Download />
          </div>
        </div>
      </div>
      {/* for mobile */}
      <div className={`${styles["heading-wrap"]} ${styles["mobile-view"]}`}>
        <div className={`${styles["mobile-wrap"]}`}>
        <TableHeading mainText="User Engagement" descriptionText="May 18 - May 25, 2023" />
        <div className={`${styles["table-header-tabs"]}`}>
          <Datefilter />
          <Download />
        </div>
        </div>
        
        <div style={{ marginTop: "22px" }}>
          <SearchButton label="Search User" />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                {arrowColumns.includes(column) ? (
                  <div className={styles.headingIcon}>
                    {column} <img src={Utilities.arrowDownUp} alt="flip icon" />
                  </div>
                ) : (
                  column
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column === "Username" ? (
                    <div className={styles.usernameWithImage}>
                      <div className={`${styles["image-wrapper"]}`}>
                      {row.icon && <img src={row.icon} alt="user" className={styles.userImage} />}
                      </div>

                      {row[column]}
                    </div>
                  ) : buttonColumns.includes(column) ? (
                    <button className={styles.actionButton} onClick={() => console.log(`Button clicked in ${column}`)}>
                      {buttonTexts[column] || "Click me"}
                    </button>
                  ) : (
                    row[column]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </div>

    </section>
    
  );
};

export default TableComponent;
