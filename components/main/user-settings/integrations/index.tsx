import styles from "./index.module.css";

// Component
import IntegrationsComponent from "../../../common/account/integrations";

const Integrations: React.FC = () => {
  return (
    <div className={styles.container}>
      <IntegrationsComponent />
    </div>
  );
};

export default Integrations;
