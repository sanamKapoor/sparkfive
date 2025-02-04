// External
import { format } from "date-fns";
import filesize from "filesize";
import update from "immutability-helper";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import React from "react";

import { Utilities } from "../../../assets";
import { ASSET_EDIT, CALENDAR_ACCESS } from "../../../constants/permissions";
import { AssetContext, FilterContext, LoadingContext, UserContext } from "../../../context";
import { useAssetDetailCollecion } from "../../../hooks/use-asset-detail-collection";
import channelSocialOptions from "../../../resources/data/channels-social.json";
import assetApi from "../../../server-api/asset";
import customFieldsApi from "../../../server-api/attribute";
import campaignApi from "../../../server-api/campaign";
import projectApi from "../../../server-api/project";
import tagApi from "../../../server-api/tag";
import { getParsedExtension } from "../../../utils/asset";
import SearchModal from "../../SearchModal/Search-modal";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import CreatableSelect from "../inputs/creatable-select";
import CustomFieldSelector from "../items/custom-field-selector";
import ProjectCreationModal from "../modals/project-creation-modal";
import styles from "./detail-side-panel.module.css";
import ProductAddition from "./product-addition";
import RecognitionUser from "./recognition-user";

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
  parentId: string | null;
}

const sort = (data) => {
  return _.orderBy(data, [(item) => (item.name || "")?.toLowerCase()], ["asc"]);
};

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
  let rs = [];
  list.map((field) => {
    let value = valueList.filter((valueField) => valueField.id === field.id);
    if (value.length > 0) {
      value[0].values = sort(value[0].values);
      rs.push(value[0]);
    } else {
      let customField = { ...field };
      customField.values = [];
      rs.push(customField);
    }
  });
  return rs;
};

const FolderSidePanel = ({ asset, updateAsset, setAssetDetail, isShare }) => {
  const {
    id,
    createdAt,
    fileModifiedAt,
    extension,
    dimension,
    size,
    tags,
    campaigns,
    projects,
    products,
    folders: originalFolder,
    customs,
    dpi,
  } = asset;

  const {
    assets,
    subFoldersAssetsViewList: { results: subcollectionAssets, next: nextAsset, total: totalAssets },
    activeFolder,
    setSubFoldersAssetsViewList,
  } = useContext(AssetContext);

  const { hasPermission, advancedConfig } = useContext(UserContext);
  const { loadCampaigns, loadProjects, loadTags, activeSortFilter } = useContext(FilterContext);

  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);

  const { setIsLoading } = useContext(LoadingContext);

  const [inputCampaigns, setInputCampaigns] = useState([]);
  const [availNonAiTags, setAvailNonAiTags] = useState([]);
  const [availAiTags, setAvailAiTags] = useState([]);
  const [inputProjects, setInputProjects] = useState([]);
  // const [inputFolders, setInputFolders] = useState([]);

  const [nonAiTags, setNonAiTags] = useState([]);
  const [aiTags, setAiTags] = useState([]);
  const [assetCampaigns, setCampaigns] = useState(campaigns);
  const [assetProjects, setProjects] = useState(projects);
  // const [selectedFolder, setSelectedFolders] = useState([]);

  const [activeDropdown, setActiveDropdown] = useState("");

  const [newProjectName, setNewProjectName] = useState("");

  // Custom fields
  const [activeCustomField, setActiveCustomField] = useState<number>();
  const [inputCustomFields, setInputCustomFields] = useState([]);
  const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, customs));

  // Products
  const [productList, setProductList] = useState(products);

  const addFolder = async (folderData) => {
    try {
      // Show loading
      setIsLoading(true);
      const rs = await assetApi.addFolder(id, folderData);
      setIsLoading(false);
      return rs;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFolder = async (folderId, stateUpdate) => {
    try {
      // Show loading
      setIsLoading(true);
      await assetApi.removeFolder(id, folderId);
      // Show loading
      setIsLoading(false);
      changeFolderState(stateUpdate);
    } catch (err) {
      console.log(err);
    }
  };

  const updateAssetState = (updatedata) => {
    if (activeSortFilter.mainFilter === "SubCollectionView") {
      const assetIndex = subcollectionAssets.findIndex((asst) => asst?.asset?.id === asset?.id);
      if (assetIndex >= 0) {
        const updatedAssets = update(subcollectionAssets, {
          [assetIndex]: {
            asset: updatedata,
          },
        });
        // setAssets(updatedAssets);
        setSubFoldersAssetsViewList({
          next: nextAsset,
          total: totalAssets,
          results: updatedAssets,
        });
        setAssetDetail(update(asset, updatedata));
      }
    } else {
      const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
      if (assetIndex >= 0) {
        const updatedAssets = update(assets, {
          [assetIndex]: {
            asset: updatedata,
          },
        });
        // setAssets(updatedAssets);
        setAssetDetail(update(asset, updatedata));
      }
      setActiveDropdown("");
    }
  };

  const {
    folders,
    selectedFolder,
    subFolderLoadingState,
    showDropdown,
    input,
    completeSelectedFolder,
    setInput,
    filteredData,
    getFolders,
    getSubFolders,
    toggleSelected,
    toggleDropdown,
    setSelectedFolder,
    keyResultsFetch,
    keyExists,
    setShowDropdown,
    setSubFolderLoadingState,
    setFolderChildList,
  } = useAssetDetailCollecion(addFolder, updateAssetState, originalFolder, deleteFolder);

  useEffect(() => {
    const _nonAiTags = (tags || []).filter((tag) => tag.type !== "AI");
    const _aiTags = (tags || []).filter((tag) => tag.type === "AI");
    setNonAiTags(sort(_nonAiTags));
    setAiTags(sort(_aiTags));
    setCampaigns(sort(campaigns));
    setProjects(projects);
    const originalSelectedFolders = originalFolder?.map(({ id, name, parentId, ...rest }: Item) => {
      completeSelectedFolder.set(id, { name, parentId: parentId || null });
      return id;
    });
    setSelectedFolder((prev) => [...prev, ...originalSelectedFolders]);
  }, [asset]);

  useEffect(() => {
    if (!isShare) {
      getTagsInputData();
      getCustomFieldsInputData();
      if (hasPermission([CALENDAR_ACCESS])) {
        getInputData();
        getCustomFieldsInputData();
        getFolders();
      }
      return () => {
        setSelectedFolder([]);
        setShowDropdown([]);
        setSubFolderLoadingState(new Map());
        setFolderChildList(new Map());
        setInput("");
        completeSelectedFolder.clear();
      };
    }
  }, []);

  useEffect(() => {
    if (inputCustomFields.length > 0) {
      const updatedMappingCustomFieldData = mappingCustomFieldData(inputCustomFields, customs);

      setAssetCustomFields(
        update(assetCustomFields, {
          $set: updatedMappingCustomFieldData,
        }),
      );

      updateAssetState({
        customs: { $set: updatedMappingCustomFieldData },
      });
    }
  }, [inputCustomFields]);

  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects();
      const campaignsResponse = await campaignApi.getCampaigns();
      setInputProjects(projectsResponse.data);
      setInputCampaigns(campaignsResponse.data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const getTagsInputData = async () => {
    try {
      const tagsResponse = await tagApi.getTags({ includeAi: true });
      const regTags = tagsResponse.data.filter((tag) => tag.type !== "AI");
      const aiTags = tagsResponse.data.filter((tag) => tag.type === "AI");
      setAvailNonAiTags(regTags);
      setAvailAiTags(aiTags);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const getCustomFieldsInputData = async () => {
    try {
      const { data } = await customFieldsApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputCustomFields(data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const addNewProject = async (newProjectData) => {
    try {
      let type = newProjectData.channel;
      let channel;
      if (channelSocialOptions.includes(newProjectData.channel)) {
        type = "social";
        channel = newProjectData.channel;
      }
      const { data: newProject } = await assetApi.addProject(id, {
        ...newProjectData,
        type,
        channel,
      });
      const stateProjectsUpdate = update(assetProjects, {
        $push: [newProject],
      });
      setProjects(stateProjectsUpdate);
      setInputProjects(update(inputProjects, { $push: [newProject] }));
      loadProjects();
    } catch (err) {
      // TODO: Error if failure for whatever reason
    }
  };

  // const updateAssetState = (updatedata) => {
  //   const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
  //   if (assetIndex >= 0) {
  //     setAssets(
  //       update(assets, {
  //         [assetIndex]: {
  //           asset: updatedata,
  //         },
  //       }),
  //     );
  //     setAssetDetail(update(asset, updatedata));
  //   }

  //   setActiveDropdown("");
  // };

  const handleProjectChange = async (selected, actionMeta) => {
    if (actionMeta.action === "create-option") {
      setNewProjectName(selected.value);
    } else if (selected) {
      handleAssociationChange(selected.value, "projects", "add");
    }
  };

  const handleAssociationChange = async (id, type, operation) => {
    // Only perform operations if item exists/are abcent
    if (operation === "add") {
      if (asset[type].findIndex((item) => item.id === id) !== -1) return;
    } else if (operation === "remove") {
      if (asset[type].findIndex((item) => item.id === id) === -1) return;
    }
    updateAsset({
      updateData: {},
      associations: {
        [type]: {
          [operation]: [id],
        },
      },
    });
    setActiveDropdown("");
  };

  const updateChannel = async (channel) => {
    await updateAsset({ updateData: { channel } });
  };

  let formattedDimension;
  if (dimension) {
    const [width, height] = dimension.split(",");
    if (!isNaN(width) || !isNaN(height)) {
      formattedDimension = `${width} x  ${height} px`;
    }
  }

  let formattedDPI;
  if (dpi !== 0) {
    formattedDPI = dpi + " DPI";
  } else {
    formattedDPI = "";
  }

  const fieldValues = [
    {
      field: "Last Updated",
      value: fileModifiedAt ? format(new Date(fileModifiedAt), "P") : "",
    },
    {
      field: "Uploaded",
      value: format(new Date(createdAt), "P"),
    },
    // {
    //   field: 'Type',
    //   value: capitalCase(type)
    // },
    {
      field: "Extension",
      value: getParsedExtension(extension),
    },
    {
      field: "Resolution",
      value: formattedDPI,
    },
    {
      field: "Dimension",
      value: formattedDimension,
    },
    {
      field: "Size",
      value: filesize(size),
    },
  ];

  const changeFolderState = (folders) => {
    let stateUpdate = {
      folders: { $set: folders },
    };
    updateAssetState(stateUpdate);
  };

  // On change custom fields (add/remove)
  const onChangeCustomField = (index, data) => {
    // Show loading
    setIsLoading(true);

    // Hide select list
    setActiveCustomField(undefined);

    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: data },
        },
      }),
    );

    // Show loading
    setIsLoading(false);
  };

  // On custom field select one changes
  const onChangeSelectOneCustomField = async (selected, index) => {
    // Show loading
    setIsLoading(true);

    // Call API to add custom fields
    await assetApi.addCustomFields(id, { ...selected, folderId: activeFolder });

    // Hide select list
    setActiveCustomField(undefined);

    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: [selected] },
        },
      }),
    );

    // Hide loading
    setIsLoading(false);
  };

  // On remove select one custom field

  const onRemoveSelectOneCustomField = async (removeId, index, stateUpdate) => {
    // Show loading
    setIsLoading(true);

    await assetApi.removeCustomFields(id, removeId);

    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: stateUpdate },
        },
      }),
    );

    // Update asset (global)
    updateAssetState({
      customs: { [index]: { values: { $set: stateUpdate } } },
    });

    // Hide loading
    setIsLoading(false);
  };

  const addProductBlock = () => {
    setProductList([...productList, null]);
  };

  useEffect(() => {
    setProductList(products);
  }, [products]);

  return (
    <>
      <div className={` ${!isShare ? styles.fieldWrapper : styles.shareWrapper}`}>
        <h2 className={styles["details-heading"]}>Collections</h2>

        {(!isShare || (isShare && asset.displayAttributes)) && (
          <>
            {/**
             * new component
             */}
            <div className={styles["field-wrapper"]}>
              {
                <div className={`${styles["tag-container-wrapper"]}`}>
                  {[...completeSelectedFolder.entries()].map(([key, value], index) => (
                    <div className={`${styles["tag-container"]}`} key={index}>
                      <span>{value.name}</span>
                      <IconClickable
                        additionalClass={styles.remove}
                        src={Utilities.closeTag}
                        onClick={() => toggleSelected(key, !selectedFolder.includes(key), false, "", value.name)}
                      />
                    </div>
                  ))}
                </div>
              }
              {hasPermission([ASSET_EDIT]) && (activeDropdown === "" || activeDropdown !== "collections") && (
                <div className={`add ${styles["select-add"]}`} onClick={() => setActiveDropdown("collections")}>
                  <IconClickable src={Utilities.addLight} />
                  <span>{"Add to Collections"}</span>
                </div>
              )}
              {hasPermission([ASSET_EDIT]) && activeDropdown === "collections" && (
                <div className={`${styles["edit-bulk-outer-wrapper"]}`}>
                  <div className={`${styles["close-popup"]}`}>
                    {" "}
                    <IconClickable
                      additionalClass={styles.remove}
                      src={Utilities.closeTag}
                      onClick={() => setActiveDropdown("")}
                    />
                  </div>
                  <div className={`${styles["search-btn"]}`}>
                    <SearchModal filteredData={filteredData} input={input} setInput={setInput} />
                  </div>
                  <div className={`${styles["modal-heading"]}`}>
                    <span>Collection</span>
                  </div>
                  <div className={`${styles["outer-wrapper"]}`}>
                    {folders.map((folder, index) => (
                      <div key={index}>
                        <div className={`${styles["flex"]} ${styles.nestedbox}`}>
                          {folder?.childFolders?.length > 0 ? (
                            <div
                              className={`${styles["height"]} ${styles["flex"]}`}
                              onClick={() => {
                                toggleDropdown(folder.id, true);
                              }}
                            >
                              <img
                                className={showDropdown.includes(folder.id) ? styles.iconClick : styles.rightIcon}
                                src={Utilities.caretRightSolid}
                                alt="Right Arrow Icon"
                                onClick={() => {
                                  toggleDropdown(folder.id, true);
                                }}
                              />
                            </div>
                          ) : (
                            <div className={styles.emptyBox}></div>
                          )}
                          <div className={styles.w100}>
                            <div
                              className={`${styles["dropdownMenu"]} ${
                                selectedFolder.includes(folder.id) ? styles["active"] : ""
                              }`}
                            >
                              <div className={styles.flex}>
                                <div
                                  className={`${styles.circle} ${
                                    selectedFolder.includes(folder.id) ? styles.checked : ""
                                  }`}
                                  onClick={() =>
                                    toggleSelected(
                                      folder.id,
                                      !selectedFolder.includes(folder.id),
                                      false,
                                      "",
                                      folder.name,
                                    )
                                  }
                                >
                                  {selectedFolder.includes(folder.id) && <img src={Utilities.checkIcon} />}
                                </div>
                                <div className={styles["icon-descriptions"]} title={folder.name}>
                                  <span>{folder.name}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {showDropdown.includes(folder.id) && (
                          <div className={styles.folder}>
                            <div className={styles.subfolderList}>
                              {keyExists(folder.id) &&
                                (keyResultsFetch(folder.id, "record") as Item[]).map(
                                  ({ id, name, parentId, ...rest }) => (
                                    <>
                                      <div
                                        key={id}
                                        className={styles.dropdownOptions}
                                        onClick={() =>
                                          toggleSelected(
                                            id,
                                            !selectedFolder.includes(id),
                                            true,
                                            folder.id,
                                            name,
                                            parentId,
                                          )
                                        }
                                      >
                                        <div className={styles["folder-lists"]}>
                                          <div className={styles.dropdownIcons}>
                                            <div
                                              className={`${styles.circle} ${
                                                selectedFolder.includes(id) ? styles.checked : ""
                                              }`}
                                            >
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
                                  ),
                                )}
                              {keyExists(folder.id) && (keyResultsFetch(folder.id, "next") as number) >= 0 && (
                                <div className={`${styles["outer-load-wrapper"]}`}>
                                  <div
                                    className={`${styles["load-wrapper"]}`}
                                    onClick={() => {
                                      getSubFolders(folder.id, keyResultsFetch(folder.id, "next") as number, false);
                                    }}
                                  >
                                    <IconClickable additionalClass={styles.loadIcon} src={Utilities.load} />
                                    <button className={styles.loadMore}>
                                      {subFolderLoadingState.get(folder.id) ? "Loading..." : "Load More"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={styles["modal-btns"]}>
                    <Button
                      className="container secondary bulk-edit-btn"
                      text="Close"
                      onClick={() => setActiveDropdown("")}
                    ></Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FolderSidePanel;
