import React, { useEffect, useState } from 'react'
import styles from "../../index.module.css";
import useInsights from '../../../../hooks/useInsights';
import { InsightsApiEndpoint, TableBodySection, analyticsLayoutSection } from '../../../../constants/analytics';
import Heading from '../../common/header/heading';
import DateFilter from '../../common/date-filter';
import ClearSort from '../../common/header/clear-sort';
import { DashboardUserColumns, arrowColumns } from '../../../../data/analytics';
import TableData from '../../common/table';
import SectionLink from '../../common/header/link';

const UserEngagment = ({ initialData }) => {
  const { filter, setFilter, customDates, setCustomDates, loading, error, sortBy, sortOrder, totalRecords, data, setSortBy, setSortOrder, setError } = useInsights({
    section: analyticsLayoutSection.DASHBOARD,
    endpoint: InsightsApiEndpoint.USER
  });
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersData, setTotalUsersData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
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
          <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
        </div>
      </div>
      {totalUsersData?.length > 0 && sortBy && <ClearSort onClick={handleClearSorting} />}
      <TableData
        columns={DashboardUserColumns}
        data={totalUsersData}
        apiData={totalUsersData}
        arrowColumns={arrowColumns}
        tableLoading={loading}
        totalRecords={totalUsers}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        tableFor={TableBodySection.USER}
        dashboardView={true}
      />
    </div>
  );
}

export default UserEngagment