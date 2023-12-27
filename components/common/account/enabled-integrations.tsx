import { capitalCase } from "change-case";
import { useEffect, useState } from "react";
import userApi from "../../../server-api/user";
import IntegrationItem from "./integration-item";
import styles from "./integrations.module.css";
import analyticsApi from "../../../server-api/analytics";
import { pages } from "../../../constants/analytics";

const EnabledIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);

  useEffect(() => {
    analyticsApi.capturePageVisit(pages.INTEGRATIONS)
  },[]);

  useEffect(() => {
    getIntegrations();
  }, []);

  const getIntegrations = async () => {
    try {
      const { data } = await userApi.getIntegrations();
      setIntegrations(
        data.map((integration) => ({
          ...integration,
          name: capitalCase(integration.type),
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div  className={`${styles['enabled-integration-wrapper']}`}>
      <h3>Enabled Integrations</h3>
      <div className={styles.header}>
        <h3>Name</h3>
      </div>
      <ul className={styles["integration-list"]}>
        {integrations.map((integration) => (
          <li key={integration.type}>
            <IntegrationItem
              integrationName={integration.name}
              integrationId={integration.type}
              onClick={() => {}}
              createdAt={integration.createdAt}
            />
          </li>
        ))}
        {integrations.length === 0 && <p>No enabled integrations</p>}
      </ul>
    </div>
  );
};

export default EnabledIntegrations;
