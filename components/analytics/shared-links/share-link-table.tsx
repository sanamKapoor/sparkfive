import React from 'react'
import styles from "./index.module.css";
import { Utilities } from "../../../assets";

function ShareLinkTable({ columns, data, arrowColumns, buttonColumns, buttonTexts, imageSource, dashboardView}) {
  return (
    <div className={styles.wrapper}>
          <div className={styles.wrap}>
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
               {column === "Shared by" || column === "Asset name" ? (
                 <div className={styles.usernameWithImage}>
                   <div className={`${styles["image-wrapper"]}`}>
                     {row.icon && <img src={row.icon} alt="user" className={styles.userImage} />}
                   </div>
                   <span className={`${styles["user-name"]}`}>{row[column]}</span>
                 </div>
               ) : buttonColumns.includes(column) ? (
                 <img
                   src={row.Actions}
                   alt={`Icon for ${column}`}
                   className={styles.actionIcon}
                   onClick={() => console.log(`Icon clicked in ${column}`)}
                 />
               ) : (column ===  "Actions" && dashboardView) ? "View Link" : (
                 row[column]
               )}
             </td>
           ))}
         </tr>
        ))}
      </tbody>
    </table>
  </div>

    </div>
  
  )
}

export default ShareLinkTable