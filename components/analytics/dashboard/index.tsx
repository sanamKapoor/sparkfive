import React from "react";
import { DashboardSections } from "../../../constants/analytics";
import InsightsHeader from "../common/headline";
import styles from "../index.module.css";
import Activity from "./activity";
import TeamSession from "./session";
import TopAssets from "./top-asset";
import UserEngagment from "./user-eng";

function Dashboard({ data }) {
  return (
    <section className={styles.mainContainer}>
      <div className={styles.tableHeader}>
        <InsightsHeader title="Dashboard" />
      </div>
      <div className={`${styles["inner-container"]}`}>
        <section className={`${styles["inner-wrapper"]}`}>
        <TeamSession initialData={data.find(d => d.section === DashboardSections.TEAM)} />
        <TopAssets initialData={data.find(d => d.section === DashboardSections.ASSET)} />
        </section>
      </div >
      
  
    <div className={`${styles["inner-container"]}`}>
      <section className={`${styles["inner-wrapper-box"]}`}>
        <UserEngagment initialData={data.find(d => d.section === DashboardSections.USER)} />
        <Activity initialData={data.find(d => d.section === DashboardSections.USER_ACTIVITY)} />
      </section>
    </div>
    </section >
  );
}

export default Dashboard;
