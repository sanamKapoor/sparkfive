import React from "react";
import styles from "./asset-table.module.css";
import { insights, Utilities } from "../../../assets";
import TableHeading from "../insight-table/table-heading";
import SearchButton from "../insight-table/analytics-search-button/analytics-search";
import Download from "../download-button/download";
import Datefilter from "../date-filter/date-filter";
import Pagination from "../Pagination/pagination";
import TableData from "../table-data/table-data";

function AssetTable({
  dashboardView = false
}: { dashboardView: boolean }) {
  const columns = ["Asset name", "Views", "Downloads", "Shares", "Actions"];
  const data = [
    {
      "Asset name": "sparkfive_julia_martinez_23540872.png",
      icon: insights.userImg1,
      Views: "812",
      Downloads: "77",
      Shares: "30",
      Actions: "Edit",
    },
    {
      "Asset name": "sparkfive_david_anderson_67215691.png",
      icon: insights.userImg2,
      Views: "762",
      Downloads: "77",
      Shares: "30",
      Actions: "Delete",
    },
    {
      "Asset name": "sparkfive_sarah_johnson_81754025.png",
      icon: insights.userImg3,
      Views: "742",
      Downloads: "77",
      Shares: "30",
      Actions: "Delete",
    },
    {
      "Asset name": "sparkfive_long_name_michael_thompson_49276284.png",
      icon: insights.userImg4,
      Views: "639",
      Downloads: "77",
      Shares: "30",
      Actions: "Delete",
    },
    {
      "Asset name": "sparkfive_emily_rodriguez_94820356.png",
      icon: insights.userImg2,
      Views: "639",
      Downloads: "77",
      Shares: "30",
      Actions: "Delete",
    },
    {
      "Asset name": "sparkfive_alexander_davis_75361982.png",
      icon: insights.userImg1,
      Views: "639",
      Downloads: "77",
      Shares: "30",
      Actions: "Delete",
    },
    {
      "Asset name": "sparkfive_emily_rodriguez_94820356.png",
      icon: insights.userImg3,
      Views: "105",
      Downloads: "77",
      Shares: "30",
      Actions: "Delete",
    },
    {
      "Asset name": "sparkfive_alexander_davis_75361982.png",
      icon: insights.userImg3,
      Views: "92",
      Downloads: "77",
      Shares: "30",
      Actions: "Delete",
    },
  ];
  const arrowColumns = ["Asset name", "Role", "Last session date", "Sessions", "Downloads", "Shares", "Views"];
  const buttonColumns = ["Actions"];
  const buttonTexts = { Actions: "View chart" };
  return (
    <section className={`${styles["outer-wrapper"]}`}>
      <div className={styles.tableResponsive}>
        {/* for web */}
        <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
          <TableHeading mainText="Top Assets" descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"} smallHeading={true} />
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
              {!dashboardView && <div style={{ marginTop: "22px" }}>
                <SearchButton label="Search User" />
              </div>}
            </div>
            <div className={`${styles["table-header-tabs"]}`}>
              <Datefilter />
              {!dashboardView && <Download />}
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

        <TableData
          columns={columns}
          data={data}
          arrowColumns={arrowColumns}
          buttonColumns={buttonColumns}
          buttonTexts={buttonTexts}
          imageSource="ImageSource"
        />
        {
          !dashboardView && <Pagination />
        }

      </div>
    </section>
  );
}

export default AssetTable;
