// TableComponent.js

import React from "react";
import styles from "./insight-table.module.css";
import { Utilities } from "../../../assets";
import TableHeading from "./table-heading";
import SearchButton from "./analytics-search-button/analytics-search";
import Download from "../download-button/download";
const TableComponent = ({ columns, data, arrowColumns, buttonColumns, buttonTexts }) => {
  return (
    <div className={styles.tableResponsive}>
      <div className={`${styles["heading-wrap"]}`}>
        <TableHeading mainText="User Engagement" descriptionText="May 18 - May 25, 2023" />
        <SearchButton label="Search User" />
        <Download/>
      
        
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
                        <img src={row["ImageSource"]} alt="user" className={styles.userImage} />
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
    </div>
  );
};

export default TableComponent;
