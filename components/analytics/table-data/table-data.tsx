import React from 'react'
import styles from "./table-data.module.css"
import { Utilities } from "../../../assets";

export default function TableData({ columns, data, arrowColumns, buttonColumns, buttonTexts,imageSource }
    ) {
  return (
    <div className={styles.tableResponsive}>
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
  </div>
 )
}
