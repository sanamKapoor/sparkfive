import { useEffect, useState } from "react";
import parameterApi from "../../../server-api/parameter";
import cookiesUtil from "../../../utils/cookies";
import IntegrationItem from "./integration-item";
import styles from "./integrations.module.css";

const AvailableIntegrations = () => {
  const [availableIntegrations, setAvailableIntegrations] = useState([]);
  const [mode, setMode] = useState("settings"); //TODO: should come from context

  useEffect(() => {
    getAvailableIntegrations();
  }, []);

  const getAvailableIntegrations = async () => {
    try {
      const { data } = await parameterApi.getAvailableIntegrations();
      setAvailableIntegrations(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addIntegration = (integration) => {
    cookiesUtil.set("integrationType", integration.type);
    if (mode === "setup") cookiesUtil.set("onSetup", "true");
    else cookiesUtil.remove("onSetup");
    window.location.replace(integration.oauthUrl);
  };

  return (
    <div>
      <ul className={styles["integration-list"]}>
        {availableIntegrations.map((integration) => (
          <li key={integration.type}>
            <IntegrationItem
              integrationName={integration.name}
              integrationId={integration.type}
              onClick={() => addIntegration(integration)}
              createdAt={integration.createdAt}
            />
          </li>
        ))}
        {availableIntegrations.length === 0 && <p>No available integrations</p>}
      </ul>
    </div>
  );
};

export default AvailableIntegrations;
