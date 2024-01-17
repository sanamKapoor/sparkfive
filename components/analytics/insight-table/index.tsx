// TableComponent.js

import React, { useContext, useEffect, useState } from "react";
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
import Button from "../../common/buttons/button";

const UserTable = ({ dashboardView = false }: { dashboardView: boolean }) => {
  const { loading, error, data, activeSection, limit, totalRecords, sortBy, setSortBy, setSortOrder, initialRender } = useContext(AnalyticsContext);
  const [emptyRows, setEmptyRows] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(15 - (data ? data.length : 0), 0) }, (_, index) => ({})))
    } else {
      setEmptyRows([])
    }
  }, [totalRecords, data])

  const handleClearSorting = () => {
    setSortBy('');
    setSortOrder(true);
  }

  return (
    <section className={`${styles["outer-wrapper"]}`}>
      {
        loading ? <div className={styles.backdrop}><Loader /></div> :
        (error) ? <NoData message={error} /> :
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
          {(!dashboardView && data && data?.length > 0 && sortBy) && <div className={`${styles["clear-sort"]}`}><Button text="Clear sorting"  className={'clear-sort-btn'} onClick={handleClearSorting}  /></div>}
          <TableData columns={dashboardView ? dashboardColumns : UserTableColumns} data={dashboardView ? data : ((data && emptyRows.length > 0) ? [...data, ...emptyRows] : null)} arrowColumns={arrowColumns} buttonColumns={buttonColumns} buttonTexts={buttonTexts} imageSource="ImageSource" activeSection={activeSection} />
          {(!dashboardView && data && data?.length > 0 && totalRecords > limit) && <Pagination />}
        </div>
      }
    </section>
  );
};

export default UserTable;
