import { useState } from "react";
import styles from "./index.module.css";

import Button from "../../../common/buttons/button";
import Billing from "./billing";
import Company from "./company";
import Profile from "./profile";
import Security from "./security";

const Account = () => {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button
          text="Profile"
          className={
            tab === 0 ? "section-container section-active" : "section-container"
          }
          onClick={() => setTab(0)}
        />
        <Button
          text="Billing"
          className={
            tab === 1 ? "section-container section-active" : "section-container"
          }
          onClick={() => setTab(1)}
        />
        <Button
          text="Company"
          className={
            tab === 2 ? "section-container section-active" : "section-container"
          }
          onClick={() => setTab(2)}
        />
        <Button
          text="Security"
          className={
            tab === 3 ? "section-container section-active" : "section-container"
          }
          onClick={() => setTab(3)}
        />
      </div>

      <div className={styles.content}>
        {tab === 0 && <Profile />}

        {tab === 1 && <Billing />}

        {tab === 2 && <Company />}

        {tab === 3 && <Security />}
      </div>
    </div>
  );
};

export default Account;
