import { SwitchableTabsWithPropsData } from "../../../types/common/components";
import Button from "../buttons/button";
import styles from "./index.module.css";

interface ISwitchableTabsWithProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  data: SwitchableTabsWithPropsData[];
}

function SwitchableTabsWithProps({
  activeTab,
  setActiveTab,
  data,
}: ISwitchableTabsWithProps) {
  const activeTabData = data.find((item) => item.id === activeTab);
  const ActiveTabComponent = activeTabData.content;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  return (
    <div>
      <div className={styles.buttons}>
        {data.map((item) => (
          <Button
            key={item.id}
            text={item.title}
            className={
              activeTab === item.id
                ? "section-container section-active"
                : "section-container"
            }
            onClick={(e) => handleTabChange(item.id)}
          />
        ))}
      </div>
      <div>
        <ActiveTabComponent {...activeTabData.props} />
      </div>
    </div>
  );
}

export default SwitchableTabsWithProps;
