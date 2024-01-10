import React from "react";
import ActivityFeedTable from "../activity";
import AssetTable from "../asset";
import styles from "../index.module.css";
import UserTable from "../insight-table";
import AssetChart from "../insights-chart";
import ShareLinkPage from "../shared-links";

function Dashboard() {
  return (
    <section>
      <div className={styles.outerLayout}>
        <div className={`${styles["inner-wrapper"]}`}>
          <div className={`${styles["total-session"]}`}>
            <AssetChart />
          </div>
          <div>
            <AssetTable dashboardView={true} />
          </div>
          <div>
            <UserTable dashboardView={true} />
          </div>
          <div>
            <ShareLinkPage dashboardView={true} />
          </div>
          <div>
            <ActivityFeedTable />
          </div>
        
         </div>
      </div>
    </section>
  );
}

export default Dashboard;
