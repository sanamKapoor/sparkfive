import React, { useEffect } from 'react'
import { analyticsActiveModal, analyticsLayoutSection } from '../../../../constants/analytics'
import DateFormatter from "../../../../utils/date";
import styles from "./table-data.module.css";
import AssetIcon from '../../../common/asset/asset-icon';

const TableBody = ({
    columns,
    buttonColumns,
    buttonTexts,
    handleModals,
    activeSection,
    data
}) => {

    const renderTableData = () => {
        switch (activeSection) {            
            case analyticsLayoutSection.ACCOUNT_USERS:
                return <UserTableRows
                    data={data}
                    handleModals={handleModals}
                />
            case analyticsLayoutSection.ACCOUNT_ASSETS:
                return <AssetTableRows
                    data={data}
                    handleModals={handleModals}
                />
            case analyticsActiveModal.USER_ACTIVITY:
                return <UserActivityRows
                    data={data}
                    handleModals={handleModals}
                />
            default:
                return <DefaultTableRows
                    data={data}
                    columns={columns}
                    buttonColumns={buttonColumns}
                    buttonTexts={buttonTexts}
                    handleModals={handleModals}
                />
        }
    }

    return renderTableData()
}

export default TableBody

export const DefaultTableRows = ({ data, columns, buttonColumns, buttonTexts, handleModals }) => {
    return (
        <tbody>
            {
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
    )
}

export const UserTableRows = ({ data, handleModals }) => {
    return (
        <tbody>
            {
                data.map((row) => {
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
                            <td>{row.lastSession ? DateFormatter.analyticsDateFormatter(row.lastSession) : ""}</td>
                            <td>{row.sessionCount}</td>
                            <td>{row.downloads}</td>
                            <td>{row.shares}</td>
                            <td>
                                {row.name ? (
                                    <button
                                        className={styles.actionButton}
                                        onClick={() =>
                                            handleModals(row.userId)
                                        }
                                    >
                                        User Info
                                    </button>
                                ) : (
                                    ""
                                )}
                            </td>
                        </tr>
                    );
                })
            }
        </tbody>
    )
}

export const AssetTableRows = ({ data, handleModals }) => {
    return (
        <tbody>
            {
                data.map((row) => {
                    return (
                        <tr key={row.id}>
                            <td>
                                {row.name && <div className={styles["usernameWithImage"]}>
                                    <div className={`${styles["image-wrapper"]}`}>
                                        {row.thumbnail ? <img src={row.thumbnail} alt="user" className={styles.userImage} /> :
                                            <AssetIcon extension={row.extension} />}
                                    </div>
                                    <span className={`${styles["user-name"]}`}>{row.name}</span>
                                </div>}
                            </td>
                            <td>{row.views}</td>
                            <td>{row.downloads}</td>
                            <td>{row.shares}</td>
                            <td>
                                {row._id && <button
                                    className={styles.actionButton}
                                    onClick={() =>
                                        handleModals(row._id)
                                    }
                                >
                                    View chart
                                </button>}
                            </td>
                        </tr>
                    );
                })
            }
        </tbody>
    )
}

export const UserActivityRows = ({ data, handleModals }) => {
    let activityTitle = '';
    let activityDate = '';
    return (
        <tbody>
            {
                data.map((row) => {
                    activityTitle = row.last_download ? 'Download' : row.last_viewed ? 'Viewed' : row.last_shared ? 'Shared' : ''
                    activityDate = row.last_download ? row.last_download : row.last_viewed ? row.last_viewed : row.last_shared ? row.last_shared : ''
                    return (
                        <tr key={row._id}>
                            <td>{activityTitle} {row.name}</td>
                            <td>
                                {
                                    activityDate ? 
                                    DateFormatter.analyticsDateFormatter(activityDate) 
                                    : ""
                                }</td>
                            <td>
                                {row.assetId ? (
                                    <button
                                        className={styles.actionButton}
                                    >
                                        View Link
                                    </button>
                                ) : (
                                    ""
                                )}
                            </td>
                        </tr>
                    );
                })
            }
        </tbody>
    )
}