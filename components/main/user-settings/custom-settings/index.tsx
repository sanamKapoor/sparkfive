import styles from "./index.module.css";

// Component
import Main from "../../../common/custom-settings/main";
import useAnalytics from "../../../../hooks/useAnalytics";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";

const CustomSettings: React.FC = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.CUSTOM_SETTINGS)
  },[]);

  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default CustomSettings;
