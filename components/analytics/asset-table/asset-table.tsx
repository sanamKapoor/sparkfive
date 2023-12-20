import React from 'react'
import styles from "./asset-table.module.css"
import { insights,Utilities } from "../../../assets";
import TableHeading from "../insight-table/table-heading"
import SearchButton from "../insight-table/analytics-search-button/analytics-search";
import Download from "../download-button/download";
import Datefilter from "../date-filter/date-filter";
import Pagination from "../Pagination/pagination";
import TableData from "../table-data/table-data";

function AssetTable() {
    const columns = ["Asset name", "Views","Downloads","Shares", "Actions",];
  const data = [
    { "Asset name": "sparkfive_julia_martinez_23540872.png",icon: insights.userImg1,  Views: "Admin", Downloads:"77",Shares:"30", Actions: "Edit" ,},
    {  "Asset name": "sparkfive_david_anderson_67215691.png",icon: insights.userImg2,   Views: "Role name", Downloads:"77",Shares:"30",  Actions: "Delete" },
    { "Asset name": "sparkfive_sarah_johnson_81754025.png",icon: insights.userImg3,   Views: "Role name", Downloads:"77",Shares:"30",  Actions: "Delete" },
    {  "Asset name": "sparkfive_long_name_michael_thompson_49276284.png",icon: insights.userImg4,   Views: "Role name", Downloads:"77",Shares:"30",  Actions: "Delete" },
    { "Asset name": "sparkfive_emily_rodriguez_94820356.png",   Views: "Role name", Downloads:"77",Shares:"30",  Actions: "Delete" },
    {  "Asset name": "sparkfive_alexander_davis_75361982.png",   Views: "Role name", Downloads:"77",Shares:"30",  Actions: "Delete" },
    {  "Asset name": "sparkfive_emily_rodriguez_94820356.png",   Views: "Role name",Downloads:"77",Shares:"30",  Actions: "Delete" },
    { "Asset name": "sparkfive_alexander_davis_75361982.png",icon: insights.userImg3,   Views: "Role name", Downloads:"77",Shares:"30",  Actions: "Delete" },
    
     ];
     const arrowColumns = ["Username", "Role","Last session date","Sessions","Downloads","Shares"];
     const buttonColumns = ["Actions"]; 
     const buttonTexts = { Actions: "User Info" };
  return (
    <section className={`${styles["outer-wrapper"]}`}>
    <div className={styles.tableResponsive}>
    {/* for web */}
    <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
      <TableHeading mainText="Top Assets" descriptionText="May 18 - May 25, 2023" />
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
  )
}

export default AssetTable