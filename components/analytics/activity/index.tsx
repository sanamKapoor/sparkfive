import React from "react";
import {
  activityarrowColumns,
  activitybuttonColumns,
  activitybuttonTexts,
  activitycolumns,
  activitydata,
} from "../../../data/analytics";
import TableData from "../common/table";
import TableHeading from "../insight-table/table-heading";
import styles from "../common/table/table-data.module.css";

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
      />
    </div>
  );
}

export default Activity;
