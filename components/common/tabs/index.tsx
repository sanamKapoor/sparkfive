import React, { useEffect, useState } from "react";
import Button from "../buttons/button";

import styles from "./index.module.css";

interface TabsProps {
  data: Record<string, () => JSX.Element>;
}

const Tabs: React.FC<TabsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(Object.values(data)[0]);
  const [activeKey, setActiveKey] = useState(Object.keys(data)[0]);

  const handleTabClick = (e, key: string) => {
    setActiveTab(data[key]);
    setActiveKey(key);
  };

  useEffect(() => {
    console.log("current tab is switched");
  }, [activeTab]);

  console.log("activeTab: ", activeTab);
  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {Object.keys(data).map((item, index) => (
          <Button
            key={item}
            text={item}
            className={
              activeKey === item
                ? "section-container section-active"
                : "section-container"
            }
            onClick={(e) => handleTabClick(e, item)}
          />
        ))}
      </div>
      <div className={styles.content}>{activeTab}</div>
    </div>
  );
};

export default Tabs;
