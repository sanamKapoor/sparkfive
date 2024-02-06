import React, { useContext, useEffect, useState } from "react";
import { Utilities } from "../../../assets";
import { LoadingContext, UserContext } from "../../../context";
import teamAPI from "../../../server-api/team";
import IconClickable from "../buttons/icon-clickable";
import styles from "./main.module.css";

import faceRecognitionApi from "../../../server-api/face-recognition";
import attributeApi from "../../../server-api/attribute";
import { defaultFaceRecognitionSettings } from "../../../constants/face-recognition";

import FaceRecognitionOperations from "./face-recognition-operations";

const Automations = () => {
  const { setIsLoading: setLoading } = useContext(LoadingContext);
  const { advancedConfig, setAdvancedConfig, faceRecognitionSettings, setFaceRecognitionSettings, user } =
    useContext(UserContext);
  const [customFields, setCustomFields] = useState([]);

  const saveAdvanceConfig = async (config: any) => {
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

  const saveRecognitionConfig = async (config: any) => {
    try {
      setLoading(true);
      await faceRecognitionApi.updateSetting(config.active ? config : defaultFaceRecognitionSettings);

      const updatedConfig = config.active ? { ...faceRecognitionSettings, ...config } : defaultFaceRecognitionSettings;
      setFaceRecognitionSettings(updatedConfig);
    } catch (err) {
      console.log("err in saving face recognition config: ", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomFields = async () => {
    const { data } = await attributeApi.getCustomFields({ isAll: 1 });
    return data;
  };

  const fetchAllData = async () => {
    setLoading(true);

    const tasks = [fetchCustomFields()];
    const [fieldData] = await Promise.all(tasks);

    setCustomFields(fieldData);

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles["custom-view-wrapper"]}`}>
        <h3>Automations</h3>

        <div className={styles.row}>
          <div className={styles["label-wrapper"]}>
            <span className={styles.label}>AI Tagging</span>
          </div>

          <div className={styles["field-radio-wrapper"]}>
            <div className={styles.radio}>
              <div>On</div>
              <IconClickable
                src={advancedConfig.aiTagging ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                additionalClass={styles["select-icon"]}
                onClick={() => saveAdvanceConfig({ aiTagging: true })}
              />
            </div>
            <div className={`${styles.radio} ${styles.automation}`}>
              <div>Off</div>
              <IconClickable
                src={!advancedConfig.aiTagging ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                additionalClass={styles["select-icon"]}
                onClick={() => saveAdvanceConfig({ aiTagging: false })}
              />
            </div>
          </div>
        </div>

        {user?.team?.faceRecognition && (
          <>
            <div className={`${styles.row} ${styles["no-border"]}`}>
              {/*<FaceRecognitionOperations />*/}
              <span className={`${styles.label}`}>Facial recognition</span>
              <div className={styles["field-radio-wrapper"]}>
                <div className={styles.radio}>
                  <div>On</div>
                  <IconClickable
                    src={faceRecognitionSettings.active ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                    additionalClass={styles["select-icon"]}
                    onClick={() => saveRecognitionConfig({ ...faceRecognitionSettings, active: true })}
                  />
                </div>
                <div className={`${styles.radio} ${styles.automation}`}>
                  <div>Off</div>
                  <IconClickable
                    src={!faceRecognitionSettings.active ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                    additionalClass={styles["select-icon"]}
                    onClick={() => saveRecognitionConfig({ ...faceRecognitionSettings, active: false })}
                  />
                </div>
              </div>
            </div>

            {faceRecognitionSettings.active && (
              <div className={styles["facial-box"]}>
                <div className={"m-b-16"}>Facial recognition Labels</div>
                <div className={styles["radio-row"]}>
                  <IconClickable
                    src={
                      faceRecognitionSettings.labelType === "tag"
                        ? Utilities.radioButtonEnabled
                        : Utilities.radioButtonNormal
                    }
                    additionalClass={styles["select-icon"]}
                    onClick={() => saveRecognitionConfig({ ...faceRecognitionSettings, labelType: "tag" })}
                  />
                  <div className={"m-l-8 font-weight-300"}>Tags</div>
                </div>
                <div className={styles["radio-row"]}>
                  <IconClickable
                    src={
                      faceRecognitionSettings.labelType === "customAttribute"
                        ? Utilities.radioButtonEnabled
                        : Utilities.radioButtonNormal
                    }
                    additionalClass={styles["select-icon"]}
                    onClick={() => saveRecognitionConfig({ ...faceRecognitionSettings, labelType: "customAttribute" })}
                  />
                  <div className={"m-l-8 font-weight-300"}> Custom Fields</div>
                </div>

                {faceRecognitionSettings.labelType === "customAttribute" && (
                  <div className={styles["custom-field-row"]}>
                    <div className={"m-b-16"}>Custom Fields</div>
                    {customFields.map(({ id, name }, index) => {
                      return (
                        <div className={styles["radio-row"]} key={index}>
                          <IconClickable
                            src={
                              faceRecognitionSettings.customAttribute === id
                                ? Utilities.radioButtonEnabled
                                : Utilities.radioButtonNormal
                            }
                            additionalClass={styles["select-icon"]}
                            onClick={() => saveRecognitionConfig({ ...faceRecognitionSettings, customAttribute: id })}
                          />
                          <div className={"m-l-8 font-weight-300"}>{name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Automations;
