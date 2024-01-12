// TableComponent.js

import React, { useContext, useEffect } from "react";
import { AnalyticsContext } from "../../../context";
import { UserTableColumns, arrowColumns, buttonColumns, buttonTexts, dashboardColumns } from "../../../data/analytics";
import SearchButton from "../common/search";
import Datefilter from "../common/date-filter";
import Download from "../common/download-button";
import NoData from "../common/no-data";
import Pagination from "../common/pagination";
import TableData from "../table-data";
import styles from "./insight-table.module.css";
import TableHeading from "./table-heading";
import { analyticsLayoutSection } from "../../../constants/analytics";
import Loader from "../../common/UI/Loader/loader";

const UserTable = ({ dashboardView = false }: { dashboardView: boolean }) => {
  const { loading, error, data, activeSection, totalRecords, setSortBy } = useContext(AnalyticsContext);
  
  return (
    <section className={`${styles["outer-wrapper"]}`}>
      {
        loading ? <div>  <div className={styles.backdrop} /> <Loader /></div> :
        (error || !data) ? <NoData message={error} /> :
        <div className={styles.tableResponsive}>
          {/* for web */}
          <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
            <TableHeading
              mainText="User Engagement"
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

          <TableData columns={dashboardView ? dashboardColumns : UserTableColumns} data={data} arrowColumns={arrowColumns} buttonColumns={buttonColumns} buttonTexts={buttonTexts} imageSource="ImageSource" activeSection={activeSection} />
          {(!dashboardView && data && data?.length > 0) && <Pagination />}
        </div>
      }
    </section>
  );
};

export default UserTable;
