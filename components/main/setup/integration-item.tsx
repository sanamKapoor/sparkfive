import { Integrations, Utilities } from "../../../assets";
import styles from "./integration-item.module.css";

// Components

import Button from "../../common/buttons/button";
import ButtonIcon from "../../common/buttons/button-icon";

const IntegrationItem = ({
  integrationName,
  integrationId,
  onClick,
  createdAt = "",
}) => {
  let existingIntegration = createdAt;

  return (
    <div className={styles.container}>
      <div className={styles.name}>{integrationName}</div>
      <img src={Integrations[integrationId]} />
      {existingIntegration ? (
        <Button
          text={"Connected"}
          type={"button"}
          className="container secondary input-height"
          disabled={true}
        />
      ) : (
        <ButtonIcon
          text={"Add Integration"}
          icon={Utilities.addAlt}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default IntegrationItem;
