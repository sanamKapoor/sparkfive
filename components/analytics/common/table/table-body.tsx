import React, { useContext } from 'react'
import { analyticsLayoutSection } from '../../../../constants/analytics'
import { AnalyticsContext } from '../../../../context'
import DateFormatter from "../../../../utils/date";
import styles from "./table-data.module.css";

const TableBody = ({
    columns,
    buttonColumns,
    buttonTexts,
    handleModals
}) => {

    const {
        activeSection,
        data
    } = useContext(AnalyticsContext);

    const renderTableData = () => {
        switch (activeSection) {
            case analyticsLayoutSection.ACCOUNT_USERS:
                return <UserTableRows
                    data={data}
                    activeSection={activeSection}
                    handleModals={handleModals}
                />
            case analyticsLayoutSection.ACCOUNT_ASSETS:
                return <AssetTableRows
                    data={data}
                    activeSection={activeSection}
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

export const UserTableRows = ({ data, handleModals, activeSection }) => {
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
                                            handleModals(row.name, DateFormatter.analyticsDateFormatter(row.lastSession))
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

export const AssetTableRows = ({ data, handleModals, activeSection }) => {
    return (
        <tbody>
            {
                data.map((row) => {
                    return (
                        <tr key={row.id}>
                            <td>
                                <div className={styles["usernameWithImage"]}>
                                    {row.thumbnail && <div className={`${styles["image-wrapper"]}`}>
                                        <img src={row.thumbnail} alt="user" className={styles.userImage} />
                                    </div>}
                                    <span className={`${styles["user-name"]}`}>{row.name}</span>
                                </div>
                            </td>
                            <td>{row.views}</td>
                            <td>{row.downloads}</td>
                            <td>{row.shares}</td>
                            <td>
                                <button
                                    className={styles.actionButton}
                                    onClick={() =>
                                        handleModals(row.name, DateFormatter.analyticsDateFormatter(row.last_session))
                                    }
                                >
                                    View chart
                                </button>

                            </td>
                        </tr>
                    );
                })
            }
        </tbody>
    )
}