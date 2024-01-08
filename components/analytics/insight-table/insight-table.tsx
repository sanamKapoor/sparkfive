// TableComponent.js

import React from "react";
import styles from "./insight-table.module.css";
import { insights, Utilities } from "../../../assets";
import TableHeading from "./table-heading";
import SearchButton from "../common/analytics-search-button/analytics-search";
import Download from "../common/download-button/download";
import Datefilter from "../common/date-filter/date-filter";
import Pagination from "../Pagination/pagination";
import TableData from "../table-data/table-data";
import { UserTableColumns ,dashboardColumns,arrowColumns,buttonColumns,buttonTexts}from "../../../data/analytics"


const UserTable = ({
  activeSection,
  dashboardView = false
}: { activeSection: string, dashboardView: boolean }
) => {

  const data = [
    { "User name": "Seraphina Alexandra Montgomery-Smith", icon: insights.userImg1, Role: "Admin", "Last session date": "Today at 04:22pm", Sessions: "1.27", Downloads: "77", Shares: "30", Actions: "Edit", },
    { "User name": "Charles Wells", icon: insights.userImg2, Role: "Role name", "Last session date": "Today at 04:01pm", Sessions: "93", Downloads: "77", Shares: "30", Actions: "Delete" },
    { "User name": "Harvey Elliott", icon: insights.userImg3, Role: "Role name", "Last session date": "Today at 04:01pm", Sessions: "93", Downloads: "77", Shares: "30", Actions: "Delete" },
    { "User name": "John Ali", icon: insights.userImg4, Role: "Role name", "Last session date": "Today at 04:01pm", Sessions: "93", Downloads: "77", Shares: "30", Actions: "Delete" },
    { "User name": "John Ali", icon: insights.userImg3, Role: "Role name", "Last session date": "Today at 04:01pm", Sessions: "93", Downloads: "77", Shares: "30", Actions: "Delete" },
    { "User name": "Betty Anderson", icon: insights.userImg4, Role: "Role name", "Last session date": "Today at 04:01pm", Sessions: "93", Downloads: "77", Shares: "30", Actions: "Delete" },
    { "User name": "Eugene Atkinson", icon: insights.userImg2, Role: "Role name", "Last session date": "Today at 04:01pm", Sessions: "93", Downloads: "77", Shares: "30", Actions: "Delete" },
    { "User name": "Eugene Atkinson", icon: insights.userImg3, Role: "Role name", "Last session date": "Today at 04:01pm", Sessions: "93", Downloads: "77", Shares: "30", Actions: "Delete" },

  ];


  


  return (
    <section className={`${styles["outer-wrapper"]}`}>
      <div className={styles.tableResponsive}>
        {/* for web */}
        <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
          <TableHeading mainText="User Engagement" descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"} smallHeading={true} />
          <div className={`${styles["table-header-tabs"]}`}>
            {!dashboardView && <SearchButton label="Search User" />}
            <Datefilter />
            {!dashboardView && <Download />}
          </div>
        </div>
        {/* for laptop */}
        <div className={`${styles["laptop-view"]}`}>
          <div className={`${styles["heading-wrap"]}`}>
            <div>
              <TableHeading mainText="User Engagement" descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"} smallHeading={true} />
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
            <TableHeading mainText="User Engagement" descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"} smallHeading={true} />
            <div className={`${styles["table-header-tabs"]}`}>
              <Datefilter />
              <Download />
            </div>
          </div>

          <div style={{ marginTop: "22px" }}>
            <SearchButton label="Search User" />
          </div>
        </div>

        <TableData columns={dashboardView ? dashboardColumns : UserTableColumns} data={data} arrowColumns={arrowColumns} buttonColumns={buttonColumns} buttonTexts={buttonTexts} imageSource="ImageSource" activeSection={activeSection} />
        {!dashboardView && <Pagination />}
      </div>

    </section>

  );
};

export default UserTable;
