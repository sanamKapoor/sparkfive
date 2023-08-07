import { useState } from "react";
import styles from "./index.module.css";

import { AccountTabs } from "../../../../types/common/tabs";
import Button from "../../../common/buttons/button";
import Billing from "./billing";
import Company from "./company";
import Profile from "./profile";
import Security from "./security";

const Account: React.FC = () => {
  const [tab, setTab] = useState<AccountTabs>(AccountTabs.PROFILE);

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button
          text="Profile"
          className={
            tab === AccountTabs.PROFILE
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setTab(AccountTabs.PROFILE)}
        />
        <Button
          text="Billing"
          className={
            tab === AccountTabs.BILLING
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setTab(AccountTabs.BILLING)}
        />
        <Button
          text="Company"
          className={
            tab === AccountTabs.COMPANY
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setTab(AccountTabs.COMPANY)}
        />
        <Button
          text="Security"
          className={
            tab === AccountTabs.SECURITY
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setTab(AccountTabs.SECURITY)}
        />
      </div>

      <div className={styles.content}>
        {tab === AccountTabs.PROFILE && <Profile />}

        {tab === AccountTabs.BILLING && <Billing />}

        {tab === AccountTabs.COMPANY && <Company />}

        {tab === AccountTabs.SECURITY && <Security />}
      </div>
    </div>
  );
};

export default Account;
