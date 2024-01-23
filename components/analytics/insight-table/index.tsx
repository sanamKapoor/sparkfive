// TableComponent.js

import React, { useContext, useEffect, useState } from "react";
import { analyticsLayoutSection } from "../../../constants/analytics";
import { AnalyticsContext } from "../../../context";
import { UserTableColumns, arrowColumns, buttonColumns, buttonTexts, dashboardColumns } from "../../../data/analytics";
import Loader from "../../common/UI/Loader/loader";
import Button from "../../common/buttons/button";
import Datefilter from "../common/date-filter";
import Download from "../common/download-button";
import NoData from "../common/no-data";
import Pagination from "../common/pagination";
import SearchButton from "../common/search";
import TableData from "../common/table";
import TableHeading from "./table-heading";
import styles from "./insight-table.module.css";

const UserTable = ({ dashboardView = false }: { dashboardView: boolean }) => {
  const { loading, error, data, activeSection, limit, totalRecords, sortBy, filter, customDates, page, tableLoading, sortOrder, setPage, setSortBy, setSortOrder, tableRows, setSearch, setDownloadCSV, setFilter, setCustomDates } = useContext(AnalyticsContext);
  const [emptyRows, setEmptyRows] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(tableRows - (data ? data.length : 0), 0) }, (_, index) => ({})))
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
                  smallHeading={true}
                  filter={filter}
                  activeSection={activeSection}
                />
                <div className={`${styles["table-header-tabs"]}`}>
                  {!dashboardView && <SearchButton label="Search User" setSearch={setSearch} />}
                  <Datefilter
                    filter={filter}
                    setFilter={setFilter}
                    customDates={customDates}
                    setCustomDates={setCustomDates}
                  />
                  {!dashboardView && <Download setDownloadCSV={setDownloadCSV} />}
                </div>
              </div>
              {/* for laptop */}
              <div className={`${styles["laptop-view"]}`}>
                <div className={`${styles["heading-wrap"]}`}>
                  <div>
                    <TableHeading
                      mainText="User Engagement"
                      smallHeading={true}
                      filter={filter}
                      activeSection={activeSection}
                    />
                    <div style={{ marginTop: "22px" }}>
                      <SearchButton label="Search User" setSearch={setSearch} />
                    </div>
                  </div>
                  <div className={`${styles["table-header-tabs"]}`}>
                    <Datefilter
                      filter={filter}
                      setFilter={setFilter}
                      customDates={customDates}
                      setCustomDates={setCustomDates}
                    />
                    <Download setDownloadCSV={setDownloadCSV} />
                  </div>
                </div>
              </div>
              {/* for mobile */}
              <div className={`${styles["heading-wrap"]} ${styles["mobile-view"]}`}>
                <div className={`${styles["mobile-wrap"]}`}>
                  <TableHeading
                    mainText="User Engagement"
                    smallHeading={true}
                    filter={filter}
                    activeSection={activeSection}
                  />
                  <div className={`${styles["table-header-tabs"]}`}>
                    <Datefilter
                      filter={filter}
                      setFilter={setFilter}
                      customDates={customDates}
                      setCustomDates={setCustomDates}
                    />
                    <Download setDownloadCSV={setDownloadCSV} />
                  </div>
                </div>

                <div style={{ marginTop: "22px" }}>
                  <SearchButton label="Search User" setSearch={setSearch} />
                </div>
              </div>
              {(!dashboardView && data && data?.length > 0 && sortBy) && <div className={`${styles["clear-sort"]}`}><Button text="Clear sorting" className={'clear-sort-btn'} onClick={handleClearSorting} /></div>}
              <TableData 
                columns={dashboardView ? dashboardColumns : UserTableColumns} 
                data={dashboardView ? data : ((data && emptyRows.length > 0) ? [...data, ...emptyRows] : null)} 
                apiData={data}
                arrowColumns={arrowColumns} 
                buttonColumns={buttonColumns} 
                buttonTexts={buttonTexts}  
                activeSection={activeSection} 
                tableLoading={tableLoading}
                totalRecords={totalRecords}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              />
              {(!dashboardView && activeSection === analyticsLayoutSection.ACCOUNT_USERS && data && data?.length > 0 && totalRecords > limit) && <Pagination
                page={page}
                limit={limit}
                totalRecords={totalRecords}
                setPage={setPage}
              />}
            </div>
      }
    </section>
  );
};

export default UserTable;
