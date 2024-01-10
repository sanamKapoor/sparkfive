import React from "react";
import {
  activityarrowColumns,
  activitybuttonColumns,
  activitybuttonTexts,
  activitycolumns,
  activitydata,
} from "../../../data/analytics";
import TableHeading from "../insight-table/table-heading";
import TableData from "../table-data";
import styles from "../table-data/table-data.module.css";

function Activity() {
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

export default Activity;
