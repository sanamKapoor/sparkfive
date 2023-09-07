import { useEffect, useState } from "react";
import styles from "./custom-file-size.module.css";

import { Utilities } from "../../../assets";

// APIs
import sizeApi from "../../../server-api/size";

// Components
import { AssetOps } from "../../../assets";
import toastUtils from "../../../utils/toast";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import Input from "../inputs/input";
import ConfirmModal from "../modals/confirm-modal";
import SpinnerOverlay from "../spinners/spinner-overlay";

import { customSettings } from "../../../constants/custom-settings";

const CustomFileSizes = () => {
  const [fileSizeList, setFileSizeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(); // Id is pending to delete

  // Get tag list
  const getCustomSizes = async () => {
    // Show loading
    setLoading(true);

    let { data } = await sizeApi.getCustomFileSizes();

    setFileSizeList(data);

    // Hide loading
    setLoading(false);
  };

  // Save updated changes
  const saveChanges = async (index) => {
    try {
      // Show loading
      setLoading(true);

      // Call API to delete tag
      await sizeApi.createCustomSize({ sizes: [fileSizeList[index]] });

      // Edit
      if (fileSizeList[index].id !== null) {
        toastUtils.success("Custom size changes saved");

        // Refresh the list
        getCustomSizes();
      } else {
        // Create the new one
        toastUtils.success("Custom size created successfully");

        // Refresh the list
        getCustomSizes();
      }
    } catch (err) {
      if (err.response?.status === 400)
        toastUtils.error(err.response.data.message);
      else
        toastUtils.error(
          "Could not create custom file size, please try again later."
        );

      // Show loading
      setLoading(false);
    }
  };

  const deleteCustomSize = async (id) => {
    // Hide confirm modal
    setConfirmDeleteModal(false);

    // Show loading
    setLoading(true);

    // Call API to delete custom size
    await sizeApi.deleteCustomSize({ sizeIds: [id] });

    // Refresh the list
    getCustomSizes();
  };

  // On input change
  const onInputChange = (e, name, index) => {
    let currentFieldList = [...fileSizeList];
    currentFieldList[index][name] = e.target.value;
    setFileSizeList(currentFieldList);
  };

  const addNew = () => {
    setFileSizeList(
      fileSizeList.concat([
        {
          id: null,
          name: "",
        },
      ])
    );
  };

  useEffect(() => {
    getCustomSizes();
  }, []);

  return (
    <div className={`${styles['main-wrapper']} ${styles['outer-wrapper']}`}>
      <h3>Custom File Sizes</h3>
      {fileSizeList.map((field, index) => (
          <div className={`${styles['row']} ${styles['custom-setting-border']}`} key={index}>
          
          <div className={styles.form}>
            <div className={styles.field}>
              <div className={styles.field_title}>Custom File Size Name</div>
              <div className={styles.input}>
                <Input
                  onChange={(e) => {
                    onInputChange(e, "name", index);
                  }}
                  value={field.name}
                  placeholder={"Field name"}
                  styleType={"regular-short"}
                  additionalClasses={styles.fileSizeFirst}
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.field_title}>Dimensions</div>
              <div className={styles.input_group}>
                <div className={styles.input}>
                  <label>Width (PX)</label>
                  <Input
                    onChange={(e) => {
                      onInputChange(e, "width", index);
                    }}
                    value={field.width}
                    placeholder={"Width"}
                    additionalClasses={styles.fileSizeSecond}
                    type={"number"}
                    styleType={"regular-short"}
                  />
                </div>

                <div className={styles.input}>
                  <label>Height (PX)</label>
                  <Input
                    onChange={(e) => {
                      onInputChange(e, "height", index);
                    }}
                    value={field.height}
                    placeholder={"Height"}
                    type={"number"}
                    additionalClasses={styles.fileSizethird}
                    styleType={"regular-short"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.button_group}>
            <Button
              className={"container exclude-min-height primary"}
              type={"button"}
              text="Save"
              onClick={() => {
                saveChanges(index);
              }}
              disabled={!field.name || !field.width || !field.height}
            />
            {
              <IconClickable
                additionalClass={styles["action-button"]}
                src={AssetOps.deleteGray}
                tooltipText={"Delete"}
                tooltipId={"Delete"}
                onClick={() => {
                  if (field.id) {
                    setCurrentDeleteId(field.id);
                    setConfirmDeleteModal(true);
                  } else {
                    setFileSizeList(
                      fileSizeList.filter(
                        (item, indexItem) => index !== indexItem
                      )
                    );
                  }
                }}
              />
            }
          </div>
        </div>
      ))}

      {fileSizeList.length <
        customSettings.CUSTOM_FILE_SIZES.MAX_CONFIGURATIONS && (
        <div className={`${styles["row"]} ${styles['custom-setting-border']} ${styles["field-block"]}`}>
          <div className={`add ${styles["select-add"]}`} onClick={addNew}>
            <IconClickable src={Utilities.add} />
            <span className={"font-weight-500"}>Add New</span>
            <span className={"font-12"}>&nbsp; (up to 10 allowed)</span>
          </div>
        </div>
      )}

      <ConfirmModal
        modalIsOpen={confirmDeleteModal}
        closeModal={() => {
          setConfirmDeleteModal(false);
        }}
        confirmAction={() => {
          deleteCustomSize(currentDeleteId);
        }}
        confirmText={"Delete"}
        message={<span>Are you sure you want to delete this custom size?</span>}
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />

      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default CustomFileSizes;
