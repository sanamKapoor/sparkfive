import { useContext, useState } from "react";
import { Utilities } from "../../../assets";
import { UserContext } from "../../../context";
import teamAPI from "../../../server-api/team";
import IconClickable from "../buttons/icon-clickable";
import styles from "./main.module.css";

const AccountActions = () => {
  const [loading, setLoading] = useState(false);
  const { advancedConfig, setAdvancedConfig } = useContext(UserContext);

  const saveAdvanceConfig = async (config) => {
    try {
      setLoading(true);
      await teamAPI.saveAdvanceConfigurations({ config });

      const updatedConfig = { ...advancedConfig, ...config };
      setAdvancedConfig(updatedConfig);
    } catch (err) {
      console.log("err in saving advanced config: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles["custom-view-wrapper"]}`}>
        <h3>Account Actions</h3>

        <div>
          <div className={styles.row}>
            <span className={styles.label}>Search Default</span>
            <div className={styles["field-radio-wrapper"]}>
              <div
                className={`${styles["radio"]} ${styles["account-action-wrapper"]}`}
              >
                <div>All</div>
                <IconClickable
                  src={
                    advancedConfig?.searchDefault === "all"
                      ? Utilities.radioButtonEnabled
                      : Utilities.radioButtonNormal
                  }
                  additionalClass={styles["select-icon"]}
                  onClick={() => saveAdvanceConfig({ searchDefault: "all" })}
                />
              </div>
              <div className={`${styles["radio"]} ${styles["subfolder-tags"]}`}>
                <div>Tags Only</div>
                <IconClickable
                  src={
                    advancedConfig?.searchDefault === "tags_only"
                      ? Utilities.radioButtonEnabled
                      : Utilities.radioButtonNormal
                  }
                  additionalClass={styles["select-icon"]}
                  onClick={() =>
                    saveAdvanceConfig({ searchDefault: "tags_only" })
                  }
                />
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Folder Upload Configuration</div>
            <div className={styles["field-radio-wrapper"]}>
              <div
                className={`${styles["radio"]} ${styles["account-action-wrapper"]}`}
              >
                <div>Subfolder as Separate Collection</div>
                <IconClickable
                  src={
                    advancedConfig?.subFolderAutoTag
                      ? Utilities.radioButtonEnabled
                      : Utilities.radioButtonNormal
                  }
                  additionalClass={styles["select-icon"]}
                  onClick={() => saveAdvanceConfig({ subFolderAutoTag: true })}
                />
              </div>
              <div className={`${styles["radio"]} ${styles["subfolder-tags"]}`}>
                <div>Subfolder as Tags (Default)</div>
                <IconClickable
                  src={
                    !advancedConfig?.subFolderAutoTag
                      ? Utilities.radioButtonEnabled
                      : Utilities.radioButtonNormal
                  }
                  additionalClass={styles["select-icon"]}
                  onClick={() => saveAdvanceConfig({ subFolderAutoTag: false })}
                />
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.label}>
              Duplicate Management - Check Uploads
            </div>
            <div className={styles["field-radio-wrapper"]}>
              <div
                className={`${styles["radio"]} ${styles["account-action-wrapper"]}`}
              >
                <div>On</div>
                <IconClickable
                  src={
                    advancedConfig?.duplicateCheck
                      ? Utilities.radioButtonEnabled
                      : Utilities.radioButtonNormal
                  }
                  additionalClass={styles["select-icon"]}
                  onClick={() => saveAdvanceConfig({ duplicateCheck: true })}
                />
              </div>
              <div className={`${styles["radio"]} ${styles["subfolder-tags"]}`}>
                <div>Off</div>
                <IconClickable
                  src={
                    !advancedConfig?.duplicateCheck
                      ? Utilities.radioButtonEnabled
                      : Utilities.radioButtonNormal
                  }
                  additionalClass={styles["select-icon"]}
                  onClick={() => saveAdvanceConfig({ duplicateCheck: false })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountActions;
