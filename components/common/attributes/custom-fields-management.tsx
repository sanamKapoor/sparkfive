import { useEffect, useState } from "react";
import styles from "./custom-fields-management.module.css";

// Components
import CreatableSelect from "../inputs/creatable-select";
import Tag from "../misc/tag";

// APIs
import customFieldsApi from "../../../server-api/attribute";
import Button from "../buttons/button";
import Input from "../inputs/input";
import ConfirmModal from "../modals/confirm-modal";
import SpinnerOverlay from "../spinners/spinner-overlay";
import OptionList from "./option-list";

// Utils
import { AssetOps } from "../../../assets";
import { defaultCustomFields, type } from "../../../config/data/attributes";
import { maximumCustomFields } from "../../../constants/attributes";
import toastUtils from "../../../utils/toast";
import IconClickable from "../buttons/icon-clickable";

const CustomFieldsManagement = () => {
  const [activeDropdown, setActiveDropdown] = useState<number>(undefined);
  const [customFieldList, setCustomFieldList] = useState(defaultCustomFields);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(); // Id is pending to delete

  // Create the new tag
  const createValue = async (index, item) => {
    let currentFieldList = [...customFieldList];
    currentFieldList[index].values.push({
      name: item.name,
    });
    setCustomFieldList(currentFieldList);
  };

  // Get tag list
  const getCustomFields = async () => {
    // Show loading
    setLoading(true);

    let { data } = await customFieldsApi.getCustomFields({
      isAll: 1,
      sort: "createdAt,asc",
    });

    if (data.length > 0) {
      // There still be available fields to create
      if (data.length < maximumCustomFields) {
        const dataLength = data.length;
        // Add it
        for (let i = 0; i < maximumCustomFields - dataLength; i++) {
          data.push({
            id: null,
            name: "",
            type: "selectOne",
            values: [],
          });
        }
      }

      setCustomFieldList(data);
    } else {
      setCustomFieldList(defaultCustomFields);
    }

    // Hide loading
    setLoading(false);
  };

  const deleteValue = async (customFieldIndex, valueIndex) => {
    let currentFieldList = [...customFieldList];
    currentFieldList[customFieldIndex].values.splice(valueIndex, 1);
    setCustomFieldList(currentFieldList);
  };

  // Save updated changes
  const saveChanges = async (index) => {
    try {
      // Show loading
      setLoading(true);

      // Call API to delete tag
      await customFieldsApi.createCustomField({
        attributes: [customFieldList[index]],
      });

      toastUtils.success("Custom field changes saved");

      // Refresh the list
      getCustomFields();
    } catch (err) {
      if (err.response?.status === 400)
        toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not create tag, please try again later.");

      // Show loading
      setLoading(false);
    }
  };

  const deleteCustomAttribute = async (id) => {
    // Hide confirm modal
    setConfirmDeleteModal(false);

    // Show loading
    setLoading(true);

    // Call API to delete tag
    await customFieldsApi.deleteCustomField({ attributeIds: [id] });

    // Refresh the list
    getCustomFields();
  };

  // On input change
  const onInputChange = (e, index) => {
    let currentFieldList = [...customFieldList];
    currentFieldList[index].name = e.target.value;
    setCustomFieldList(currentFieldList);
  };

  // On select option change
  const onSelectChange = (value, index) => {
    let currentFieldList = [...customFieldList];
    currentFieldList[index].type = value;
    setCustomFieldList(currentFieldList);
  };

  useEffect(() => {
    getCustomFields();
  }, []);

  return (
    <div className={styles["main-wrapper"]}>
      <h3>Custom Fields</h3>
      {customFieldList.map((field, index) => {
        return (
          <div
            className={`${styles["row"]} ${styles["field-block"]}`}
            key={index}
          >
            <div className={`${styles["col-25"]} ${styles["col-md-100"]}`}>
              <div className={styles["row"]}>
                <div
                  className={`${styles["col-100"]} ${styles["flex-display"]}`}
                >
                  <span className={styles["font-weight-600"]}>
                    {index + 1}.
                  </span>
                  <span className={`${styles["row-header"]}`}>
                    Custom Field
                  </span>
                </div>
                <div className={`${styles["col-100"]}`}>
                  <Input
                    onChange={(e) => {
                      onInputChange(e, index);
                    }}
                    value={field.name}
                    placeholder={"Field name"}
                    styleType={"regular-short"}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${styles["col-35"]} ${styles["col-md-100"]} ${styles["p-l-30"]}`}
            >
              <div className={styles["row"]}>
                <div
                  className={`${styles["col-100"]} ${styles["flex-display"]}`}
                >
                  <span className={`${styles["row-header"]}`}>
                    Custom Values
                  </span>
                </div>
                <div className={`${styles["col-100"]}`}>
                  <ul className={styles["tag-wrapper"]}>
                    {field.values.map((tag, valueIndex) => (
                      <li key={valueIndex} className={styles["tag-item"]}>
                        <Tag
                          altColor="blue"
                          tag={<span>{tag.name}</span>}
                          data={tag}
                          type="custom-fields"
                          canRemove={true}
                          editFunction={() => {}}
                          removeFunction={() => {
                            deleteValue(index, valueIndex);
                          }}
                        />
                      </li>
                    ))}
                  </ul>

                  <CreatableSelect
                    title=""
                    addText="Add New Values"
                    onAddClick={() => setActiveDropdown(index)}
                    selectPlaceholder={"Enter a new value"}
                    avilableItems={[]}
                    setAvailableItems={() => {}}
                    selectedItems={[]}
                    setSelectedItems={() => {}}
                    onAddOperationFinished={() => {}}
                    onRemoveOperationFinished={() => {}}
                    onOperationFailedSkipped={() =>
                      setActiveDropdown(undefined)
                    }
                    isShare={false}
                    asyncCreateFn={(item) => {
                      createValue(index, item);
                    }}
                    dropdownIsActive={activeDropdown === index}
                    selectClass={styles["tag-select"]}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${styles["col-25"]} ${styles["col-md-100"]} ${styles["p-l-30"]}`}
            >
              <div className={styles["row"]}>
                <div className={`${styles["col-100"]}`}>
                  <span className={styles["row-header"]}>Type</span>
                </div>
                <div className={`${styles["col-100"]}`}>
                  <OptionList
                    data={type}
                    oneColumn={true}
                    value={field.type}
                    setValue={(value) => {
                      onSelectChange(value, index);
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${styles["col-15"]} ${styles["col-md-100"]} ${styles["button-row"]} ${styles["p-l-30"]}`}
            >
              <Button
                className={"container exclude-min-height primary"}
                type={"button"}
                text="Save"
                onClick={() => {
                  saveChanges(index);
                }}
                disabled={!field.name}
              />
              {field.id && (
                <IconClickable
                  additionalClass={styles["action-button"]}
                  src={AssetOps[`delete`]}
                  tooltipText={"Delete"}
                  tooltipId={"Delete"}
                  onClick={() => {
                    setCurrentDeleteId(field.id);
                    setConfirmDeleteModal(true);
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      <ConfirmModal
        modalIsOpen={confirmDeleteModal}
        closeModal={() => {
          setConfirmDeleteModal(false);
        }}
        confirmAction={() => {
          deleteCustomAttribute(currentDeleteId);
        }}
        confirmText={"Delete"}
        message={
          <span>
            This custom field will be deleted and removed from any file that has
            it.&nbsp; Are you sure you want to delete this?
          </span>
        }
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />

      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default CustomFieldsManagement;
