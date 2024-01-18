import React, { useContext, useState } from "react";
import { insights } from "../../../assets";
import { analyticsLayoutSection } from "../../../constants/analytics";
import { AnalyticsContext } from "../../../context";
import DateFormatter from "../../../utils/date";
import NoData from "../common/no-data";
import UserModal from "../modals/user-modal/user-modal";
import styles from "./table-data.module.css";

export default function TableData({ columns, data, arrowColumns, buttonColumns, buttonTexts, imageSource, activeSection }) {

  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState<React.ReactElement | null>(null);
  const { setSortBy, setSortOrder, sortOrder, sortBy, tableLoading, totalRecords, data: apiData } = useContext(AnalyticsContext);

  const handleModals = (name, last_session) => {
    setShowModal(true);
    setActiveModal(activeSection === analyticsLayoutSection.ACCOUNT_USERS ? <UserModal setShowModal={setShowModal} name={name} last_session={last_session} /> : null)
  }

  return (
    <>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column, index) => {
                let sortCol = arrowColumns.filter(col => col.label === column)[0];
                return (
                  <th key={index}>
                    {(sortCol && totalRecords > 0) ? (
                      <div className={`${styles['headingIcon']} ${sortBy === sortCol.value ? styles['active_table-head'] : ''}`}>
                        {column} <div className={`${styles['flip-direction']} ${styles['outer-wrapper']}`}>
                          <img src={sortBy === sortCol.value ? (sortOrder ? insights.flipDown : insights.flipUp) : insights.flipUpDown} alt="flip icon" onClick={() => {
                            setSortBy(sortCol.value);
                            setSortOrder(!sortOrder);
                          }} />
                        </div>
                      </div>
                    ) : (
                      column
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          {
            (data && data.length > 0) &&
            <tbody>
              {
                (
                  activeSection === analyticsLayoutSection.ACCOUNT_USERS ||
                  activeSection === analyticsLayoutSection.DASHBOARD
                ) ?
                  data.map((row) => {                    
                    return (
                      <tr key={row.id}>
                        <td style={{
                          width: '300px'
                        }}>
                          {row.name && <div className={styles["usernameWithImage"]}> 
                            <div className={`${styles["image-wrapper"]}`}>
                              <img src={row.profilePhoto !== null ? row.profilePhoto : insights.avatar} alt="user" className={styles.userImage} />
                            </div>
                            <span className={`${styles["user-name"]}`}>{row.name}</span>
                          </div>}
                        </td>
                        {activeSection === analyticsLayoutSection.ACCOUNT_USERS && <td className={`${styles["user-role"]}`}>{row.roleId}</td>}
                        <td>{row.last_session ? DateFormatter.analyticsDateFormatter(row.last_session) : ''}</td>
                        <td>{row.session_count}</td>
                        {activeSection === analyticsLayoutSection.ACCOUNT_USERS && <td>{row.downloads}</td>}
                        {activeSection === analyticsLayoutSection.ACCOUNT_USERS && <td>{row.shares}</td>}
                        <td>
                          {
                            row.name ?
                              <button className={styles.actionButton} onClick={() => handleModals(row.name, DateFormatter.analyticsDateFormatter(row.last_session))}>
                                User Info
                              </button>
                              : ''
                          }
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
        {tableLoading ? <div className={styles.backdrop}></div> : null}
      </div>
      {
        showModal && activeModal
      }
      {
        (apiData && apiData.length === 0 && activeSection === analyticsLayoutSection.ACCOUNT_USERS) && <div className={styles.empty}>
          <NoData message="Data not found." wrapper={false} />
        </div>
      }
    </>
  );
}
