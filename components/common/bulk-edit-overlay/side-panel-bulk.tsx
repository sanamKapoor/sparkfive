import update from "immutability-helper";
import styles from "./side-panel-bulk.module.css";

import { useContext, useEffect, useState } from "react";
import { Utilities } from "../../../assets";
import assetApi from "../../../server-api/asset";
import attributeApi from "../../../server-api/attribute";
import campaignApi from "../../../server-api/campaign";
import folderApi from "../../../server-api/folder";
import projectApi from "../../../server-api/project";
import tagApi from "../../../server-api/tag";
import toastUtils from "../../../utils/toast";

// Contexts
import { AssetContext, UserContext } from "../../../context";

// Components
import ProductAddition from "../asset/product-addition";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import CreatableSelect from "../inputs/creatable-select";
import CustomFieldSelector from "../items/custom-field-selector";
import ConfirmModal from "../modals/confirm-modal";
import ProjectCreationModal from "../modals/project-creation-modal";
import SearchModal from "../../SearchModal/Search-modal";
import Search from "../../main/user-settings/SuperAdmin/Search/Search";

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const data = [
  {
    folderName: "Architecture",
    subfolders: [
      {
        name: "City",
      },
      {
        name: "Renaissance",
      },
      {
        name: "Interior",
      },
      {
        name: "House",
      },
    ],
  },
  {
    folderName: "Portraits",
    subfolders: [],
  },
  {
    folderName: "Nature",
    subfolders: [],
  },
  {
    folderName: "Events",
    subfolders: [],
  },
];
const tagData = ["Data1", "Data2", "Data3","Data1",];

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
  assetFolders,
  setCustomFields,
  setFolders,
  originalInputs,
  setLoading,
  loading,
  addMode,
}) => {
  const { activeFolder } = useContext(AssetContext);

  const { advancedConfig } = useContext(UserContext);
  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);

  const [channel, setChannel] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState("");

  const [inputCampaigns, setInputCampaigns] = useState([]);

  const [inputFolders, setInputFolders] = useState([]);
  const [assetFolder, setAssetFolder] = useState(null);

  const [inputTags, setInputTags] = useState([]);

  const [inputProjects, setInputProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState("");

  const [assetProduct, setAssetProduct] = useState(null);
  const [assetProducts, setAssetProducts] = useState([]);

  const [warningMessage, setWarningMessage] = useState("");

  // Custom fields
  const [inputCustomFields, setInputCustomFields] = useState([]);
  const [activeCustomField, setActiveCustomField] = useState<number>();

  useEffect(() => {
    getInputData();
  }, []);

  useEffect(() => {
    if (addMode) {
      setAssetFolder(null);
      setChannel(null);
      setAssetProduct(null);
      setAssetProducts([]);
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
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (index: any) => {
    if (selectedItem === index) {
      setSelectedItem(null);
    } else {
      setSelectedItem(index);
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
    setWarningMessage(warningMessage);
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

        if (assetProducts.length > 0)
          updateObject.attributes.products = assetProducts
            .map((item) => {
              if (item) {
                return { product: item, productTags: item.tags };
              } else {
                return null;
              }
            })
            .filter((item) => item !== null);
      } else {
        updateObject.attributes = getRemoveAttributes({
          campaigns,
          projects,
          tags,
          customs,
          folders,
        });
      }

      updateObject.activeFolder = activeFolder;

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

  const addProductBlock = () => {
    setAssetProducts([...assetProducts, null]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
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
            selectPlaceholder={
              "Enter a new collection or select an existing one"
            }
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
          <div className={`${styles["tag-container-wrapper"]}`}>
            {tagData.map((dataItem, index) => (
              <div className={`${styles["tag-container"]}`} key={index}>
                <span>{dataItem}</span>
                <IconClickable
                  additionalClass={styles.remove}
                  src={Utilities.closeTag}
                />
              </div>
            ))}
          </div>
          <div className={`${styles["edit-bulk-outer-wrapper"]}`}>
            <div className={`${styles["search-btn"]}`}>
              <form
                className={styles.search}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className={styles.searchinput}>
                  <input type="text" placeholder={"Search"} name="search2" />
                </div>
                <div className={styles.searchbtn}>
                  <img className={styles.image} src={Utilities.search} />
                </div>
              </form>
            </div>
            <div className={`${styles["modal-heading"]}`}>
              <span>Collection(21)</span>
            </div>
            <div>
              {data.map((folder, index) => (
                <div key={index}>
                  <div className={`${styles["flex"]} ${styles.nestedbox}`}>
                    <img
                      className={styles.rightIcon}
                      src={Utilities.arrowBlue}
                      alt="Right Arrow Icon"
                    />
                    <div className={styles.w100}>
                      <div
                        className={`${styles["dropdownMenu"]} ${
                          selectedItem === index ? styles["active"] : ""
                        }`}
                        onClick={() => handleItemClick(index)}
                      >
                        <div className={styles.flex}>
                          <img src={Utilities.folder} alt="Folder Icon" />
                          <div className={styles["icon-descriptions"]}>
                            <span>{folder.folderName}</span>
                          </div>
                        </div>
                        <div>
                          <div className={styles["list1-right-contents"]}>
                            {selectedItem === index && (
                              <img src={Utilities.checkBlue} alt="Check Icon" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.folder}>
                    <div className={styles.subfolderList}>
                      {folder.subfolders.map((subfolder, subIndex) => (
                        <div key={subIndex} className={styles.dropdownOptions}>
                          <div className={styles["folder-lists"]}>
                            <div className={styles.dropdownIcons}>
                              <img
                                className={styles.subfolder}
                                src={Utilities.folder}
                                alt="Folder Icon"
                              />
                              <div className={styles["icon-descriptions"]}>
                                <span>{subfolder.name}</span>
                              </div>
                            </div>
                            <div className={styles["list1-right-contents"]}>
                              {selectedItem === index && <span></span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles["modal-btns"]}>
              <Button
                className="container primary main-modal-btn"
                text="Add to collection"
              ></Button>
              <Button className="container secondary" text="Cancel"></Button>
            </div>
          </div>
        </section>

        {!hideFilterElements.campaigns && (
          <section className={styles["field-wrapper"]}>
            <CreatableSelect
              title="Campaigns"
              addText="Add to Campaign"
              onAddClick={() => setActiveDropdown("campaigns")}
              selectPlaceholder={
                "Enter a new campaign or select an existing one"
              }
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
        )}

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
                  onOperationFailedSkipped={() =>
                    setActiveCustomField(undefined)
                  }
                  asyncCreateFn={() => null}
                  dropdownIsActive={activeCustomField === index}
                  isBulkEdit={true}
                  canAdd={addMode}
                />
              </section>
            );
          }
        })}

        {addMode && !hideFilterElements.products && (
          <section>
            <div className={styles["field-wrapper"]}>
              <div className={`secondary-text ${styles.field}`}>Products</div>
            </div>

            {assetProducts.map((product, index) => {
              return (
                <div className={styles["product-wrapper"]} key={index}>
                  <ProductAddition
                    noTitle
                    className={styles["productPlus"]}
                    skuActiveDropdownValue={`sku-${index}`}
                    productFieldActiveDropdownValue={`product_field-${index}`}
                    productVendorActiveDropdownValue={`product_vendor-${index}`}
                    productCategoryActiveDropdownValue={`product_category-${index}`}
                    productRetailerActiveDropdownValue={`product_retailer-${index}`}
                    FieldWrapper={({ children }) => (
                      <div className={styles["productPlus"]}>{children}</div>
                    )}
                    isShare={false}
                    activeDropdown={activeDropdown}
                    setActiveDropdown={(value) => {
                      console.log(value);
                      setActiveDropdown(`${value}-${index}`);
                    }}
                    assetId={null}
                    updateAssetState={() => null}
                    product={product}
                    isBulkEdit={true}
                    setAssetProduct={(data) => {
                      setAssetProducts(
                        update(assetProducts, {
                          [index]: { $set: data },
                        })
                      );
                    }}
                  />
                </div>
              );
            })}
            <div
              className={`add ${styles["select-add"]}`}
              onClick={addProductBlock}
            >
              <IconClickable src={Utilities.add} />
              <span className={"normal-text"}>Add Product</span>
            </div>
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
      </div>

      <div className={styles["save-changes"]}>
        <Button
          text={"Save Changes"}
          type={"button"}
          className={"container primary"}
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
    </div>
  );
};

export default SidePanelBulk;
