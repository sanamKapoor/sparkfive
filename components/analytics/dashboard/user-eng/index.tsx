import React, { useEffect, useState } from 'react';
import { AnalyticsLayoutSection, DASHBOARD_TABLE_REC_LEN, DashboardSections, TableBodySection } from '../../../../constants/analytics';
import { DashboardUserColumns, arrowColumns } from '../../../../data/analytics';
import useInsights from '../../../../hooks/useInsights';
import DateFilter from '../../common/date-filter';
import ClearSort from '../../common/header/clear-sort';
import Heading from '../../common/header/heading';
import SectionLink from '../../common/header/link';
import TableData from '../../common/table';
import styles from "../../index.module.css";

const UserEngagment = ({ initialData }) => {
  const { filter, setFilter, customDates, setCustomDates, loading, error, sortBy, sortOrder, totalRecords, data, setSortBy, setSortOrder, setError } = useInsights({
    section: AnalyticsLayoutSection.DASHBOARD,
    endpoint: DashboardSections.USER
  });
  const [emptyRows, setEmptyRows] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersData, setTotalUsersData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(DASHBOARD_TABLE_REC_LEN - (data ? data.length : 0), 0) }, (_, index) => ({})));
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
      setEmptyRows(Array.from({ length: Math.max(DASHBOARD_TABLE_REC_LEN - (initialData.data ? initialData.data.length : 0), 0) }, (_, index) => ({})));
      setTotalUsersData(initialData.data);
      setTotalUsers(initialData.totalRecords);
      if(initialData.error) setError(initialData.error);
    }
  }, [initialData]);  

  return (
    <div className={styles.tableResponsive}>
      <div className={styles.headerContainer}>
        <div>
          <Heading mainText="User Engagement" smallHeading={true} />
          <SectionLink title='View All' link="/main/insights/account/users" />
        </div>
        <div className={`${styles["table-header-tabs"]}`}>
        <div className={`${styles["button-wrapper"]}`}>
          <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
          </div>
        </div>
      </div>
      {totalUsersData?.length > 0 && sortBy && <ClearSort onClick={handleClearSorting} />}
      <TableData
        columns={DashboardUserColumns}
        data={totalUsersData ? [...totalUsersData, ...emptyRows] : null}
        apiData={totalUsersData}
        arrowColumns={arrowColumns}
        tableLoading={loading}
        totalRecords={totalUsers}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        tableFor={TableBodySection.DASHBOARD_USERS}
        dashboardView={true}
      />
    </div>
  );
}

export default UserEngagment