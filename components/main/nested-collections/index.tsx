import update from 'immutability-helper';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';

import { ASSET_ACCESS, ASSET_UPLOAD_APPROVAL } from '../../../constants/permissions';
import { AssetContext, FilterContext, UserContext } from '../../../context';
import assetApi from '../../../server-api/asset';
import folderApi from '../../../server-api/folder';
import { getAssetsFilters, getAssetsSort } from '../../../utils/asset';
import toastUtils from '../../../utils/toast';
import AssetGrid from '../../common/asset/asset-grid';
import AssetHeaderOps from '../../common/asset/asset-header-ops';
import NestedTopBar from '../../common/asset/nested-top-bar';
import { DropzoneProvider } from '../../common/misc/dropzone';
import NoPermissionNotice from '../../common/misc/no-permission-notice';
import styles from '../assets-library/index.module.css';
import selectOptions from '../../../utils/select-options';
import React from 'react';

const NestedSubcollection = React.memo(() => {
  const router = useRouter();
  const preparingAssets = useRef(true);

  const [activeMode, setActiveMode] = useState("assets");
  const [activeView, setActiveView] = useState("grid");
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [widthCard, setWidthCard] = useState(0);

  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false);
  const [openFilter, setOpenFilter] = useState(
    activeMode === "assets" ? true : false
  );

  const {
    assets,
    folders,
    activeFolder,
    selectAllAssets,
    setDetailOverlayId,
    setCurrentViewAsset,
    setAddedIds,
    setPlaceHolders,
    nextPage,
    addedIds,
    setAssets,
    lastUploadedFolder,
    setFolders,
    setActiveFolder,
    setLoadingAssets,
    selectedAllAssets,
    selectAllFolders,
    needsFetch,
    setActivePageMode,
    setNeedsFetch
  } = useContext(AssetContext);

  const { advancedConfig, hasPermission } = useContext(UserContext);

  const {
    activeSortFilter,setActiveSortFilter,term,searchFilterParams, tags,loadTags,
  } = useContext(FilterContext);

  const selectedAssets = assets.filter((asset) => asset.isSelected);
  
  const selectedFolders = folders.filter((folder) => folder.isSelected);
  
  const getFolders = async (replace = true) => {
    try {

      // don't reload folder on active detail folder/collection
      if (activeFolder) {
        return;
      }
      if (replace) {
        setAddedIds([]);
      }
      setPlaceHolders("folder", replace);
      const { field, order } = activeSortFilter.sort;
      const queryParams = {
        page: replace ? 1 : nextPage,
        sortField: field,
        sortOrder: order,
      };

      if (!replace && addedIds.length > 0) {
        queryParams.excludeIds = addedIds.join(",");
      }
      if (activeSortFilter.filterFolders?.length > 0) {
        queryParams.folders = activeSortFilter.filterFolders
          .map((item) => item.value)
          .join(",");
      }

      const { data } = await folderApi.getFolders({
        ...queryParams,
        ...(term && { term }),
      });

      let assetList = { ...data, results: data.results };
      if (
        lastUploadedFolder &&
        activeSortFilter.mainFilter === "folders" &&
        activeSortFilter.sort.value === "alphabetical"
      ) {
        const lastFolder = { ...lastUploadedFolder };
        assetList.results.unshift(lastFolder);
      }

      setFolders(assetList, replace);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    }
  };

 const selectAll = () => {
    if (activeMode === "assets") {
      // Mark select all
      selectAllAssets();

      setAssets(
        assets.map((assetItem) => ({ ...assetItem, isSelected: true }))
      );
    } else if (activeMode === "folders") {
      selectAllFolders();

      setFolders(folders.map((folder) => ({ ...folder, isSelected: true })));
    }
  };

 const closeSearchOverlay = () => {
    setActiveSearchOverlay(false);
  };
 const onFilesDataGet = async (files) => {
    // if (!hasPermission([ASSET_UPLOAD_APPROVAL])) {
    //   const currentDataClone = [...assets];
    //   const currenFolderClone = [...folders];
    //   try {
    //     let needsFolderFetch;
    //     const newPlaceholders = [];
    //     const folderPlaceholders = [];
    //     const foldersUploaded = getFoldersFromUploads(files);
    //     if (foldersUploaded.length > 0) {
    //       needsFolderFetch = true;
    //     }
    //     foldersUploaded.forEach((folder) => {
    //       folderPlaceholders.push({
    //         name: folder,
    //         length: 10,
    //         assets: [],
    //         isLoading: true,
    //         createdAt: new Date(),
    //       });
    //     });

    //     let totalSize = 0;
    //     files.forEach((file) => {
    //       let fileToUpload = file;
    //       let dragDropFolderUpload = false;

    //       // Upload folder
    //       if (file.originalFile.path.includes("/")) {
    //         dragDropFolderUpload = true;
    //         fileToUpload = new File(
    //           [
    //             file.originalFile.slice(
    //               0,
    //               file.originalFile.size,
    //               file.originalFile.type
    //             ),
    //           ],
    //           file.originalFile.path.substring(
    //             1,
    //             file.originalFile.path.length
    //           ),
    //           {
    //             type: file.originalFile.type,
    //             lastModified:
    //               file.originalFile.lastModifiedDate ||
    //               new Date(file.originalFile.lastModified),
    //           }
    //         );
    //       } else {
    //         fileToUpload.path = null;
    //       }

    //       totalSize += file.originalFile.size;
    //       newPlaceholders.push({
    //         asset: {
    //           name: file.originalFile.name,
    //           createdAt: new Date(),
    //           size: file.originalFile.size,
    //           stage: "draft",
    //           type: "image",
    //           mimeType: file.originalFile.type,
    //         },
    //         file: fileToUpload,
    //         status: "queued",
    //         isUploading: true,
    //         dragDropFolderUpload, // Drag and drop folder will have different process a bit here
    //       });
    //     });

    //     // Store current uploading assets for calculation
    //     setUploadingAssets(newPlaceholders);

    //     // Showing assets = uploading assets + existing assets
    //     setAssets([...newPlaceholders, ...currentDataClone]);
    //     setFolders([...folderPlaceholders, ...currenFolderClone]);

    //     // Get team advance configurations first
    //     const subFolderAutoTag = advancedConfig.subFolderAutoTag;

    //     // Start to upload assets
    //     let folderGroups = await uploadAsset(
    //       0,
    //       newPlaceholders,
    //       currentDataClone,
    //       totalSize,
    //       activeFolder,
    //       undefined,
    //       subFolderAutoTag
    //     );

    //     // Save this for retry failure files later
    //     setFolderGroups(folderGroups);

    //     // Finish uploading process
    //     showUploadProcess("done");

    //     if (needsFolderFetch) {
    //       setNeedsFetch("folders");
    //     }
    //   } catch (err) {
    //     // Finish uploading process
    //     showUploadProcess("done");

    //     setAssets(currentDataClone);
    //     setFolders(currenFolderClone);
    //     console.log(err);
    //     if (err.response?.status === 402)
    //       toastUtils.error(err.response.data.message);
    //     else
    //       toastUtils.error("Could not upload assets, please try again later.");
    //   }
    // }
  };
 const toggleSelected = (id) => {
    if (activeMode === "assets") {
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === id
      );
      setAssets(
        update(assets, {
          [assetIndex]: {
            isSelected: { $set: !assets[assetIndex].isSelected },
          },
        })
      );
    } else if (activeMode === "folders") {
      const folderIndex = folders.findIndex((folder) => folder.id === id);
      setFolders(
        update(folders, {
          [folderIndex]: {
            isSelected: { $set: !folders[folderIndex].isSelected },
          },
        })
      );
    }
  };
  const updateSortFilterByAdvConfig = async (params: any = {}) => {
    let defaultTab = getDefaultTab();
    const filters = Object.keys(router.query);
    if (filters && filters.length) {
      defaultTab = filters[0] === "collection" ? "folders" : "all";
    } else if (params.mainFilter) {
      defaultTab = params.mainFilter;
    }

    let sort = { ...activeSortFilter.sort };
    if (defaultTab === "folders" && !params.folderId) {
      sort =
        advancedConfig.collectionSortView === "alphabetical"
          ? selectOptions.sort[3]
          : selectOptions.sort[1];
    } else {
      sort =
        advancedConfig.assetSortView === "newest"
          ? selectOptions.sort[1]
          : selectOptions.sort[3];
    }

    setActiveSortFilter({
      ...activeSortFilter,
      mainFilter: defaultTab,
      sort,
    });
  };
  const getDefaultTab = (advConf?) => {
    const config = advConf || advancedConfig;
    const defaultTab =
      config.defaultLandingPage === "allTab" ? "all" : "folders";
    return defaultTab;
  };

  const viewFolder = async (id) => {
    setActiveFolder(id);
    updateSortFilterByAdvConfig({ folderId: id });
  };
  const deleteFolder = async (id) => {
    try {
      await folderApi.deleteFolder(id);
      const modFolderIndex = folders.findIndex((folder) => folder.id === id);
      setFolders(
        update(folders, {
          $splice: [[modFolderIndex, 1]],
        })
      );
      toastUtils.success("Collection deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };
  const mapWithToggleSelection = (asset) => ({
    ...asset,
    isSelected: selectedAllAssets,
    toggleSelected,
  });
  const getAssets = async (replace = true, complete = null) => {
    try {
      console.log("hello world!22222");
      setLoadingAssets(true);
      if (replace) {
        setAddedIds([]);
      }
      setPlaceHolders("asset", replace);
      const { data } = await assetApi.getAssets({
        ...getAssetsFilters({
          replace,
          activeFolder,
          addedIds,
          nextPage,
          userFilterObject: activeSortFilter,
        }),
        term,
        ...searchFilterParams,
        complete,
        ...getAssetsSort(activeSortFilter),
      });

      setAssets(
        { ...data, results: data.results.map(mapWithToggleSelection) },
        replace
      );
      setFirstLoaded(true);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    } finally {
      setLoadingAssets(false);
    }
  };
  const loadMore = () => {
    if (activeMode === "assets") {
      getAssets(false);
    } else {
      getFolders(false);
    }
  };
  
  console.log(activeSortFilter||"no value", firstLoaded||"no value", term||"no value","valueeeess")

  useEffect(() => {
    if (!preparingAssets.current) return;
    if (
      !router.query.tag &&
      !router.query.product &&
      !router.query.collection &&
      !router.query.campaign
    ) {
      preparingAssets.current = false;
      return;
    }
    if (router.query.tag && !tags.length) {
      setPlaceHolders("asset", true);
      loadTags();
      return;
    }
    if (router.query.product && !productFields.sku.length) {
      setPlaceHolders("asset", true);
      loadProductFields();
      return;
    }

    if (router.query.collection && !collection.length) {
      setPlaceHolders("asset", true);
      loadFolders();
      return;
    }

    if (router.query.campaign && !campaigns.length) {
      setPlaceHolders("asset", true);
      loadCampaigns();
      return;
    }

    const newSortFilter: any = { ...activeSortFilter };

    if (router.query.campaign) {
      const foundCampaign = campaigns.find(
        ({ name }) => name === router.query.campaign
      );
      if (foundCampaign) {
        newSortFilter.filterCampaigns = [
          {
            ...foundCampaign,
            value: foundCampaign.id,
          },
        ];
      }
      preparingAssets.current = false;
      setActiveSortFilter(newSortFilter);
      return;
    }

    // Query folder
    if (router.query.collection) {
      const foundCollection = collection.find(
        ({ name }) => name === router.query.collection
      );
      if (foundCollection) {
        newSortFilter.filterFolders = [
          {
            ...foundCollection,
            value: foundCollection.id,
          },
        ];
        newSortFilter.mainFilter = "folders";
      }
      preparingAssets.current = false;
      setActiveSortFilter(newSortFilter);
      return;
    }

    if (router.query.product) {
      const foundProduct = productFields.sku.find(
        ({ sku }) => sku === router.query.product
      );
      if (foundProduct) {
        newSortFilter.filterProductSku = [
          {
            ...foundProduct,
            value: foundProduct.sku,
          },
        ];
      }
      preparingAssets.current = false;
      setActiveSortFilter(newSortFilter);
      return;
    }

    if (router.query.tag) {
      const foundTag = tags.find(({ name }) => name === router.query.tag);
      if (foundTag) {
        newSortFilter.filterNonAiTags = [
          {
            ...foundTag,
            value: foundTag.id,
          },
        ];
      }
      preparingAssets.current = false;
      setActiveSortFilter(newSortFilter);
      return;
    }
  }, [tags, productFields.sku, collection, campaigns]);
  
  useEffect(() => {
    console.log("hello world!111111heloting");
    if (needsFetch === "assets") {
      getAssets();
    } else if (needsFetch === "folders") {
      getFolders();
    }
    setNeedsFetch("");
  }, [needsFetch]);

  
  useEffect(() => {
    console.log("111")
    if (hasPermission([ASSET_ACCESS])) {
      // Assets are under preparing (for query etc)
      // if (preparingAssets.current) {
      //   console.log("helloworld")
      //   return;
      // } else {
        if (!firstLoaded) {
          setFirstLoaded(true);
        }
      // }
      console.log("222")
      if (firstLoaded) {
        setActivePageMode("library");
        if (activeSortFilter.mainFilter === "folders") {
          setActiveMode("folders");
          getFolders();
        } else {
          setActiveMode("assets");
          setAssets([]);
          getAssets();
        }
      }
    }
  }, [activeSortFilter,firstLoaded,term]);
  return (
 <>
 {(activeMode === "assets"
        ? selectedAssets.length
        : selectedFolders.length) > 0 && (
        <AssetHeaderOps
          isUnarchive={activeSortFilter.mainFilter === "archived"}
          isFolder={activeMode === "folders"}
          deletedAssets={false}
        />
      )}
       {hasPermission([ASSET_ACCESS]) ||
      hasPermission([ASSET_UPLOAD_APPROVAL]) ? (
        <>
          <main className={`${styles.container}`}>
            <div className="position-relative">
              {advancedConfig.set && hasPermission([ASSET_ACCESS]) && (
                <NestedTopBar
                  activeFolder={activeFolder}
                  getFolders={getFolders}
                  mode={activeMode}
                  activeSortFilter={activeSortFilter}
                  setActiveSortFilter={setActiveSortFilter}
                  setActiveView={setActiveView}
                  activeView={activeView}
                  setActiveSearchOverlay={() => {
                    selectAllAssets(false);
                    setActiveSearchOverlay(true);
                  }}
                  selectAll={selectAll}
                  setOpenFilter={setOpenFilter}
                  openFilter={openFilter}
                  deletedAssets={false}
                  activeSearchOverlay={activeSearchOverlay}
                  closeSearchOverlay={closeSearchOverlay}
                  setDetailOverlayId={setDetailOverlayId}
                  setCurrentViewAsset={setCurrentViewAsset}
                  isFolder={activeSortFilter?.mainFilter === "folders"}
                />
              )}
            </div>
            <div
              className={`${openFilter && styles["col-wrapper"]} ${
                styles["grid-wrapper"]
              } ${activeFolder && styles["active-breadcrumb-item"]}`}
            >
              <DropzoneProvider>
                {advancedConfig.set && (
                  <AssetGrid
                    activeFolder={activeFolder}
                    getFolders={getFolders}
                    activeView={activeView}
                    activeSortFilter={activeSortFilter}
                    onFilesDataGet={onFilesDataGet}
                    toggleSelected={toggleSelected}
                    mode={activeMode}
                    viewFolder={viewFolder}
                    deleteFolder={deleteFolder}
                    loadMore={loadMore}
                    openFilter={openFilter}
                    onCloseDetailOverlay={(assetData) => {
                      setDetailOverlayId(undefined);
                      setCurrentViewAsset(assetData);
                    }}
                    setWidthCard={setWidthCard}
                    widthCard={widthCard}
                  />
                )}
              </DropzoneProvider>
            </div>
          </main>
        </>
      ) : (
        <NoPermissionNotice />
      )}
  </>
  
    
  )
})

export default NestedSubcollection