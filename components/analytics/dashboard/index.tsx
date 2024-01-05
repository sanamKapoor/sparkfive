import React from "react";
import styles from "../index.module.css";
import InsightsHeader from "../insights-header/insights.header";
import AssetChart from "../insights-chart/insights-chart";
import AssetTable from "../asset-table/asset-table";
import UserTable from "../insight-table/insight-table";
import ActivityFeedTable from "../activity-feed/activity-feed";
import { analyticsLayoutSection } from "../../../constants/analytics";
import ShareLinkPage from "../shared-links";

function Dashboard({
  activeSection
}: { activeSection: string }) {
  return (
    <section>
      <div className={styles.outerLayout}>
        <div className={`${styles["inner-wrapper"]}`}>
          <div className={`${styles["total-session"]}`}>
            <AssetChart activeSection={analyticsLayoutSection.DASHBOARD} />
          </div>
          <div>
            <AssetTable dashboardView={true} />
          </div>
          <div>
            <UserTable activeSection={activeSection} dashboardView={true} />
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
