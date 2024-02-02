import React, { useEffect, useState } from 'react'
import styles from "../../index.module.css";
import useInsights from '../../../../hooks/useInsights';
import { InsightsApiEndpoint, TableBodySection, analyticsLayoutSection } from '../../../../constants/analytics';
import Heading from '../../common/header/heading';
import DateFilter from '../../common/date-filter';
import TableData from '../../common/table';
import ClearSort from '../../common/header/clear-sort';
import { assetColumns, assetarrowColumns } from '../../../../data/analytics';
import SectionLink from '../../common/header/link';

const TopAssets = ({ initialData }) => {
  const { filter, setFilter, customDates, setCustomDates, totalRecords, data, error, sortBy, setError, loading, sortOrder, setSortBy, setSortOrder } = useInsights({ section: analyticsLayoutSection.DASHBOARD, endpoint: InsightsApiEndpoint.ASSET });
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
    <div className={styles.tableResponsive}>
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
        activeSection={analyticsLayoutSection.DASHBOARD}
        tableLoading={loading}
        totalRecords={totalAssets}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        tableFor={TableBodySection.ASSET}
        dashboardView={true}
      />
    </div>
  );
}

export default TopAssets