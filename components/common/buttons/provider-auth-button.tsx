import { capitalCase } from "change-case";
import simplebtnstyles from "./auth-button.module.css";
import Button from "./button";
import styles from "./provider-auth-button.module.css";

const ProviderAuthButton = ({ provider, onClick, icon }) => (
  <>
    {provider === "sso" ? (
      <Button
        className={simplebtnstyles.container}
        onClick={onClick}
        text={`${capitalCase(provider)}`}
      />
    ) : (
      <button
        className={`${styles.button} ${styles[provider]}`}
        onClick={onClick}
      >
        <div className={styles["btn-icon"]}>
          <img src={icon} alt={provider} />
        </div>
        <span className={styles["btn-text"]}>
          {`Sign in with ${capitalCase(provider)}`}
        </span>
      </button>
    )}
  </>
);

export default ProviderAuthButton;
