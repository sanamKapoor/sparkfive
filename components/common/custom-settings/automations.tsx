import { useContext, useState } from "react";
import { Utilities } from "../../../assets";
import { UserContext } from "../../../context";
import teamAPI from "../../../server-api/team";
import IconClickable from "../buttons/icon-clickable";
import styles from "./main.module.css";

const Automations = () => {
  const [loading, setLoading] = useState(false);
  const { advancedConfig, setAdvancedConfig } = useContext(UserContext);

  const saveAdvanceConfig = async (config) => {
    try{
    setLoading(true);
    await teamAPI.saveAdvanceConfigurations({ config });

    const updatedConfig = { ...advancedConfig, ...config };
    setAdvancedConfig(updatedConfig);
    }catch(err){
     console.log('err in saving advanced config: ', err)
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles['custom-view-wrapper']}`}>
      <h3>Automations</h3>
      
        <div className={styles.row}>
          <span className={styles.label}>AI Tagging</span>
          <div className={styles["field-radio-wrapper"]}>
            <div className={styles.radio}>
              <div>On</div>
              <IconClickable
                src={
                  advancedConfig.aiTagging
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => saveAdvanceConfig({ aiTagging: true })}
              />
            </div>
            <div className={`${styles.radio} ${styles.automation}`}>
              <div>Off</div>
              <IconClickable
                src={
                  !advancedConfig.aiTagging
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => saveAdvanceConfig({ aiTagging: false })}
              />
            </div>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default Automations;
