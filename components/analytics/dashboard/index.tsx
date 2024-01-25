import React, { useContext } from "react";
import { DashboardSections } from "../../../constants/analytics";
import { AnalyticsContext } from "../../../context";
import AssetTable from "../asset";
import styles from "../index.module.css";
import UserTable from "../insight-table";
import AssetChart from "../insights-chart";

function Dashboard() {
  const { dashboardData } = useContext(AnalyticsContext);

  return (
    <section>
      <div className={styles.outerLayout}>
        <div className={`${styles["inner-wrapper"]}`}>
          <div className={`${styles["total-session"]}`}>
            <AssetChart />
          </div>
          <div>
            <AssetTable dashboardView={true} dashboardData={dashboardData[DashboardSections.ASSET]} />
          </div>
          <div>
            <UserTable dashboardView={true} dashboardData={dashboardData[DashboardSections.USER]} />
          </div>
          {/* <div>
            <ShareLinkPage dashboardView={true} />
          </div>
          <div>
            <ActivityFeedTable />
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
