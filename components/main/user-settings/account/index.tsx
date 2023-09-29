import styles from "./index.module.css";

import { tabsData } from "../../../../config/data/account";
import SwitchableTabs from "../../../common/switchable-tabs";
import React from "react";

const Account: React.FC = () => {
  return (
    <div className={styles.container}>
      <SwitchableTabs initialActiveTab="profile" data={tabsData} />
    </div>
  );
};

export default Account;
