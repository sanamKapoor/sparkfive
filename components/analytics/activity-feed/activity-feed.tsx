import React from "react";
import TableData from "../table-data/table-data";
import { insights, Utilities } from "../../../assets";
import styles from "../table-data/table-data.module.css";
import TableHeading from "../insight-table/table-heading";
import {
  activitycolumns,
  activitydata,
  activityarrowColumns,
  activitybuttonColumns,
  activitybuttonTexts,
} from "../../../data/analytics";

function ActivityFeedTable() {
  return (
    <div className={styles.tableOuter}>
      <TableHeading mainText="Activity Feed" descriptionText="" smallHeading={true} />
      <TableData
        columns={activitycolumns}
        data={activitydata}
        arrowColumns={activityarrowColumns}
        buttonColumns={activitybuttonColumns}
        buttonTexts={activitybuttonTexts}
        imageSource="ImageSource"
      />
    </div>
  );
}

export default ActivityFeedTable;
