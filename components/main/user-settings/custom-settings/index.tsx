import styles from "./index.module.css";

// Component
import Main from "../../../common/custom-settings/main";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";

const CustomSettings: React.FC = () => {

  const { pageVisit } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.CUSTOM_SETTINGS)
  },[]);

  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default CustomSettings;
