import React, { useEffect, useState } from "react";
import UserTable from "./insight-table/insight-table";
import InsightsHeader from "./insights-header/insights.header";
import styles from "./index.module.css";
import { insights } from "../../assets";
import UserModal from "./Modals/user-modal/user-modal";
import AssetTable from "./asset-table/asset-table";
import AssetChart from "./insights-chart/insights-chart";
import Dashboard from "./dashboard";
import NoData from "./no-data/no-data";
import ShareLinkTable from "./shared-links/share-link-table";
import ShareLinkPage from "./shared-links";
import SharedUserModal from "./Modals/user-modal/shared-user-modal";
import { analyticsLayoutSection } from "../../constants/analytics";
import Team from "./team";

export default function Content({
  activeSection
}: { activeSection: string }) {

  const [heading, setheading] = useState("Dashboard");
  const [content, setContent] = useState<React.ReactElement | null>(null);

  const setHeadingTitleAndContent = () => {
    switch (activeSection) {
      case analyticsLayoutSection.ACCOUNT_USERS:
        setheading("Users");
        setContent(<UserTable activeSection={activeSection} dashboardView={false} />);
        break;
      case analyticsLayoutSection.EXTERNAL_USERS:
        setheading("Users");
        setContent(null);
        break;
      case (analyticsLayoutSection.ACCOUNT_ASSETS):
        setheading("Assets");
        setContent(<AssetTable dashboardView={false} />);
        break;
      case analyticsLayoutSection.EXTERNAL_ASSETS:
        setheading("Assets");
        setContent(null);
        break;
      case analyticsLayoutSection.SHARED_LINK:
        setheading("Top Shared Links");
        setContent(<ShareLinkPage dashboardView={false} />);
        break;
      case analyticsLayoutSection.TEAM:
        setheading("Team");
        setContent(<Team />);
        break;
      default:
        setheading("Dashboard");
        setContent(<Dashboard activeSection={activeSection} />);
    }
  }

  useEffect(() => {
    setHeadingTitleAndContent();
  }, [activeSection])

  return (
    <section className={styles.mainContainer}>
      <div className={styles.tableHeader}>
        <InsightsHeader title={heading} companyName="Holli Inc." />
      </div>
      <div className={`${styles["inner-container"]}`}>
        {content}
      </div>
    </section>
  );
}
