import React from "react";
import styles from "./asset-table.module.css";
import { insights, Utilities } from "../../../assets";
import TableHeading from "../insight-table/table-heading";
import SearchButton from "../common/analytics-search-button/analytics-search";
import Download from "../common/download-button/download";
import Datefilter from "../common/date-filter/date-filter";
import Pagination from "../Pagination/pagination";
import TableData from "../table-data/table-data";
import { columns } from "../../../data/analytics";
import { assetarrowColumns, assetbuttonColumns, assetbuttonTexts, data } from "../../../data/analytics";

function AssetTable({ dashboardView = false }: { dashboardView: boolean }) {
  return (
    <section className={`${styles["outer-wrapper"]}`}>
      <div className={styles.tableResponsive}>
        {/* for web */}
        <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
          <TableHeading
            mainText="Top Assets"
            descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"}
            smallHeading={true}
          />
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
              <TableHeading
                mainText="User Engagement"
                descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"}
                smallHeading={true}
              />
              {!dashboardView && (
                <div style={{ marginTop: "22px" }}>
                  <SearchButton label="Search User" />
                </div>
              )}
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
            <TableHeading
              mainText="User Engagement"
              descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"}
              smallHeading={true}
            />
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
          arrowColumns={assetarrowColumns}
          buttonColumns={assetbuttonColumns}
          buttonTexts={assetbuttonTexts}
          imageSource="ImageSource"
        />
        {!dashboardView && <Pagination />}
      </div>
    </section>
  );
}

export default AssetTable;
