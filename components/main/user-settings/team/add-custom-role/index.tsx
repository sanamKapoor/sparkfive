import update from "immutability-helper";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

import Button from "../../../../common/buttons/button";
import Input from "../../../../common/inputs/input";

import CreatableSelect from "../../../../common/inputs/creatable-select";

// Contexts
import CustomFieldSelector from "../../../../common/items/custom-field-selector";

import React from "react";
import { useMoveModal } from "../../../../../hooks/use-modal";
import customFieldsApi from "../../../../../server-api/attribute";
import permissionApi from "../../../../../server-api/permission";
import teamApi from "../../../../../server-api/team";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
import CollectionSubcollectionListing from "../../../collection-subcollection-listing";
import MemberPermissions from "../members/team-members/member-permissions";

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
  let rs = [];
  list.map((field) => {
    let value = valueList.filter((valueField) => valueField.id === field.id);

    if (value.length > 0) {
      field.required = value[0].required;
      rs.push(value[0]);
    } else {
      let customField = { ...field };
      customField.required = true; // Default is true
      customField.values = [];
      rs.push(customField);
    }
  });

  return rs;
};

interface AddCustomRoleProps {
  onSave: () => void;
  role: string;
}

const AddCustomRole: React.FC<AddCustomRoleProps> = ({ onSave, role }) => {
  const [mode, setMode] = useState("customRestriction"); // Available options: customRestriction, permission
  const [activeDropdown, setActiveDropdown] = useState("");

  const [name, setName] = useState("");

  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollection] = useState([]);

  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const [activeCustomField, setActiveCustomField] = useState<number>();
  const [inputCustomFields, setInputCustomFields] = useState([]);
  const [assetCustomFields, setAssetCustomFields] = useState(
    mappingCustomFieldData(inputCustomFields, [])
  );

  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [loading, setLoading] = useState(true);

  const {
    folders,
    selectedFolder,
    subFolderLoadingState,
    folderChildList,
    showDropdown,
    selectAllFolders,
    input,
    setInput,
    filteredData,
    getFolders,
    getSubFolders,
    toggleSelected,
    toggleDropdown,
    toggleSelectAllChildList,
    setSelectedFolder,
    setShowDropdown,
    setSubFolderLoadingState,
    setFolderChildList,
    setSelectAllFolders,
    completeSelectedFolder,
  } = useMoveModal();

  const getCustomFieldsInputData = async () => {
    try {
      const { data } = await customFieldsApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputCustomFields(data);

      return data;
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  // On change custom fields (add/remove)
  const onChangeCustomField = (index, data) => {
    // Hide select list
    setActiveCustomField(undefined);

    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: data },
        },
      })
    );
  };

  // On custom field select one changes
  const onChangeSelectOneCustomField = async (selected, index) => {
    // Hide select list
    setActiveCustomField(undefined);

    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: [selected] },
        },
      })
    );
  };

  // const getFolders = async () => {
  //   const { data } = await folderApi.getFoldersSimple();
  //   setCollections(data);
  //   return data;
  // };

  const getPermissions = async () => {
    try {
      const { data } = await permissionApi.getPermissions();
      setPermissions(data);

      // In default, all permission will be selected
      setSelectedPermissions(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const getDefaultValue = async (inputCustomFields) => {
    if (role) {
      const { data } = await teamApi.getRoleDetail(role);
      const originalSelectedFolders = data.folders?.map(
        ({ id, name, parentId, ...rest }: Item) => {
          completeSelectedFolder.set(id, { name, parentId: parentId || null });
          return id;
        }
      );
      setSelectedFolder((prev) => [...prev, ...originalSelectedFolders]);

      // setSelectedCollection(data.folders);
      setSelectedCampaigns(data.campaigns);
      setSelectedPermissions(data.permissions);
      setName(data.name);

      const updatedMappingCustomFieldData = mappingCustomFieldData(
        inputCustomFields,
        data.customs
      );

      setAssetCustomFields(
        update(assetCustomFields, {
          $set: updatedMappingCustomFieldData,
        })
      );
    } else {
    }
  };

  const getAll = async () => {
    const [folderData, permissionData, inputCustomFieldsData] =
      await Promise.all([
        getFolders(),
        getPermissions(),
        getCustomFieldsInputData(),
      ]);
    await getDefaultValue(inputCustomFieldsData);
    setLoading(false);
  };

  const onSubmit = async () => {
    setLoading(true);
    let customFieldValueIds = [];

    assetCustomFields.map((field) => {
      customFieldValueIds = customFieldValueIds.concat(
        field.values.map((value) => value.id)
      );
    });

    const selectedRoleFolders = [...completeSelectedFolder.entries()].map(
      ([key, value], index) => {
        return key;
      }
    );
    // Update
    if (role) {
      await teamApi.editRole(role, {
        name,
        collections: selectedRoleFolders,
        campaigns: selectedCampaigns.map((campaign) => campaign.id),
        customFieldValues: customFieldValueIds,
        permissions: selectedPermissions.map((permission) => permission.id),
        configs: { andMainField: false, andCustomAttribute: false },
      });
    } else {
      // Create new one
      await teamApi.createCustomRole({
        name,
        collections: selectedRoleFolders,
        campaigns: selectedCampaigns.map((campaign) => campaign.id),
        customFieldValues: customFieldValueIds,
        permissions: selectedPermissions.map((permission) => permission.id),
        configs: { andMainField: false, andCustomAttribute: false },
      });
    }

    setLoading(false);

    onSave();
  };

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (inputCustomFields.length > 0) {
      const updatedMappingCustomFieldData = mappingCustomFieldData(
        inputCustomFields,
        []
      );

      setAssetCustomFields(
        update(assetCustomFields, {
          $set: updatedMappingCustomFieldData,
        })
      );
    }
  }, [inputCustomFields]);

  const onCancel = () => {
    onSave();
  };

  return (
    <>
      <div className={styles.content}>
        <h4>Role Name</h4>

        <div className={styles.form}>
          <div className={styles.roleInput}>
            <Input
              name={"name"}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder={"Role name"}
              type={"text"}
              styleType={"regular-short"}
              additionalClasses={styles.RoleInputField}
            />
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>
      <div className={styles.content}>
        <div className={styles["nav-buttons"]}>
          <div
            className={`${styles["nav-button"]} ${mode === "customRestriction" ? styles.active : ""
              }`}
            onClick={() => setMode("customRestriction")}
          >
            Content Restrictions
          </div>
          <div
            className={`${styles["nav-button"]} ${mode === "permission" ? styles.active : ""
              }`}
            onClick={() => setMode("permission")}
          >
            Action Permissions
          </div>
        </div>
        {mode === "customRestriction" && (
          <div>
            <span className={styles["field-title"]}>Collections</span>
            <div className={`${styles["field-wrapper"]}`}>
              <CollectionSubcollectionListing
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                folders={folders}
                selectedFolder={selectedFolder}
                subFolderLoadingState={subFolderLoadingState}
                folderChildList={folderChildList}
                showDropdown={showDropdown}
                selectAllFolders={selectAllFolders}
                input={input}
                setInput={setInput}
                filteredData={filteredData}
                getFolders={getFolders}
                getSubFolders={getSubFolders}
                toggleSelected={toggleSelected}
                toggleDropdown={toggleDropdown}
                toggleSelectAllChildList={toggleSelectAllChildList}
                completeSelectedFolder={completeSelectedFolder}
              />
            </div>

            <span className={styles["field-title"]}>Custom Fields</span>
            <div className={`${styles["custom-field-wrapper"]}`}>
              {inputCustomFields.map((field, index) => {
                if (field.type === "selectOne") {
                  return (
                    <div className={styles["custom-field-row"]}>
                      <div className={`secondary-text ${styles.field}`}>
                        {field.name}
                      </div>
                      <CustomFieldSelector
                        data={assetCustomFields[index]?.values[0]?.name}
                        options={field.values}
                        isShare={false}
                        onLabelClick={() => { }}
                        handleFieldChange={(option) => {
                          onChangeSelectOneCustomField(option, index);
                        }}
                      />
                    </div>
                  );
                }

                if (field.type === "selectMultiple") {
                  return (
                    <div className={styles["custom-field-row"]} key={index}>
                      <CreatableSelect
                        altColor="blue"
                        creatable={false}
                        title={field.name}
                        addText={`Add ${field.name}`}
                        onAddClick={() => setActiveCustomField(index)}
                        selectPlaceholder={"Select an existing one"}
                        avilableItems={field.values}
                        setAvailableItems={() => { }}
                        selectedItems={
                          assetCustomFields.filter(
                            (assetField) => assetField.id === field.id
                          )[0]?.values || []
                        }
                        setSelectedItems={(data) => {
                          onChangeCustomField(index, data);
                        }}
                        onAddOperationFinished={(stateUpdate) => { }}
                        onRemoveOperationFinished={async (
                          index,
                          stateUpdate,
                          removeId
                        ) => { }}
                        onOperationFailedSkipped={() =>
                          setActiveCustomField(undefined)
                        }
                        isShare={false}
                        asyncCreateFn={(newItem) => {
                          // Show loading
                          return true;
                        }}
                        dropdownIsActive={activeCustomField === index}
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div className={`${styles["role-save-btn"]}`}>
              <Button
                type={"button"}
                text="Save"
                className="container primary"
                onClick={onSubmit}
                disabled={!name}
              />
            </div>
          </div>
        )}

        {mode === "permission" && (
          <>
            <MemberPermissions
              memberPermissions={selectedPermissions}
              listOnly={true}
              permissions={permissions}
              setMemberPermissions={setSelectedPermissions}
            />
            <div className={styles["buttons-wrapper"]}>
              <Button
                type={"button"}
                text="Save Changes"
                className="container primary"
                onClick={onSubmit}
                disabled={!name}
              />
              <Button
                type={"button"}
                text="Cancel"
                className="container secondary"
                onClick={onCancel}
              />
            </div>
          </>
        )}

        {loading && <SpinnerOverlay />}
      </div>
    </>
  );
};

export default AddCustomRole;
