import styles from "./user-preference.module.css";
import { Utilities } from "../../../assets";

const { radioButtonEnabled, radioButtonNormal } = Utilities;

interface UserPreferenceProps {
  enabled: boolean;
  setPreference: (val: boolean) => void;
  title: string;
  subtitle?: string;
  description: string;
}

const UserPreference: React.FC<UserPreferenceProps> = ({
  enabled,
  setPreference,
  title,
  subtitle,
  description,
}) => (
  <div className={styles.container}>
    <div className={"fields-first"}>
      <h3>{title}</h3>
      {subtitle && <h4>{subtitle}</h4>}
      <div className={styles.securityWrapper}>
      <p className={styles.desc}>{description}</p>
      <div className={styles["radio-options"]}>
      <div className={styles.option}>
        <div>On</div>
        <img
          src={enabled ? radioButtonEnabled : radioButtonNormal}
          onClick={() => setPreference(true)}
        />
      </div>
      <div className={styles.option}>
        <div>Off</div>
        <img
          src={enabled ? radioButtonNormal : radioButtonEnabled}
          onClick={() => setPreference(false)}
        />
      </div>
    </div>
      </div>
     
    </div>
    
  </div>
);

export default UserPreference;
