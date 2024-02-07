// TableComponent.js

import React, { useEffect, useState } from "react";
import { AnalyticsLayoutSection, InsightsApiEndpoint, TABLE_REC_LEN, TableBodySection } from "../../../constants/analytics";
import { UserTableColumns, arrowColumns } from "../../../data/analytics";
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

const Users = ({
  initialData,
}) => {
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
    setPage,
    setSortBy,
    setSortOrder,
    setSearch,
    setDownloadCSV,
    setFilter,
    setCustomDates,
  } = useInsights({ section: AnalyticsLayoutSection.ACCOUNT_USERS, endpoint: InsightsApiEndpoint.USER });
  const [emptyRows, setEmptyRows] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersData, setTotalUsersData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(TABLE_REC_LEN - (data ? data.length : 0), 0) }, (_, index) => ({})));
      setTotalUsers(totalRecords);
      setTotalUsersData(data);
    } else {
      if(!loading){
        setTotalUsers(0)
        setTotalUsersData([])
      }
    }
  }, [totalRecords, data, loading]);

  const handleClearSorting = () => {
    setSortBy("");
    setSortOrder(true);
  };

  useEffect(() => {    
    if (initialData) {
      setEmptyRows(Array.from({ length: Math.max(TABLE_REC_LEN - (initialData.data ? initialData.data.length : 0), 0) }, (_, index) => ({})));
      setTotalUsersData(initialData.data);
      setTotalUsers(initialData.totalRecords);
    }
  }, [initialData]);

  return (
    <section className={styles.mainContainer}>
      <div className={styles.tableHeader}>
        <InsightsHeader title="Users" />
      </div>
      <div className={`${styles["inner-container"]}`}>
        <section className={`${styles["outer-wrapper"]}`}>
          {error ? 
            <NoData message={error} />
            : (
            <div className={styles.tableResponsive}>
              <div className={styles.headerContainer}>
                <div className={styles.inline}>
                    <Heading mainText="User Engagement" />
                    <DateRangeTitle filter={filter} />
                </div>
                <div className={`${styles["table-header-tabs"]}`}>
                  <SearchButton label="Search User" setSearch={setSearch} />
                  <DateFilter
                    filter={filter}
                    setFilter={setFilter}
                    customDates={customDates}
                    setCustomDates={setCustomDates}
                  />
                  <Download setDownloadCSV={setDownloadCSV} />
                </div>
              </div>
              {
                totalUsersData?.length > 0 ?
                <>
                  {sortBy && <ClearSort onClick={handleClearSorting} />}
                  <TableData
                    columns={UserTableColumns}
                    data={totalUsersData ? [...totalUsersData, ...emptyRows] : null}
                    apiData={totalUsersData}
                    arrowColumns={arrowColumns}
                    tableLoading={loading}
                    totalRecords={totalUsers}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                    tableFor={TableBodySection.USER}
                  />
                  {totalUsers > limit && (
                    <Pagination page={page} limit={limit} totalRecords={totalUsers} setPage={setPage} />
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
};

export default Users;
