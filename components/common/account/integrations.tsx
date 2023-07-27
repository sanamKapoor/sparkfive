import { capitalCase } from "change-case";
import { useEffect, useState } from "react";
import parameterApi from "../../../server-api/parameter";
import userApi from "../../../server-api/user";
import cookiesUtil from "../../../utils/cookies";
import styles from "./integrations.module.css";

// Components
import SectionButton from "../../common/buttons/section-button";
import IntegrationItem from "./integration-item";

const Integrations = ({ mode = "setup" }) => {
  const [integrations, setIntegrations] = useState([]);
  const [availableIntegrations, setAvailableIntegrations] = useState([]);
  const [activeList, setActiveList] = useState("enabled");

  useEffect(() => {
    getIntegrations();
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

  const addIntegration = (integration) => {
    cookiesUtil.set("integrationType", integration.type);
    if (mode === "setup") cookiesUtil.set("onSetup", "true");
    else cookiesUtil.remove("onSetup");
    window.location.replace(integration.oauthUrl);
  };

  let userIntegrations;
  if (mode === "setup") {
    userIntegrations = availableIntegrations.map((integration) => {
      const existingIntegration = integrations.find(
        (userIntegration) => userIntegration.type === integration.type
      );
      if (existingIntegration)
        return {
          ...integration,
          ...existingIntegration,
        };
      else return integration;
    });
  } else {
    if (activeList === "enabled") userIntegrations = integrations;
    else
      userIntegrations = availableIntegrations.filter(
        (availableInt) =>
          !integrations.find(
            (integration) => integration.type === availableInt.type
          )
      );
  }

  return (
    <>
      {mode === "settings" && (
        <div className={styles.buttons}>
          <SectionButton
            text="Enabled"
            active={activeList === "enabled"}
            onClick={() => setActiveList("enabled")}
          />
          <SectionButton
            text="Available"
            active={activeList === "available"}
            onClick={() => setActiveList("available")}
          />
        </div>
      )}
      <div className={styles.content}>
        {userIntegrations.length > 0 && activeList === "enabled" && (
          <>
            <h3>Enabled Integrations</h3>
            <div className={styles.header}>
              <h3>Name</h3>
            </div>
          </>
        )}
        <ul className={styles["integration-list"]}>
          {userIntegrations.map((integration) => (
            <li key={integration.type}>
              <IntegrationItem
                integrationName={integration.name}
                integrationId={integration.type}
                onClick={() => addIntegration(integration)}
                createdAt={integration.createdAt}
              />
            </li>
          ))}
          {userIntegrations.length === 0 && (
            <p>{`No ${activeList} integrations`}</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default Integrations;
