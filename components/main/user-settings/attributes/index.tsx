import styles from "./index.module.css";

// Component
import Main from "../../../common/attributes/main";
import useAnalytics from "../../../../hooks/useAnalytics";
import { pages } from "../../../../constants/analytics";
import { useEffect } from "react";

const Attributes: React.FC = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.ATTRIBUTES)
  },[]);

  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default Attributes;
