import React, { useEffect, useState } from "react";
import { AnalyticsLayoutSection, DASHBOARD_TABLE_REC_LEN, InsightsApiEndpoint, TableBodySection } from "../../../../constants/analytics";
import {
  activitycolumns,
  userActivityModalArrowColumns
} from "../../../../data/analytics";
import useInsights from "../../../../hooks/useInsights";
import ClearSort from "../../common/header/clear-sort";
import Heading from "../../common/header/heading";
import NoData from "../../common/no-data";
import TableData from "../../common/table";
import styles from "../../index.module.css";

function Activity({ initialData }) {
  const { loading, sortBy, sortOrder, totalRecords, data, error, setSortBy, setSortOrder, setError } = useInsights({
    section: AnalyticsLayoutSection.DASHBOARD,
    endpoint: InsightsApiEndpoint.USER_ACTIVITY
  });
  const [emptyRows, setEmptyRows] = useState([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalActivitiesData, setTotalActivitiesData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setEmptyRows(Array.from({ length: Math.max(DASHBOARD_TABLE_REC_LEN - (data ? data.length : 0), 0) }, (_, index) => ({})));
      setTotalActivities(totalRecords);
      setTotalActivitiesData(data);
    } else {
      if (!loading) {
        setTotalActivities(0)
        setTotalActivitiesData([])
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
      setTotalActivitiesData(initialData.data);
      setTotalActivities(initialData.totalRecords);
      if (initialData.error) setError(initialData.error);
    }
  }, [initialData]);


  return (
    <div className={styles.tableOuter}>
      <Heading mainText="Activity Feed" smallHeading={true} />
      {totalActivitiesData?.length > 0 && sortBy && <ClearSort onClick={handleClearSorting} />}
      {
        totalActivitiesData?.length > 0 ?
          (
            <TableData
              columns={activitycolumns}
              arrowColumns={userActivityModalArrowColumns}
              data={totalActivitiesData ? [...totalActivitiesData, ...emptyRows] : null}
              apiData={totalActivitiesData}
              tableLoading={loading}
              totalRecords={totalActivities}
              sortBy={sortBy}
              sortOrder={sortOrder}
              setSortBy={setSortBy}
              setSortOrder={setSortOrder}
              tableFor={TableBodySection.USER_ACTIVITY}
              dashboardView={true}
            />
          )
          :
          <div className={styles.empty}>
            <NoData message={error ? error : "Data not found."} wrapper={false} />
          </div>
      }
    </div>
  );
}

export default Activity;
