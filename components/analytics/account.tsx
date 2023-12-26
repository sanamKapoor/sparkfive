import React from "react";
import UserTable from "./insight-table/insight-table";
import InsightsHeader from "./insights-header/insights.header";
import styles from "./index.module.css";
import { insights } from "../../assets";
import UserModal from "./Modals/user-modal/user-modal";
import AssetTable from "./asset-table/asset-table";
import AssetChart from "./insights-chart/insights-chart";
import Dashboard from "./Dashboard";
export default function Account() {
  return (
    <section className={styles.mainContainer}>
      <div className={styles.tableHeader}>
        <InsightsHeader title="Users" companyName="Holli Inc." />
      </div>
      <div className={`${styles["inner-container"]}`}>
        <UserTable />
      </div>
    </section>
  );
}
