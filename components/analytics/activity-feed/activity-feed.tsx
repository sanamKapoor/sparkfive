import React from 'react'
import TableData from '../table-data/table-data'
import { insights, Utilities } from "../../../assets";
import styles from "../table-data/table-data.module.css"
import TableHeading from '../insight-table/table-heading';

function ActivityFeedTable() {
    const columns = ["User name", "Activity", "Date",  "Actions"];
  const data = [
    {
      "User name": "Seraphina Alexandra Montgomery-Smith",
      icon: insights.userImg1,
      Activity: "Downloaded...",
      Date: "Today at 04:22 pm",
      Actions: "Edit",
    },
    {
        "User name": "Harvey Elliott",
        icon: insights.userImg2,
        Activity: "Viewed...",
        Date: "Today 04:01 pm",
        Actions: "Edit",
    },
    {
        "User name": "Charles Wells",
        icon: insights.userImg3,
        Activity: "Shared...",
        Date: "Today 03:55 pm",
        Actions: "Edit",
    },
    {
        "User name": "John Ali",
        icon: insights.userImg4,
        Activity: "Viewed...",
        Date: "Today 03:31 pm",
        Actions: "Edit",
    },
    {
        "User name": "Clyde Booth",
        icon: insights.userImg1,
        Activity: "Downloaded...",
        Date: "Today 03:08 pm",
        Actions: "Edit",
    },
    {
        "User name": "Beverly Marshall",
        icon: insights.userImg2,
        Activity: "Downloaded",
        Date: "Today 03:01 pm",
        Actions: "Edit",
    },
    {
        "User name": "Harvey Elliott",
        icon: insights.userImg2,
        Activity: "Viewed...",
        Date: "Today 04:01 pm",
        Actions: "Edit",
    },
    {
        "User name": "Seraphina Alexandra Montgomery-Smith",
        icon: insights.userImg1,
        Activity: "Downloaded...",
        Date: "Today at 04:22 pm",
        Actions: "Edit",
      },
 
  ];
  const arrowColumns = ["User name", "Activity", "Date",];
  const buttonColumns = ["Actions"];
  const buttonTexts = { Actions: "User info" };
  return (
    <div className={styles.tableOuter}>
         <TableHeading mainText="Activity Feed" descriptionText="" />
        <TableData  columns={columns}
          data={data}
          arrowColumns={arrowColumns}
          buttonColumns={buttonColumns}
          buttonTexts={buttonTexts}
          imageSource="ImageSource"/>
    </div>
  )
}

export default ActivityFeedTable