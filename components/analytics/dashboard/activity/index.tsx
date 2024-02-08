import React, { useEffect, useState } from "react";
import { AnalyticsLayoutSection, InsightsApiEndpoint, TableBodySection } from "../../../../constants/analytics";
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
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalActivitiesData, setTotalActivitiesData] = useState([]);

  useEffect(() => {
    if (totalRecords > 0 && data.length > 0) {
      setTotalActivities(totalRecords);
      setTotalActivitiesData(data);
    }
  }, [totalRecords, data]);

  const handleClearSorting = () => {
    setSortBy("");
    setSortOrder(true);
  };

  useEffect(() => {    
    if (initialData) {
      setTotalActivitiesData(initialData.data);
      setTotalActivities(initialData.totalRecords);
      if(initialData.error) setError(initialData.error);
    }
  }, [initialData]);  


  return (
    <div className={styles.tableOuter}>
      <Heading mainText="Activity Feed" smallHeading={true} />
      {totalActivitiesData?.length > 0 && sortBy && <ClearSort onClick={handleClearSorting} />}
      {error ? (
        <NoData message={error} />
      ) : (
        <TableData 
          columns={activitycolumns} 
          arrowColumns={userActivityModalArrowColumns} 
          data={totalActivitiesData}
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
      )}
    </div>
  );
}

export default Activity;