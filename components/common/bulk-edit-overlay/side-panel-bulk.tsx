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
import { ASSET_EDIT } from "../../../constants/permissions";

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
import { useMoveModal } from "../../../hooks/use-modal";
interface Asset {
  id: string;
  name: string;
  type: string;
  thumbailUrl: string;
  realUrl: string;
  extension: string;
  version: number;
}
interface Item {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sharePath: null;
  sharePassword: null;
  shareStatus: null;
  status: string;
  thumbnailPath: null;
  thumbnailExtension: null;
  thumbnails: null;
  thumbnailStorageId: null;
  thumbnailName: null;
  assetsCount: string;
  assets: Asset[];
  size: string;
  length: number;
  parentId: string | null
}
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
  assetFolders,
  setCustomFields,
  setFolders,
  originalInputs,
  setLoading,
  loading,
  addMode,
}) => {
  const { activeFolder } = useContext(AssetContext);
  const { advancedConfig, hasPermission } = useContext(UserContext);
  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);
  const [channel, setChannel] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState("");

  const [inputCampaigns, setInputCampaigns] = useState([]);

  const [inputTags, setInputTags] = useState([]);

  const [inputProjects, setInputProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState("");

  const [assetProduct, setAssetProduct] = useState(null);
  const [assetProducts, setAssetProducts] = useState([]);

  const [warningMessage, setWarningMessage] = useState("");

  // Custom fields
  const [inputCustomFields, setInputCustomFields] = useState([]);
  const [activeCustomField, setActiveCustomField] = useState<number>();

  // custom logic for the select forlders child lists
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
    completeSelectedFolder
  } = useMoveModal();

  useEffect(() => {
    if (!addMode) {
      completeSelectedFolder.clear()
      assetFolders?.map(({ id, name, parentId, ...rest }: Item) => {
        completeSelectedFolder.set(id, { name, parentId: parentId || null })
      })
    } else {
      completeSelectedFolder.clear()
      setSelectedFolder([]);
      setShowDropdown([]);
      setSubFolderLoadingState(new Map());
      setFolderChildList(new Map())
      setSelectAllFolders({})
      setInput("")
      setActiveDropdown("")
    }
  }, [addMode]);

  const keyExists = (key: string) => {
    return folderChildList.has(key);
  };

  const keyResultsFetch = (key: string, type: string): Item[] | number => {
    const { results, next } = folderChildList.get(key);
    if (type === 'record') {
      return results || []
    }
    return next
  };

  useEffect(() => {
    getInputData();
    getFolders();
    return () => {
      setSelectedFolder([]);
      setShowDropdown([]);
      setSubFolderLoadingState(new Map());
      setFolderChildList(new Map())
      setSelectAllFolders({})
      setInput("")
      completeSelectedFolder.clear();
    };
  }, []);

  useEffect(() => {
    if (addMode) {
      setChannel(null);
      setAssetProduct(null);
      setAssetProducts([]);
    }
  }, [addMode, originalInputs]);

  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects();
      const campaignsResponse = await campaignApi.getCampaigns();
      const tagsResponse = await tagApi.getTags();
      const customFieldsResponse = await attributeApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputProjects(projectsResponse.data);
      setInputCampaigns(campaignsResponse.data);
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
      const assetFolders = [...completeSelectedFolder.entries()].map(([key, value], index) => {
        return {
          id: key,
          name: value.name
        }
      })
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
          {<div className={`${styles["tag-container-wrapper"]}`}>
            {
              [...completeSelectedFolder.entries()].map(([key, value], index) => (
                <div className={`${styles["tag-container"]}`} key={index}>
                  <span>{value.name}</span>
                  <IconClickable
                    additionalClass={styles.remove}
                    src={Utilities.closeTag}
                    onClick={() => toggleSelected(key, addMode ? !selectedFolder.includes(key) : false, false, "", value.name)}
                  />
                </div>
              ))
            }
          </div>}
          {(addMode && hasPermission([ASSET_EDIT])) && (activeDropdown === "" || activeDropdown !== "collections") && (
            <>
              <div className={`${styles['top-heading']}`}>
                <span>Collection</span>

              </div>
              <div
                className={`add ${styles["select-add"]}`}
                onClick={() => setActiveDropdown("collections")}
              >
                <IconClickable src={Utilities.addLight} />
                <span>{"Add to Collection"}</span>
              </div>
            </>

          )}
          {
            (addMode && hasPermission([ASSET_EDIT]) && activeDropdown === "collections") &&
            <div className={`${styles["edit-bulk-outer-wrapper"]}`}>
              <div className={`${styles["close-popup"]}`}> <IconClickable
                additionalClass={styles.remove}
                src={Utilities.closeTag}
                onClick={() => setActiveDropdown("")}
              /></div>
              <div className={`${styles["search-btn"]}`}>
                <SearchModal filteredData={filteredData} input={input} setInput={setInput} />
              </div>
              <div className={`${styles["modal-heading"]}`}>
                <span>Collection({folders.length ?? ""})</span>
              </div>
              <div className={`${styles["outer-wrapper"]}`}>
                {folders.map((folder, index) => (
                  <div key={index}>
                    <div className={`${styles["flex"]} ${styles.nestedbox}`}>
                      <div className={`${styles["height"]} ${styles["flex"]}`}
                        onClick={() => { toggleDropdown(folder.id, true) }}
                      >
                        <img
                          className={showDropdown.includes(folder.id) ? styles.iconClick : styles.rightIcon}
                          src={Utilities.arrowBlue}
                          alt="Right Arrow Icon"
                          onClick={() => { toggleDropdown(folder.id, true) }}
                        />
                      </div>

                      <div className={styles.w100}>
                        <div
                          className={`${styles["dropdownMenu"]} ${selectedFolder.includes(folder.id) ?
                            styles["active"]
                            : ""
                            }`}
                        >
                          <div className={styles.flex}>
                            <div
                              className={`${styles.circle} ${selectedFolder.includes(folder.id) ?
                                styles.checked
                                : ""
                                }`}
                              onClick={() => toggleSelected(folder.id, !selectedFolder.includes(folder.id), false, "", folder.name)}
                            >
                              {
                                selectedFolder.includes(folder.id) &&
                                <img src={Utilities.checkIcon} />
                              }
                            </div>
                            <div className={styles["icon-descriptions"]} title={folder.name}>
                              <span>{folder.name}</span>
                            </div>
                          </div>
                          <div>
                            <div className={styles["list1-right-contents"]}>
                              {
                                selectAllFolders[folder.id] ?
                                  <div style={{ cursor: "pointer" }} onClick={() => toggleSelectAllChildList(folder.id, folder.name)} className={`${styles['deselect-all']}`}>
                                    <img
                                      src={Utilities.redCheck} alt="Check Icon" />
                                    <span className={styles.deselectText}>Deselect All</span>
                                  </div>
                                  :
                                  <div style={{ cursor: "pointer" }} onClick={() => toggleSelectAllChildList(folder.id, folder.name)} className={`${styles['select-all']}`}>
                                    <img src={Utilities.doubleCheck} alt="Check Icon" />
                                    <span className={styles.selectText}>Select All</span>
                                  </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {showDropdown.includes(folder.id) && <div className={styles.folder}>
                      <div className={styles.subfolderList}>
                        {
                          keyExists(folder.id) && (keyResultsFetch(folder.id, "record") as Item[]).map(({ id, name, parentId, ...rest }) => (
                            <>
                              <div
                                key={id}
                                className={styles.dropdownOptions}
                                onClick={() => toggleSelected(id, !selectedFolder.includes(id), true, folder.id, name, parentId)}>
                                <div className={styles["folder-lists"]}>
                                  <div className={styles.dropdownIcons}>
                                    <div
                                      className={`${styles.circle} ${selectedFolder.includes(id) ? styles.checked : ""
                                        }`}>
                                      {selectedFolder.includes(id) && <img src={Utilities.checkIcon} />}
                                    </div>
                                    <div className={styles["icon-descriptions"]} title={folder.name}>
                                      <span>{name}</span>
                                    </div>
                                  </div>
                                  <div className={styles["list1-right-contents"]}>
                                    {selectedFolder.includes(id) && <span></span>}
                                  </div>
                                </div>
                              </div>
                            </>
                          ))
                        }
                        {(keyExists(folder.id) && (keyResultsFetch(folder.id, "next") as number) >= 0) && <div className={`${styles['outer-load-wrapper']}`}><div className={`${styles['load-wrapper']}`}
                          onClick={() => { getSubFolders(folder.id, (keyResultsFetch(folder.id, "next") as number), false) }}>
                          <IconClickable additionalClass={styles.loadIcon} src={Utilities.load} />
                          <button className={styles.loadMore}>{
                            subFolderLoadingState.get(folder.id)
                              ?
                              "Loading..."
                              :
                              "Load More"
                          }</button>
                        </div>
                        </div>
                        }
                      </div>
                    </div>
                    }
                  </div>
                ))}
              </div>
              <div className={styles["modal-btns"]}>
                <Button className="container secondary bulk-edit-btn" text="Close" onClick={() => setActiveDropdown("")}
                ></Button>
              </div>
            </div>
          }
        </section >

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

        {
          inputCustomFields.map((field, index) => {
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
                    onLabelClick={() => { }}
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
                    setAvailableItems={() => { }}
                    selectedItems={
                      assetCustomFields.filter(
                        (assetField) => assetField.id === field.id
                      )[0]?.values || []
                    }
                    setSelectedItems={(data) => {
                      setActiveCustomField(undefined);
                      setCustomFields(index, data);
                    }}
                    onAddOperationFinished={(stateUpdate) => { }}
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
          })
        }

        {
          addMode && !hideFilterElements.products && (
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
          )
        }

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
      </div >

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
    </div >
  );
};

export default SidePanelBulk;
