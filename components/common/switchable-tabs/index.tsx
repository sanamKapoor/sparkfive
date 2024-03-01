import React, { useContext, useState } from "react";
import Button from "../buttons/button";

import { UserContext } from "../../../context";
import styles from "./index.module.css";

interface SwitchableTabsProps {
  data: {
    id: string;
    title: string;
    content: React.FC;
    permissions: string[];
  }[];
  initialActiveTab: string;
}

const SwitchableTabs: React.FC<SwitchableTabsProps> = ({
  initialActiveTab,
  data,
}) => {
  const { hasPermission } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const filteredData = data?.filter((item) => hasPermission(item.permissions));

  const ActiveTabContent = filteredData.find(
    (item) => item.id === activeTab
  )?.content;

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {filteredData.map((item) => (
          <Button
            key={item.id}
            text={item.title}
            className={
              activeTab === item.id
                ? "section-container section-active"
                : "section-container"
            }
            onClick={(e) => handleTabClick(item.id)}
          />
        ))}
      </div>
      <div className={styles.content}>
        <ActiveTabContent />
      </div>
    </div>
  );
};

export default SwitchableTabs;
