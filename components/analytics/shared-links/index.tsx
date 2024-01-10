import React from "react";
import {
  shareLinksData,
  sharedarrowColumns,
  sharedbuttonColumns,
  sharedbuttonTexts,
  sharedcolumns,
  shareddashboardColumns,
} from "../../../data/analytics";
import SearchButton from "../common/search";
import Datefilter from "../common/date-filter";
import Download from "../common/download-button";
import Pagination from "../common/pagination";
import TableHeading from "../insight-table/table-heading";
import styles from "./shared-links.module.css";
import ShareLinkTable from "./share-link-table";

function ShareLink({ dashboardView = false }: { dashboardView: boolean }) {

  return (
    <>
      <div className={styles.outerContainer}>
        <div className={styles.tableResponsive}>
          <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
            <TableHeading
              mainText={dashboardView ? "External Links" : "Top Shared Links"}
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
                  mainText={dashboardView ? "External Links" : "Top Shared Links"}
                  descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"}
                  smallHeading={true}
                />
                <div style={{ marginTop: "22px" }}>{!dashboardView && <SearchButton label="Search User" />}</div>
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
                mainText={dashboardView ? "External Links" : "Top Shared Links"}
                descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"}
                smallHeading={true}
              />
              <div className={`${styles["table-header-tabs"]}`}>
                <Datefilter />
                {!dashboardView && <Download />}
              </div>
            </div>

            <div style={{ marginTop: "22px" }}>
              <SearchButton label="Search User" />
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <ShareLinkTable
              columns={dashboardView ? shareddashboardColumns : sharedcolumns}
              data={shareLinksData}
              arrowColumns={sharedarrowColumns}
              buttonColumns={sharedbuttonColumns}
              buttonTexts={sharedbuttonTexts}
              imageSource="ImageSource"
              dashboardView={dashboardView}
            />
          </div>
          {!dashboardView && (
            <div>
              <Pagination />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ShareLink;
