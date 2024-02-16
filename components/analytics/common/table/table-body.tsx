import React from "react";
import { AnalyticsActiveModal, TableBodySection } from "../../../../constants/analytics";
import DateFormatter from "../../../../utils/date";
import AssetIcon from "../../../common/asset/asset-icon";
import styles from "./table-data.module.css";
import { useRouter } from "next/router";

const TableBody = ({ handleModals, data, tableFor, dashboardView }) => {

  const renderTableData = () => {
    switch (tableFor) {
      case TableBodySection.DASHBOARD_ASSETS:
        return <AssetTableDashboardRows data={data} />
      case TableBodySection.DASHBOARD_USERS:
        return <DashboardUserTableRows data={data} handleModals={handleModals} />;
      case TableBodySection.USER:
        return <UserTableRows data={data} handleModals={handleModals} />;
      case TableBodySection.ASSET:
        return <AssetTableRows data={data} handleModals={handleModals} />;
      case TableBodySection.USER_ACTIVITY:
        return <UserActivityRows data={data} dashboardView={dashboardView} />;
      default:
        return null;
    }
  };

  return renderTableData();
};

export default TableBody;

export const DefaultTableRows = ({ data, columns, buttonColumns, buttonTexts, handleModals, activeSection }) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              className={
                colIndex === 0 && (column === "User name" || column === "Asset name") ? styles["user-name"] : ""
              }
            >
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
      ))}
    </tbody>
  );
};

export const DashboardUserTableRows = ({ data, handleModals }) => {
  return (
    <tbody>
      {data.map((row) => {
        return (
          <tr key={row.id}>
            <td>
              {row.name && (
                <div className={styles["usernameWithImage"]}>
                  <div className={`${styles["image-wrapper"]}`}>
                    {row.profilePhoto !== null ? (
                      <img src={row.profilePhoto} alt="user" className={styles.userImage} />
                    ) : (
                      <div className={styles.userAvatar}>{row.name.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <span className={`${styles["user-name"]}`}>{row.name}</span>
                </div>
              )}
            </td>
            <td>{row.sessionCount}</td>
            <td>
              <div style={{ display: "flex" }}>
                <span>
                  {row.lastSession ? DateFormatter.analyticsDateFormatter(row.lastSession) : ""}
                </span>
              </div>
            </td>
            <td>
              {row.name ? (
                <button className={styles.actionButton} onClick={() => handleModals(row.userId, AnalyticsActiveModal.USER_ACTIVITY)}>
                  User Info
                </button>
              ) : (
                ""
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export const UserTableRows = ({ data, handleModals }) => {
  return (
    <tbody>
      {data.map((row) => {
        return (
          <tr key={row.id}>
            <td>
              {row.name && (
                <div className={styles["usernameWithImage"]}>
                  <div className={`${styles["image-wrapper"]}`}>
                    {row.profilePhoto !== null ? (
                      <img src={row.profilePhoto} alt="user" className={styles.userImage} />
                    ) : (
                      <div className={styles.userAvatar}>{row.name.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <span className={`${styles["user-name"]}`}>{row.name}</span>
                </div>
              )}
            </td>
            <td className={`${styles["user-role"]}`}>{row.roleId}</td>
            <td>
              <div style={{ display: "flex" }}>
                <span>
                  {row.lastSession ? DateFormatter.analyticsDateFormatter(row.lastSession) : ""}
                </span>
              </div>
            </td>
            <td>{row.sessionCount}</td>
            <td>{row.downloads}</td>
            <td>{row.shares}</td>
            <td>
              {row.name ? (
                <button className={styles.actionButton} onClick={() => handleModals(row.userId, AnalyticsActiveModal.USER_ACTIVITY)}>
                  User Info
                </button>
              ) : (
                ""
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export const AssetTableRows = ({ data, handleModals }) => {
  return (
    <tbody>
      {data.map((row) => {
        return (
          <tr key={row.id}>
            <td>
              {row.name && (
                <div className={styles["usernameWithImage"]}>
                  <div className={`${styles["image-wrapper"]}`}>
                    {row.thumbnail ? (
                      <img src={row.thumbnail} alt="user" className={styles.assetImage} />
                    ) : (
                      <AssetIcon imgClass={"analytics-icon"} extension={row.extension} />
                    )}
                  </div>
                  <span className={`${styles["user-name"]}`}>{row.name}</span>
                </div>
              )}
            </td>
            <td>{row.views}</td>
            <td>{row.downloads}</td>
            <td>{row.shares}</td>
            <td>
              {row._id && (
                <button className={styles.actionButton} onClick={() => handleModals(row._id, AnalyticsActiveModal.ASSET_CHART)}>
                  View chart
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export const UserActivityRows = ({ data, dashboardView }) => {
  let activityTitle = "";
  let activityDate = "";
  return (
    <tbody className={`${styles['tableContent']}`}>
      {data.map((row) => {
        console.log({ row });
        
        activityTitle = row.last_download ? "Download" : row.last_viewed ? "Viewed" : row.last_shared ? "Shared" : "";
        activityDate = row.last_download
          ? row.last_download
          : row.last_viewed
            ? row.last_viewed
            : row.last_shared
              ? row.last_shared
              : "";

        if (dashboardView) {
          return (
            <tr key={row._id}>
              {row?.user?.name ? (
                <div className={styles["usernameWithImage"]}>
                  <div className={`${styles["image-wrapper"]}`}>
                    {row.user.profilePhoto !== null ? (
                      <img src={row.user.profilePhoto} alt="user" className={styles.userImage} />
                    ) : (
                      <div className={styles.userAvatar}>{row.user.name.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <span className={`${styles["user-name"]}`}>{row.user.name}</span>
                </div>
              ) :
                <div className={styles["usernameWithImage"]}>
                  <div className={`${styles["image-wrapper"]}`}>
                      <div className={styles.userAvatar}>NA</div>
                  </div>
                  <span className={`${styles["user-name"]}`}>Deleted User</span>
                </div>
              }
              <td>
                {" "}
                <div style={{ display: "flex" }}>
                  <span className={`${styles["user-name"]}`}>
                    {activityTitle} {row.name}
                  </span>
                </div>
              </td>
              <td>
                <div style={{ display: "flex" }}>
                  <span>
                    {activityDate ? DateFormatter.analyticsDateFormatter(activityDate) : ""}
                  </span>
                </div>
              </td>
            </tr>
          )
        } else {
          return (
            <tr key={row._id}>
              <td>
                {" "}
                <div style={{ display: "flex" }}>
                  <span className={`${styles["user-name"]}`}>
                    {activityTitle} {row.name}
                  </span>
                </div>
              </td>
              <td>
                <div style={{ display: "flex" }}>
                  <span>
                    {activityDate ? DateFormatter.analyticsDateFormatter(activityDate) : ""}
                  </span>
                </div>
              </td>
              <td>{row.assetId ? <button className={styles.actionButton} onClick={() => {
                  window.open(`${window.location.origin}/main/${row.assetId}`, '_blank')
                }}>View Link</button> : ""}</td>
            </tr>
          );
        }
      })}
    </tbody>
  );
};

export const AssetTableDashboardRows = ({ data }) => { 
  return (
    <tbody>
      {data.map((row) => {        
        return (
          <tr key={row.id}>
            <td>
              {row.name && (
                <div className={styles["usernameWithImage"]}>
                  <div className={`${styles["image-wrapper"]}`}>
                    {row.thumbnail ? (
                      <img src={row.thumbnail} alt="user" className={styles.assetImage} />
                    ) : (
                      <AssetIcon imgClass={"analytics-icon"} extension={row.extension} />
                    )}
                  </div>
                  <span className={`${styles["user-name"]}`}>{row.name}</span>
                </div>
              )}
            </td>
            <td>{row.views}</td>
            <td>{row.downloads}</td>
            <td>{row.shares}</td>
            <td>
              {row.id && (
                <button className={styles.actionButton} onClick={() => {
                  window.open(`${window.location.origin}/main/${row.id}`, '_blank')
                }}>
                  View asset
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};