import React, { useContext } from 'react'
import { AnalyticsContext } from '../../../../context';
import styles from "./table-data.module.css";
import { insights } from "../../../../assets";

const TableHeader = ({ columns, arrowColumns }) => {

    const {
        totalRecords,
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder
    } = useContext(AnalyticsContext);

    return (
        <thead>
            <tr>
                {columns.map((column, index) => {
                    let sortCol = arrowColumns.filter((col) => col.label === column)[0];
                    return (
                        <th key={index}>
                            {sortCol && totalRecords > 0 ? (
                                <div
                                    className={`${styles["headingIcon"]} ${sortBy === sortCol.value ? styles["active_table-head"] : ""
                                        }`}
                                >
                                    {column}{" "}
                                    <div className={`${styles["flip-direction"]} ${styles["outer-wrapper"]}`}>
                                        <img
                                            src={
                                                sortBy === sortCol.value
                                                    ? sortOrder
                                                        ? insights.flipDown
                                                        : insights.flipUp
                                                    : insights.flipUpDown
                                            }
                                            alt="flip icon"
                                            onClick={() => {
                                                setSortBy(sortCol.value);
                                                setSortOrder(!sortOrder);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                column
                            )}
                        </th>
                    );
                })}
            </tr>
        </thead>
    )
}

export default TableHeader