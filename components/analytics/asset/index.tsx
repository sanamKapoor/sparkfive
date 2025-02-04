import React, { useEffect, useState } from "react";
import { AnalyticsLayoutSection, InsightsApiEndpoint, TABLE_REC_LEN, TableBodySection } from "../../../constants/analytics";
import { assetColumns, assetarrowColumns } from "../../../data/analytics";
import useInsights from "../../../hooks/useInsights";
import DateFilter from "../common/date-filter";
import Download from "../common/download-button";
import ClearSort from "../common/header/clear-sort";
import DateRangeTitle from "../common/header/date-title";
import Heading from "../common/header/heading";
import InsightsHeader from "../common/headline";
import NoData from "../common/no-data";
import Pagination from "../common/pagination";
import SearchButton from "../common/search";
import TableData from "../common/table";
import styles from "../index.module.css";

function Asset({ initialData }) {
  let {
    loading,
    error,
    data,
    limit,
    totalRecords,
    sortBy,
    filter,
    customDates,
    page,
    sortOrder,
    downloadCSV,
    setPage,
    setSortBy,
    setSortOrder,
    setSearch,
    setDownloadCSV,
    setFilter,
    setCustomDates,
  } = useInsights({ section: AnalyticsLayoutSection.ACCOUNT_ASSETS, endpoint: InsightsApiEndpoint.ASSET });
  const [emptyRows, setEmptyRows] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetsData, setTotalAssetsData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(TABLE_REC_LEN - (data ? data.length : 0), 0) }, (_, index) => ({})));
      setTotalAssets(totalRecords);
      setTotalAssetsData(data);
    } else {
      if(!loading && !downloadCSV){
        setTotalAssets(0)
        setTotalAssetsData([])
      }
    }
  }, [totalRecords, data, loading]);

  const handleClearSorting = () => {
    setSortBy("");
    setSortOrder(true);
  };

  useEffect(() => {
    if (initialData) {
      setEmptyRows(
        Array.from(
          { length: Math.max(TABLE_REC_LEN - (initialData.data ? initialData.data.length : 0), 0) },
          (_, index) => ({}),
        ),
      );
      setTotalAssetsData(initialData.data);
      setTotalAssets(initialData.totalRecords);
    }
  }, [initialData]);

  return (
    <section className={styles.mainContainer}  style={{paddingBottom:"30px"}}>
      <div className={styles.tableHeader}>
        <InsightsHeader title="Assets" />
      </div>
      <div className={`${styles["inner-container"]}`}>
        <section className={`${styles["outer-wrapper"]}`}>
          {error ? (
            <NoData message={error} />
          ) : (
            <div className={styles.tableResponsive}>
              <div className={styles.headerContainer}>
                <div className={styles.inline}>
                  <Heading mainText="Top Assets" />
                  <DateRangeTitle filter={filter} />
                </div>
                <div className={`${styles["table-header-tabs"]}`}>
                  <SearchButton label="Search Asset" setSearch={setSearch} />
                  <div className={`${styles["button-wrapper"]}`}>
                  <DateFilter
                    filter={filter}
                    setFilter={setFilter}
                    customDates={customDates}
                    setCustomDates={setCustomDates}
                  />
                  <Download setDownloadCSV={setDownloadCSV} />
                  </div>
                </div>
              </div>
              {
                totalAssetsData?.length > 0 ?
                <>
                  {sortBy && <ClearSort onClick={handleClearSorting} />}
                  <TableData
                    columns={assetColumns}
                    data={totalAssetsData ? [...totalAssetsData, ...emptyRows] : null}
                    apiData={totalAssetsData}
                    arrowColumns={assetarrowColumns}
                    tableLoading={loading}
                    totalRecords={totalAssets}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                    tableFor={TableBodySection.ASSET}
                  />
                  {totalAssets > limit && (
                    <Pagination page={page} limit={limit} totalRecords={totalAssets} setPage={setPage} />
                  )}
                </>
                :
                <div className={styles.empty}>
                  <NoData message="Data not found." wrapper={false} />
                </div>
              }
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Asset;
