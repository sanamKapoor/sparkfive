// TableComponent.js

import React, { useEffect, useState } from "react";
import { InsightsApiEndpoint, TABLE_REC_LEN, TableBodySection, analyticsLayoutSection } from "../../../constants/analytics";
import { UserTableColumns, arrowColumns } from "../../../data/analytics";
import Download from "../common/download-button";
import NoData from "../common/no-data";
import Pagination from "../common/pagination";
import SearchButton from "../common/search";
import TableData from "../common/table";
import styles from "../index.module.css";
import useInsights from "../../../hooks/useInsights";
import Heading from "../common/header/heading";
import ClearSort from "../common/header/clear-sort";
import DateFilter from "../common/date-filter";
import InsightsHeader from "../common/headline";
import DateRangeTitle from "../common/header/date-title";

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
  } = useInsights({ section: analyticsLayoutSection.ACCOUNT_USERS, endpoint: InsightsApiEndpoint.USER });
  const [emptyRows, setEmptyRows] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersData, setTotalUsersData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(TABLE_REC_LEN - (data ? data.length : 0), 0) }, (_, index) => ({})));
      setTotalUsers(totalRecords);
      setTotalUsersData(data);
    }
  }, [totalRecords, data]);

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
              {totalUsersData?.length > 0 && sortBy && <ClearSort onClick={handleClearSorting} />}
              <TableData
                columns={UserTableColumns}
                data={totalUsersData && emptyRows.length > 0 ? [...totalUsersData, ...emptyRows] : null}
                apiData={totalUsersData}
                arrowColumns={arrowColumns}
                activeSection={analyticsLayoutSection.ACCOUNT_USERS}
                tableLoading={loading}
                totalRecords={totalUsers}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
                tableFor={TableBodySection.USER}
              />
              {totalUsersData?.length > 0 && totalUsers > limit && (
                <Pagination page={page} limit={limit} totalRecords={totalUsers} setPage={setPage} />
              )}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Users;
