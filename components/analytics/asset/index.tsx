import React, { useContext, useEffect, useState } from "react";
import { DashboardSections, analyticsLayoutSection } from "../../../constants/analytics";
import { AnalyticsContext } from "../../../context";
import { assetarrowColumns, assetbuttonColumns, assetbuttonTexts, columns } from "../../../data/analytics";
import Loader from "../../common/UI/Loader/loader";
import Button from "../../common/buttons/button";
import Datefilter from "../common/date-filter";
import Download from "../common/download-button";
import NoData from "../common/no-data";
import Pagination from "../common/pagination";
import SearchButton from "../common/search";
import TableData from "../common/table";
import TableHeading from "../insight-table/table-heading";
import styles from "./asset.module.css";

function Asset({ dashboardView = false, dashboardData }: { dashboardView: boolean, dashboardData?: Record<string, any> }) {
  const {
    activeSection,
    totalRecords,
    limit,
    loading,
    error,
    filter,
    customDates,
    page,
    data,
    tableLoading,
    sortOrder,
    setPage,
    setSortBy,
    setSortOrder,
    setSearch,
    setDownloadCSV,
    setFilter,
    setCustomDates,
    tableRows,
    sortBy
  } = useContext(AnalyticsContext);
  const [emptyRows, setEmptyRows] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetsData, setTotalAssetsData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(tableRows - (data ? data.length : 0), 0) }, (_, index) => ({})))
      setTotalAssets(totalRecords)
      setTotalAssetsData(data)
    } else {
      setEmptyRows([])
    }
  }, [totalRecords, data])

  const handleClearSorting = () => {
    setSortBy('');
    setSortOrder(true);
  }

  useEffect(() => {
    if (dashboardData) {
      setTotalAssetsData(dashboardData.data);
      setTotalAssets(dashboardData.totalRecords);
    }
  }, [dashboardData])

  return (
    <section className={`${styles["outer-wrapper"]}`}>
      {
        loading ? <div className={styles.backdrop}><Loader /></div> :
          (error) ? <NoData message={error} /> :
            <div className={styles.tableResponsive}>
              {/* for web */}
              <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
                <TableHeading
                  mainText="Top Assets"
                  smallHeading={true}
                  filter={filter}
                  activeSection={activeSection}
                />
                <div className={`${styles["table-header-tabs"]}`}>
                  {!dashboardView && <SearchButton label="Search Asset" setSearch={setSearch} />}
                  <Datefilter
                    filter={filter}
                    setFilter={setFilter}
                    customDates={customDates}
                    setCustomDates={setCustomDates}
                    activeFilterFor={DashboardSections.ASSET}
                  />
                  {!dashboardView && <Download setDownloadCSV={setDownloadCSV} />}
                </div>
              </div>
              {/* for laptop */}
              <div className={`${styles["laptop-view"]}`}>
                <div className={`${styles["heading-wrap"]}`}>
                  <div>
                    <TableHeading
                      mainText="Top Assets"
                      smallHeading={true}
                      filter={filter}
                      activeSection={activeSection}
                    />
                    {!dashboardView && (
                      <div style={{ marginTop: "22px" }}>
                        <SearchButton label="Search Asset" setSearch={setSearch} />
                      </div>
                    )}
                  </div>
                  <div className={`${styles["table-header-tabs"]}`}>
                    <Datefilter
                      filter={filter}
                      setFilter={setFilter}
                      customDates={customDates}
                      setCustomDates={setCustomDates}
                      activeFilterFor={DashboardSections.ASSET}
                    />
                    {!dashboardView && <Download setDownloadCSV={setDownloadCSV} />}
                  </div>
                </div>
              </div>
              {/* for mobile */}
              <div className={`${styles["heading-wrap"]} ${styles["mobile-view"]}`}>
                <div className={`${styles["mobile-wrap"]}`}>
                  <TableHeading
                    mainText="Top Assets"
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
                      activeFilterFor={DashboardSections.ASSET}

                    />
                    <Download setDownloadCSV={setDownloadCSV} />
                  </div>
                </div>

                <div style={{ marginTop: "22px" }}>
                  <SearchButton label="Search Asset" setSearch={setSearch} />
                </div>
              </div>
              {(!dashboardView && totalAssetsData && totalAssetsData?.length > 0 && sortBy) && <div className={`${styles["clear-sort"]}`}><Button text="Clear sorting" className={'clear-sort-btn'} onClick={handleClearSorting} /></div>}
              <TableData
                columns={columns}
                data={dashboardView ? totalAssetsData : ((totalAssetsData && emptyRows.length > 0) ? [...totalAssetsData, ...emptyRows] : null)}
                apiData={totalAssetsData}
                arrowColumns={assetarrowColumns}
                buttonColumns={assetbuttonColumns}
                buttonTexts={assetbuttonTexts}
                activeSection={activeSection}
                tableLoading={tableLoading}
                totalRecords={totalAssets}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
                tableFor={DashboardSections.ASSET}
              />
              {(!dashboardView && activeSection === analyticsLayoutSection.ACCOUNT_ASSETS && totalAssetsData && totalAssetsData?.length > 0 && totalAssets > limit) && 
              <Pagination
                page={page}
                limit={limit}
                totalRecords={totalAssets}
                setPage={setPage}
              />}
            </div>
      }
    </section>
  );
}

export default Asset;
