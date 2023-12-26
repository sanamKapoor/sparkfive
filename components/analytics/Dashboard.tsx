import React from "react";
import styles from "./index.module.css";
import InsightsHeader from "./insights-header/insights.header";
import AssetChart from "./insights-chart/insights-chart";
import AssetTable from "./asset-table/asset-table";
import UserTable from "./insight-table/insight-table";
import ActivityFeedTable from "./activity-feed/activity-feed";

function Dashboard() {
  return (
    <section>
      <div className={styles.outerLayout}>
        <div className={`${styles["inner-wrapper"]}`}>
          <div className={`${styles["total-session"]}`}>
            <AssetChart />
          </div>

          <div>
            <AssetTable />
          </div>
          <div>
            <UserTable />
          </div>
          <div>
          <ActivityFeedTable/>
          </div>
          <div>
          <ActivityFeedTable/>
          </div>
         </div>
      </div>
    </section>
  );
}

export default Dashboard;
