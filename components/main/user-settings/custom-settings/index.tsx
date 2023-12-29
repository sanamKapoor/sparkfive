import styles from "./index.module.css";

// Component
import Main from "../../../common/custom-settings/main";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";
import analyticsApi from "../../../../server-api/analytics";

const CustomSettings: React.FC = () => {

  const data = usePageInfo();

  useEffect(() => {    
    analyticsApi.capturePageVisit({ name: pages.CUSTOM_SETTINGS, ...data })
  },[]);

  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default CustomSettings;
