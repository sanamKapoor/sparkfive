import styles from "./index.module.css";

// Component
import Main from "../../../common/attributes/main";
import { pages } from "../../../../constants/analytics";
import { useEffect } from "react";
import analyticsApi from "../../../../server-api/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";

const Attributes: React.FC = () => {
  const data = usePageInfo();

  useEffect(() => {    
    analyticsApi.capturePageVisit({ name: pages.ATTRIBUTES, ...data })
  },[]);

  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default Attributes;
