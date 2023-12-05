import { Integrations, Utilities } from "../../../assets";
import styles from "./integration-item.module.css";

// Components
import Button from "../buttons/button";
import ButtonIcon from "../buttons/button-icon";

const IntegrationItem = ({ integrationName, integrationId, onClick, createdAt = "" }) => {
  let existingIntegration = createdAt;

  return (
    <div className={styles.container}>
      <div className={styles.name}>
        <img src={Integrations[integrationId]} />
        <div>{integrationName}</div>
      </div>
      {existingIntegration ? (
        <Button text={"Connected"} type={"button"} className={"container secondary input-height"} disabled={true} />
      ) : (
        <ButtonIcon text={"Add Integration"} SVGElement={Utilities.addAlt} onClick={onClick} />
      )}
    </div>
  );
};

export default IntegrationItem;
