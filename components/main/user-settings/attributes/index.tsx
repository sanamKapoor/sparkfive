import styles from "./index.module.css";

// Component
import Main from "../../../common/attributes/main";
import { pages } from "../../../../constants/analytics";
import { useEffect } from "react";
import useAnalytics from "../../../../hooks/useAnalytics";

const Attributes: React.FC = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.ATTRIBUTES)
  },[]);

  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default Attributes;
