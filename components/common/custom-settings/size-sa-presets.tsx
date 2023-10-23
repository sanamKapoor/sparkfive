import { useEffect, useState } from "react";
import styles from "./custom-file-size.module.css";

import { AssetOps, Utilities } from "../../../assets";

// APIs
import sizeApi from "../../../server-api/size";

// Components
import toastUtils from "../../../utils/toast";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import Input from "../inputs/input";
import ConfirmModal from "../modals/confirm-modal";
import SpinnerOverlay from "../spinners/spinner-overlay";

const SizeSaPresets = () => {
  const [presetList, setPresetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(); // Id is pending to delete

  // Get tag list
  const getSizePresets = async () => {
    // Show loading
    setLoading(true);

    let { data } = await sizeApi.getSizePresets();

    setPresetList(data);

    // Hide loading
    setLoading(false);
  };

  // Save updated changes
  const saveChanges = async (index) => {
    try {
      // Show loading
      setLoading(true);

      // Call API to delete tag
      await sizeApi.createPresetSize({ sizes: [presetList[index]] });

      // Edit
      if (presetList[index].id !== null) {
        toastUtils.success("Preset size changes saved");

        // Refresh the list
        getSizePresets();
      } else {
        // Create the new one
        toastUtils.success("Preset size created successfully");

        // Refresh the list
        getSizePresets();
      }
    } catch (err) {
      if (err.response?.status === 400) toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not create file size preset, please try again later.");

      // Show loading
      setLoading(false);
    }
  };

  const deleteSizePreset = async (id) => {
    // Hide confirm modal
    setConfirmDeleteModal(false);

    // Show loading
    setLoading(true);

    // Call API to delete custom size
    await sizeApi.deletePresetSize({ sizeIds: [id] });

    // Refresh the list
    getSizePresets();
  };

  // On input change
  const onInputChange = (e, name, index) => {
    let currentFieldList = [...presetList];
    currentFieldList[index][name] = e.target.value;
    setPresetList(currentFieldList);
  };

  const addNew = () => {
    setPresetList(
      presetList.concat([
        {
          id: null,
          name: "",
          presetName: "",
        },
      ]),
    );
  };

  useEffect(() => {
    getSizePresets();
  }, []);

  return (
    <div className={`${styles["main-wrapper"]} ${styles["size-preset-main-wrapper"]}`}>
      {presetList.map((field, index) => {
        return (
          <div className={`${styles["row"]} ${styles["custom-setting-border"]} ${styles["field-block"]}`} key={index}>
            <div
              // className={`${styles["col-20"]} ${styles["col-md-100"]} p-l-r-0`}
              className="col-20 col-sm-100 col-md-100 p-l-r-0"
            >
              <div className={styles["row"]}>
                <div className={`${styles["col-100"]} ${styles["flex-display"]} d-flex`}>
                  <span className={styles["font-weight-600"]}>{index + 1}.</span>
                  <span className={`${styles["row-header"]} ${styles["font-weight-600"]}`}>Channel</span>
                </div>
                <div className={`${styles["col-100"]} ${styles["p-l-30"]}`}>
                  <label className={`${styles["input-label"]} visibility-hidden`}>Width (px)</label>
                  <Input
                    onChange={(e) => {
                      onInputChange(e, "presetName", index);
                    }}
                    value={field.presetName}
                    placeholder={"Channel"}
                    styleType={"regular-short"}
                  />
                </div>
              </div>
            </div>
            <div
              // className={`${styles["col-25"]} ${styles["col-md-100"]} ${styles["col-sm-100"]} p-l-r-0`}
              className="col-20 col-sm-100 col-md-100 p-l-r-0"
            >
              <div className={styles["row"]}>
                <div className={`${styles["col-100"]} ${styles["flex-display"]}`}>
                  <span className={`${styles["row-header"]} ${styles["font-weight-600"]}`}>Custom File Size name</span>
                </div>
                <div className={`${styles["col-100"]} ${styles["p-l-30"]}`}>
                  <label className={`${styles["input-label"]} visibility-hidden`}>Width (px)</label>
                  <Input
                    onChange={(e) => {
                      onInputChange(e, "name", index);
                    }}
                    value={field.name}
                    placeholder={"Field name"}
                    styleType={"regular-short"}
                  />
                </div>
              </div>
            </div>
            <div
              // className={`${styles["col-35"]} ${styles["col-md-100"]} p-l-r-0`}
              className="col-20 col-sm-100 col-md-100 p-l-r-0"
            >
              <div className={styles["row"]}>
                <div className={`${styles["col-100"]} ${styles["flex-display"]} justify-center`}>
                  <span className={`${styles["row-header"]} ${styles["font-weight-600"]}`}>Dimensions</span>
                </div>
                <div className={`${styles["col-100"]}`}>
                  <div className={"row"}>
                    <div className={"col-50"}>
                      <label className={styles["input-label"]}>Width (px)</label>
                      <Input
                        onChange={(e) => {
                          onInputChange(e, "width", index);
                        }}
                        value={field.width}
                        placeholder={"Width"}
                        additionalClasses={"center-input"}
                        type={"number"}
                        styleType={"regular-short"}
                        additionalClasses={styles.DimensionBox}
                      />
                    </div>
                    <div className={"col-50"}>
                      <label className={styles["input-label"]}>Height (px)</label>
                      <Input
                        onChange={(e) => {
                          onInputChange(e, "height", index);
                        }}
                        value={field.height}
                        placeholder={"Height"}
                        type={"number"}
                        additionalClasses={"center-input"}
                        styleType={"regular-short"}
                        additionalClasses={styles.DimensionBox}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles["col-20"]} ${styles["col-md-100"]} ${styles["button-row"]} p-l-r-0`}>
              <div className={"row"}>
                <div className={`${styles["col-100"]} ${styles["flex-display"]}`}>
                  <span className={`${styles["row-header"]} ${styles["font-weight-600"]} visibility-hidden`}>
                    Header
                  </span>
                </div>
                <div className={`${styles["col-100"]} p-r-0 p-l-0 d-flex p-t-15`}>
                  <div className={styles.saveblock}>
                    <Button
                      className={"container exclude-min-height primary"}
                      type={"button"}
                      text="Save"
                      onClick={() => {
                        saveChanges(index);
                      }}
                      disabled={!field.name || !field.presetName || !field.width || !field.height}
                    />
                    {
                      <IconClickable
                        additionalClass={styles["action-button"]}
                        SVGElement={AssetOps[`delete`]}
                        tooltipText={"Delete"}
                        tooltipId={"Delete"}
                        onClick={() => {
                          if (field.id) {
                            setCurrentDeleteId(field.id);
                            setConfirmDeleteModal(true);
                          } else {
                            setPresetList(presetList.filter((item, indexItem) => index !== indexItem));
                          }
                        }}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {
        <div className={`${styles["row"]} ${styles["field-block"]}`}>
          <div className={`${styles["col-100"]}`}>
            <div className={`${styles["row"]} p-l-r-10`}>
              <div className={`add ${styles["select-add"]}`} onClick={addNew}>
                <IconClickable src={Utilities.add} />
                <span className={"font-weight-500"}>Add New</span>
              </div>
            </div>
          </div>
        </div>
      }

      <ConfirmModal
        modalIsOpen={confirmDeleteModal}
        closeModal={() => {
          setConfirmDeleteModal(false);
        }}
        confirmAction={() => {
          deleteSizePreset(currentDeleteId);
        }}
        confirmText={"Delete"}
        message={<span>Are you sure you want to delete this size preset?</span>}
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />

      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default SizeSaPresets;
