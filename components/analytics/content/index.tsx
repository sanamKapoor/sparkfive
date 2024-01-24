import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { analyticsLayoutSection } from "../../../constants/analytics";
import { AnalyticsContext } from "../../../context";
import AssetTable from "../asset";
import Dashboard from "../dashboard";
import styles from "../index.module.css";
import UserTable from "../insight-table";
import InsightsHeader from "../insights-header";
import ShareLinkPage from "../shared-links";
import Team from "../team";

export default function Content() {

  const router = useRouter();
  const { activeSection } = useContext(AnalyticsContext);
  const [heading, setheading] = useState("Dashboard");
  const [content, setContent] = useState<React.ReactElement | null>(null);

  const setHeadingTitleAndContent = () => {
    switch (activeSection) {
      case analyticsLayoutSection.ACCOUNT_USERS:
        setheading("Users");
        setContent(<UserTable dashboardView={false} />);
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
        router.push('?section=dashboard&page=1&limit=6')
        setheading("Dashboard");
        setContent(<Dashboard />);
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
