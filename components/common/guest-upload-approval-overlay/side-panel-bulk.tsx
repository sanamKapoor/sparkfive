import update from "immutability-helper";
import styles from "./side-panel-bulk.module.css";

import { useEffect, useState } from "react";
import assetApi from "../../../server-api/asset";
import attributeApi from "../../../server-api/attribute";
import campaignApi from "../../../server-api/campaign";
import folderApi from "../../../server-api/folder";
import projectApi from "../../../server-api/project";
import tagApi from "../../../server-api/tag";
import toastUtils from "../../../utils/toast";

// Contexts

// Components
import ProductAddition from "../asset/product-addition";
import Button from "../buttons/button";
import CreatableSelect from "../inputs/creatable-select";
import CustomFieldSelector from "../items/custom-field-selector";
import ConfirmModal from "../modals/confirm-modal";
import ProjectCreationModal from "../modals/project-creation-modal";

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
  let rs = [];
  list.map((field) => {
    let value = valueList.filter((valueField) => valueField.id === field.id);

    if (value.length > 0) {
      rs.push(value[0]);
    } else {
      let customField = { ...field };
      customField.values = [];
      rs.push(customField);
    }
  });

  return rs;
};

const SidePanelBulk = ({
  elementsSelected,
  onUpdate,
  assetProjects,
  setAssetProjects,
  assetCampaigns,
  setCampaigns,
  assetTags,
  setTags,
  assetCustomFields,
  setCustomFields,
  assetFolders,
  setFolders,
  originalInputs,
  setLoading,
  loading,
  addMode,
  approvalStatus = "",
}) => {
  const [channel, setChannel] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState("");

  const [inputCampaigns, setInputCampaigns] = useState([]);

  const [inputFolders, setInputFolders] = useState([]);
  const [assetFolder, setAssetFolder] = useState(null);

  const [inputTags, setInputTags] = useState([]);

  const [inputProjects, setInputProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState("");

  const [assetProduct, setAssetProduct] = useState(null);

  const [warningMessage, setWarningMessage] = useState("");

  // Custom fields
  const [inputCustomFields, setInputCustomFields] = useState([]);
  const [activeCustomField, setActiveCustomField] = useState<number>();

  // Guest upload
  const [rejectConfirm, setRejectConfirm] = useState(false);

  useEffect(() => {
    getInputData();
  }, []);

  useEffect(() => {
    if (addMode) {
      setAssetFolder(null);
      setChannel(null);
      setAssetProduct(null);
    }
  }, [addMode, originalInputs]);

  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects();
      const campaignsResponse = await campaignApi.getCampaigns();
      const folderResponse = await folderApi.getFoldersSimple();
      const tagsResponse = await tagApi.getTags();
      const customFieldsResponse = await attributeApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputProjects(projectsResponse.data);
      setInputCampaigns(campaignsResponse.data);
      setInputFolders(folderResponse.data);
      setInputTags(tagsResponse.data);
      setInputCustomFields(customFieldsResponse.data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const handleProjectChange = (selected, actionMeta) => {
    if (
      !selected ||
      assetProjects.findIndex(
        (selectedItem) => selected.label === selectedItem.name
      ) !== -1
    )
      return;
    if (actionMeta.action === "create-option") {
      setNewProjectName(selected.value);
    } else if (selected) {
      setAssetProjects(update(assetProjects, { $push: [selected] }));
    }
    setActiveDropdown("");
  };

  const prepareSave = () => {
    let warningMessage;
    if (addMode) {
      warningMessage = `Any channel, collection, or product added will replace the respective property from the (${elementsSelected.length}) selected assets`;
    } else {
      warningMessage = `Are you sure you want to remove attributes from the (${elementsSelected.length}) selected assets?`;
    }

    // If action is reject, show confirm popup
    if (approvalStatus === "rejected") {
      setRejectConfirm(true);
    } else {
      setWarningMessage(warningMessage);
    }
  };

  // Parse custom field attributes
  const customFieldAttributes = (customFields) => {
    let values = [];
    customFields.map((field) => {
      values = values.concat(field.values);
    });

    return values;
  };

  const saveChanges = async () => {
    try {
      let filters = {};
      setWarningMessage("");
      setLoading(true);
      const mapAttributes = ({ id, name }) => ({ id, name });

      const campaigns = assetCampaigns.map(mapAttributes);
      const projects = assetProjects.map(mapAttributes);
      const tags = assetTags.map(mapAttributes);
      const customs =
        customFieldAttributes(assetCustomFields).map(mapAttributes);
      const folders = assetFolders.map(mapAttributes);
      const updateObject = {
        assetIds: elementsSelected.map(({ asset }) => asset),
        attributes: {},
        status: approvalStatus,
      };

      if (addMode) {
        updateObject.attributes = {
          channel,
          folders,
          campaigns,
          projects,
          tags,
          customs,
          products: [],
        };

        if (assetProduct)
          updateObject.attributes.products = [
            { product: assetProduct, productTags: assetProduct.tags },
          ];
      } else {
        updateObject.attributes = getRemoveAttributes({
          campaigns,
          projects,
          tags,
          customs,
          folders,
        });
      }

      await assetApi.updateMultipleAttributes(updateObject, filters);
      await onUpdate();
      toastUtils.success("Asset edits saved");
    } catch (err) {
      console.log(err);
      toastUtils.error("An error occurred, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const getRemoveAttributes = ({
    campaigns,
    projects,
    tags,
    customs,
    folders,
  }) => {
    const filterFn = (chosenList) => (origItem) =>
      chosenList.findIndex((chosenItem) => chosenItem.id === origItem.id) ===
      -1;
    return {
      removeCampaigns: originalInputs.campaigns.filter(filterFn(campaigns)),
      removeProjects: originalInputs.projects.filter(filterFn(projects)),
      removeTags: originalInputs.tags.filter(filterFn(tags)),
      removeCustoms: customFieldAttributes(originalInputs.customs).filter(
        filterFn(customs)
      ),
      removeFolders: originalInputs.folders.filter(filterFn(folders)),
    };
  };

  return (
    <div className={styles.container}>
      <h2>
        {addMode ? "Add Attributes to" : "Remove Attributes from"} Selected
        Assets
      </h2>
      <section className={styles["first-section"]}>
        <p>{`Editing (${elementsSelected.length}) files`}</p>
      </section>
      <section className={styles["field-wrapper"]}>
        <CreatableSelect
          title="Collections"
          addText="Add to Collection"
          onAddClick={() => setActiveDropdown("collections")}
          selectPlaceholder={"Enter a new collection or select an existing one"}
          avilableItems={inputFolders}
          setAvailableItems={setInputFolders}
          selectedItems={assetFolders}
          setSelectedItems={setFolders}
          onAddOperationFinished={() => setActiveDropdown("")}
          onRemoveOperationFinished={() => null}
          onOperationFailedSkipped={() => setActiveDropdown("")}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === "collections"}
          altColor="yellow"
          isShare={false}
          isBulkEdit={true}
          canAdd={addMode}
        />
      </section>

      <section className={styles["field-wrapper"]}>
        <CreatableSelect
          title="Campaigns"
          addText="Add to Campaign"
          onAddClick={() => setActiveDropdown("campaigns")}
          selectPlaceholder={"Enter a new campaign or select an existing one"}
          avilableItems={inputCampaigns}
          setAvailableItems={setInputCampaigns}
          selectedItems={assetCampaigns}
          setSelectedItems={setCampaigns}
          onAddOperationFinished={() => setActiveDropdown("")}
          onRemoveOperationFinished={() => null}
          onOperationFailedSkipped={() => setActiveDropdown("")}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === "campaigns"}
          altColor="yellow"
          isShare={false}
          isBulkEdit={true}
          canAdd={addMode}
        />
      </section>

      <section className={styles["field-wrapper"]}>
        <CreatableSelect
          title="Tags"
          addText="Add Tags"
          onAddClick={() => setActiveDropdown("tags")}
          selectPlaceholder={"Enter a new tag or select an existing one"}
          avilableItems={inputTags}
          setAvailableItems={setInputTags}
          selectedItems={assetTags}
          setSelectedItems={setTags}
          onAddOperationFinished={() => setActiveDropdown("")}
          onRemoveOperationFinished={() => null}
          onOperationFailedSkipped={() => setActiveDropdown("")}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === "tags"}
          isShare={false}
          isBulkEdit={true}
          canAdd={addMode}
        />
      </section>

      {inputCustomFields.map((field, index) => {
        if (field.type === "selectOne" && addMode) {
          return (
            <section className={styles["field-wrapper"]}>
              <div className={`secondary-text ${styles.field}`}>
                {field.name}
              </div>
              <CustomFieldSelector
                data={assetCustomFields[index]?.values[0]?.name}
                options={field.values}
                isShare={false}
                onLabelClick={() => {}}
                handleFieldChange={(option) => {
                  setCustomFields(index, [option]);
                }}
              />
            </section>
          );
        }

        if (field.type === "selectMultiple") {
          return (
            <section className={styles["field-wrapper"]} key={index}>
              <CreatableSelect
                creatable={false}
                title={field.name}
                addText={`Add ${field.name}`}
                onAddClick={() => setActiveCustomField(index)}
                selectPlaceholder={"Select an existing one"}
                avilableItems={field.values}
                isShare={false}
                setAvailableItems={() => {}}
                selectedItems={
                  assetCustomFields.filter(
                    (assetField) => assetField.id === field.id
                  )[0]?.values || []
                }
                setSelectedItems={(data) => {
                  setActiveCustomField(undefined);
                  setCustomFields(index, data);
                }}
                onAddOperationFinished={(stateUpdate) => {}}
                onRemoveOperationFinished={async (
                  index,
                  stateUpdate,
                  removeId
                ) => {
                  setCustomFields(index, stateUpdate);
                }}
                onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                asyncCreateFn={() => null}
                dropdownIsActive={activeCustomField === index}
                isBulkEdit={true}
                canAdd={addMode}
              />
            </section>
          );
        }
      })}

      {addMode && (
        <section>
          <ProductAddition
            FieldWrapper={({ children }) => (
              <div className={styles["field-wrapper"]}>{children}</div>
            )}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            assetId={null}
            updateAssetState={() => null}
            product={assetProduct}
            isShare={false}
            isBulkEdit={true}
            setAssetProduct={setAssetProduct}
          />
        </section>
      )}

      <ProjectCreationModal
        initialValue={newProjectName}
        closeModal={() => setNewProjectName("")}
        confirmCreation={(project) =>
          handleProjectChange(
            { ...project, label: project.name },
            "create-option"
          )
        }
        modalIsOpen={newProjectName ? true : false}
      />

      <div className={styles["save-changes"]}>
        <Button
          text={"Save Changes"}
          type={"button"}
          styleType={"primary"}
          onClick={prepareSave}
          disabled={elementsSelected.length === 0 || loading}
        />
      </div>

      <ConfirmModal
        confirmAction={saveChanges}
        confirmText={"Save changes"}
        closeModal={() => setWarningMessage("")}
        message={warningMessage}
        modalIsOpen={warningMessage}
      />

      <ConfirmModal
        modalIsOpen={rejectConfirm}
        closeModal={() => setRejectConfirm(false)}
        confirmAction={saveChanges}
        confirmText={"Reject"}
        message={`Are you sure you want to reject ${elementsSelected.length} asset(s)?`}
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />
    </div>
  );
};

export default SidePanelBulk;
