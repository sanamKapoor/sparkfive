// TableComponent.js

import React from "react";
import styles from "./insight-table.module.css";
import { insights,Utilities } from "../../../assets";
import TableHeading from "./table-heading";
import SearchButton from "./analytics-search-button/analytics-search";
import Download from "../download-button/download";
import Datefilter from "../date-filter/date-filter";
import Pagination from "../Pagination/pagination";
import TableData from "../table-data/table-data";
const UserTable = () => {
  const columns = ["Username", "Role","Last session date","Sessions","Downloads","Shares", "Actions",];
  const data = [
    { Username: "Seraphina Alexandra Montgomery-Smith",icon: insights.userImg1,  Role: "Admin", "Last session date": "Today at 04:22pm", Sessions:"1.27",Downloads:"77",Shares:"30", Actions: "Edit" ,},
    { Username: "Charles Wells",icon: insights.userImg2,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
    { Username: "Harvey Elliott",icon: insights.userImg3,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
    { Username: "John Ali",icon: insights.userImg4,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
    { Username: "John Ali",  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
    { Username: "Betty Anderson",  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
    { Username: "Eugene Atkinson",  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
    { Username: "Eugene Atkinson",icon: insights.userImg3,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
    
     ];

  const arrowColumns = ["Username", "Role","Last session date","Sessions","Downloads","Shares"];
  const buttonColumns = ["Actions"]; 
  const buttonTexts = { Actions: "User Info" };
  
  return (
    <section className={`${styles["outer-wrapper"]}`}>
      <div className={styles.tableResponsive}>
      {/* for web */}
      <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
        <TableHeading mainText="User Engagement" descriptionText="May 18 - May 25, 2023" />
        <div className={`${styles["table-header-tabs"]}`}>
          <SearchButton label="Search User" />
          <Datefilter />
          <Download />
        </div>
      </div>
      {/* for laptop */}
      <div className={`${styles["laptop-view"]}`}>
        <div className={`${styles["heading-wrap"]}`}>
          <div>
            <TableHeading mainText="User Engagement" descriptionText="May 18 - May 25, 2023" />
            <div style={{ marginTop: "22px" }}>
              <SearchButton label="Search User" />
            </div>
          </div>
          <div className={`${styles["table-header-tabs"]}`}>
            <Datefilter />
            <Download />
          </div>
        </div>
      </div>
      {/* for mobile */}
      <div className={`${styles["heading-wrap"]} ${styles["mobile-view"]}`}>
        <div className={`${styles["mobile-wrap"]}`}>
        <TableHeading mainText="User Engagement" descriptionText="May 18 - May 25, 2023" />
        <div className={`${styles["table-header-tabs"]}`}>
          <Datefilter />
          <Download />
        </div>
        </div>
        
        <div style={{ marginTop: "22px" }}>
          <SearchButton label="Search User" />
        </div>
      </div>

     <TableData  columns={columns} data={data} arrowColumns={arrowColumns} buttonColumns={buttonColumns} buttonTexts={buttonTexts}  imageSource="ImageSource" />
      <Pagination />
    </div>

    </section>
    
  );
};

export default UserTable;
