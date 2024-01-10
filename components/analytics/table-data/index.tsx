import React, { useState } from "react";
import styles from "./table-data.module.css";
import { Utilities } from "../../../assets";
import UserModal from "../modals/user-modal/user-modal";
import { analyticsLayoutSection } from "../../../constants/analytics";
import DateFormatter from "../../../utils/date";

export default function TableData({ columns, data, arrowColumns, buttonColumns, buttonTexts, imageSource, activeSection }) {

  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState<React.ReactElement | null>(null);

  const handleModals = () => {
    setShowModal(true);
    setActiveModal(activeSection === analyticsLayoutSection.ACCOUNT_USERS ? <UserModal setShowModal={setShowModal} /> : null)
  }

  return (
    <>
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
          {
            data && data.length > 0 &&
            <tbody>
              {
                (activeSection === analyticsLayoutSection.ACCOUNT_USERS) ?
                  data.map((row) => {
                    return (
                      <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>{row.roleId}</td>
                        <td>{DateFormatter.analyticsDateFormatter(row.last_session)}</td>
                        <td>{row.session_count}</td>
                        <td>{row.downloads}</td>
                        <td>{row.shares}</td>
                        <td>
                          <button className={styles.actionButton} onClick={handleModals}>
                            User Info
                          </button>
                        </td>
                      </tr>
                    )
                  }) :
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {column === "User name" || column === "Asset name" ? (
                            <div className={styles.usernameWithImage}>
                              <div className={`${styles["image-wrapper"]}`}>
                                {row.icon && <img src={row.icon} alt="user" className={styles.userImage} />}
                              </div>
                              <span className={`${styles["user-name"]}`}>{row[column]}</span>
                            </div>
                          ) : buttonColumns.includes(column) ? (
                            <button className={styles.actionButton} onClick={handleModals}>
                              {buttonTexts[column] || "Click me"}
                            </button>
                          ) : (
                            row[column]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
              }
            </tbody>
          }
        </table>
      </div>
      {
        showModal && activeModal
      }
    </>
  );
}
