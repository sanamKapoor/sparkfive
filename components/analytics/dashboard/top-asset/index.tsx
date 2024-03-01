import React, { useEffect, useState } from 'react';
import { AnalyticsLayoutSection, DASHBOARD_ASSET_TABLE_REC_LEN, InsightsApiEndpoint, TableBodySection } from '../../../../constants/analytics';
import { assetColumns, assetarrowColumns } from '../../../../data/analytics';
import useInsights from '../../../../hooks/useInsights';
import DateFilter from '../../common/date-filter';
import ClearSort from '../../common/header/clear-sort';
import Heading from '../../common/header/heading';
import SectionLink from '../../common/header/link';
import TableData from '../../common/table';
import styles from "../../index.module.css";
import NoData from '../../common/no-data';

const TopAssets = ({ initialData }) => {
  const { filter, setFilter, customDates, setCustomDates, totalRecords, data, error, sortBy, setError, loading, sortOrder, setSortBy, setSortOrder } = useInsights({ section: AnalyticsLayoutSection.DASHBOARD, endpoint: InsightsApiEndpoint.ASSET });
  const [emptyRows, setEmptyRows] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetsData, setTotalAssetsData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(DASHBOARD_ASSET_TABLE_REC_LEN - (data ? data.length : 0), 0) }, (_, index) => ({})));
      setTotalAssets(totalRecords);
      setTotalAssetsData(data);
    } else {
      if (!loading) {
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
          { length: Math.max(DASHBOARD_ASSET_TABLE_REC_LEN - (initialData.data ? initialData.data.length : 0), 0) },
          (_, index) => ({}),
        ),
      );
      setTotalAssetsData(initialData.data);
      setTotalAssets(initialData.totalRecords);
      if (initialData.error) setError(initialData.error);
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
          <div className={`${styles["button-wrapper"]}`}>
            <DateFilter filter={filter} setFilter={setFilter} customDates={customDates} setCustomDates={setCustomDates} />
          </div>
        </div>
      </div>
      {totalAssetsData?.length > 0 && sortBy && <ClearSort onClick={handleClearSorting} />}
      {totalAssetsData?.length > 0 ? <TableData
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
        tableFor={TableBodySection.DASHBOARD_ASSETS}
        dashboardView={true}
      />
        :
        <div className={styles.empty}>
          <NoData message="Data not found." wrapper={false} />
        </div>
      }
    </div>
  )
}

export default TopAssets