import React, { useEffect, useState } from 'react';
import { AnalyticsLayoutSection, InsightsApiEndpoint, TableBodySection } from '../../../../constants/analytics';
import { assetColumns, assetarrowColumns } from '../../../../data/analytics';
import useInsights from '../../../../hooks/useInsights';
import DateFilter from '../../common/date-filter';
import ClearSort from '../../common/header/clear-sort';
import Heading from '../../common/header/heading';
import SectionLink from '../../common/header/link';
import TableData from '../../common/table';
import styles from "../../index.module.css";

const TopAssets = ({ initialData }) => {
  const { filter, setFilter, customDates, setCustomDates, totalRecords, data, error, sortBy, setError, loading, sortOrder, setSortBy, setSortOrder } = useInsights({ section: AnalyticsLayoutSection.DASHBOARD, endpoint: InsightsApiEndpoint.ASSET });
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetsData, setTotalAssetsData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setTotalAssets(totalRecords);
      setTotalAssetsData(data);
    }
  }, [totalRecords, data]);

  const handleClearSorting = () => {
    setSortBy("");
    setSortOrder(true);
  };

  useEffect(() => {
    if (initialData) {
      setTotalAssetsData(initialData.data);
      setTotalAssets(initialData.totalRecords);
      if(initialData.error) setError(initialData.error);
    }
  }, [initialData]);

  return (
    <div className={`${styles["tableResponsive"]} ${styles["asset-dashboard"]}`}>
      <div className={styles.headerContainer}>
        <div>
          <Heading mainText="Top Assets" smallHeading={true} />
          <SectionLink title='View All' link="/main/insights/account/assets" />
        </div>
        <div className={`${styles["table-header-tabs"]}`}>
          <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
        </div>
      </div>
      {totalAssetsData?.length > 0 && sortBy && <ClearSort onClick={handleClearSorting} />}
      <TableData
        columns={assetColumns}
        data={totalAssetsData}
        apiData={totalAssetsData}
        arrowColumns={assetarrowColumns}
        tableLoading={loading}
        totalRecords={totalAssets}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        tableFor={TableBodySection.DASHBOARD_ASSETS}
        dashboardView={true}
      />
    </div>
  );
}

export default TopAssets