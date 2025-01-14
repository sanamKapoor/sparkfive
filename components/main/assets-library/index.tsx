import update from "immutability-helper";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";

import { validation } from "../../../constants/file-validation";
import { ASSET_ACCESS, ASSET_UPLOAD_APPROVAL } from "../../../constants/permissions";
import { AssetContext, FilterContext, UserContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import {
  DEFAULT_CUSTOM_FIELD_FILTERS,
  DEFAULT_FILTERS,
  getAssetsFilters,
  getAssetsSort,
  getFoldersFromUploads,
} from "../../../utils/asset";
import selectOptions from "../../../utils/select-options";
import toastUtils from "../../../utils/toast";
import { getFolderKeyAndNewNameByFileName } from "../../../utils/upload";
import AssetGrid from "../../common/asset/asset-grid";
import AssetHeaderOps from "../../common/asset/asset-header-ops";
import AssetOps from "../../common/asset/asset-ops";
import DetailOverlay from "../../common/asset/detail-overlay";
import TopBar from "../../common/asset/top-bar";
import { DropzoneProvider } from "../../common/misc/dropzone";
import NoPermissionNotice from "../../common/misc/no-permission-notice";
import RenameModal from "../../common/modals/rename-modal";
import SpinnerOverlay from "../../common/spinners/spinner-overlay";
import NestedSidenav from "../../nested-subcollection-sidenav/nested-sidenav";
import UploadStatusOverlayAssets from "../../upload-status-overlay-assets";
import styles from "./index.module.css";

import { initialActiveSortFilters } from "../../../config/data/filter";
// Components

const AssetsLibrary = () => {

  const [activeView, setActiveView] = useState("grid");
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);

  const {
    sidenavTotalCollectionCount,
    assets,
    sidenavFolderList,
    setSidenavFolderList,
    setAssets,
    folders,
    setFolders,
    lastUploadedFolder,
    setPlaceHolders,
    activeFolder,
    activeSubFolders,
    setActiveSubFolders,
    setActiveFolder,
    setActivePageMode,
    needsFetch,
    nextPage,
    setNeedsFetch,
    addedIds,
    setAddedIds,
    setLoadingAssets,
    selectAllAssets,
    selectedAllAssets,
    selectedAllFolders,
    selectAllFolders,
    uploadDetailOverlay,
    setUploadDetailOverlay,
    setUploadingAssets,
    showUploadProcess,
    setUploadingFileName,
    setFolderGroups,
    totalAssets,
    setTotalAssets,
    currentViewAsset,
    setCurrentViewAsset,
    setDetailOverlayId,
    sidebarOpen,
    setSubFoldersViewList,
    subFoldersViewList,
    subFoldersAssetsViewList,
    setSubFoldersAssetsViewList,
    setHeaderName,
    selectedAllSubFoldersAndAssets,
    setSelectedAllSubFoldersAndAssets,
    loadingAssets,
    appendNewSubSidenavFolders,
    selectedAllSubAssets,
    setSelectedAllSubAssets,
    setListUpdateFlag,
    showSubCollectionContent,
    setShowSubCollectionContent,
  } = useContext(AssetContext);

  const {
    activeSortFilter,
    setActiveSortFilter,
    tags,
    loadTags,
    loadProductFields,
    productFields,
    folders: collection,
    loadFolders,
    campaigns,
    loadCampaigns,
    term,
    searchFilterParams,
  } = useContext(FilterContext) as any;

  const { advancedConfig, hasPermission } = useContext(UserContext) as any;

  const [widthCard, setWidthCard] = useState(0);

  const [activeMode, setActiveMode] = useState("assets");

  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false);

  const [firstLoaded, setFirstLoaded] = useState(false);

  const [renameModalOpen, setRenameModalOpen] = useState(false);

  const router = useRouter();

  const preparingAssets = useRef(true);

  // When tag, campaigns, collection changes, used for click on tag/campaigns/collection in admin attribute management
  useEffect(() => {
    if (!preparingAssets.current) return;
    if (!router.query.tag && !router.query.product && !router.query.collection && !router.query.campaign) {
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
      const foundCampaign = campaigns.find(({ name }) => name === router.query.campaign);
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
      const foundCollection = collection.find(({ name }) => name === router.query.collection);
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
      const foundProduct = productFields.sku.find(({ sku }) => sku === router.query.product);
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
    if (hasPermission([ASSET_ACCESS])) {
      // Assets are under preparing (for query etc)
      if (preparingAssets.current) {
        return;
      } else {
        if (!firstLoaded) {
          setFirstLoaded(true);
        }
      }
      if (firstLoaded) {
        setActivePageMode("library");
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (
          activeSortFilter.mainFilter === "folders" &&
          !router.query.tag &&
          !router.query.campaign &&
          !router.query.product
        ) {
          setActiveMode("folders");
          setShowSubCollectionContent(false);
          getFolders();
        } else if (activeSortFilter.mainFilter === "SubCollectionView" && activeSubFolders !== "") {
          setActiveMode("SubCollectionView");
          getSubCollectionsFolderData(true, 10);
          getSubCollectionsAssetData(true, showSubCollectionContent);
        } else {
          setActiveMode("assets");
          setAssets([]);
          setShowSubCollectionContent(false);
          getAssets();
        }
      }
    }
  }, [activeSortFilter, firstLoaded, term]);

  useEffect(() => {
    if (firstLoaded && activeSubFolders) {
      setActiveSortFilter({
        ...activeSortFilter,
        mainFilter: activeSubFolders ? "SubCollectionView" : activeSortFilter.mainFilter,
        sort: advancedConfig.collectionSortView === "alphabetical" ? selectOptions.sort[3] : selectOptions.sort[1],
      });
    }
  }, [activeSubFolders]);

  useEffect(() => {
    if (firstLoaded && activeFolder) {
      setActiveSortFilter({
        ...activeSortFilter,
        mainFilter: activeFolder ? "all" : activeSortFilter.mainFilter,
      });
    }
  }, [activeFolder]);

  useEffect(() => {
    if (needsFetch === "assets") {
      getAssets();
    } else if (needsFetch === "folders") {
      getFolders();
    } else if (needsFetch === "SubCollectionView") {
      getSubCollectionsFolderData(true, 10);
      getSubCollectionsAssetData();
    }
    setNeedsFetch("");
  }, [needsFetch]);

  useEffect(() => {
    if (activeMode === "folders") {
      setAssets(assets.map((asset) => ({ ...asset, isSelected: false })));
    }
    if (activeMode === "assets") {
      setFolders(folders.map((folder) => ({ ...folder, isSelected: false })));
    }
    if (selectedAllAssets) selectAllAssets(false);

    if (selectedAllFolders) selectAllFolders(false);

    if (selectedAllSubFoldersAndAssets) setSelectedAllSubFoldersAndAssets(false);

    if (selectedAllSubAssets) {
      setSelectedAllSubAssets(false);
    }
    setActiveSortFilter({
      ...activeSortFilter,
      ...initialActiveSortFilters,
      ...DEFAULT_CUSTOM_FIELD_FILTERS(activeSortFilter),
    });
  }, [activeMode]);

  useEffect(() => {
    updateSortFilterByAdvConfig();
  }, [advancedConfig.set]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingAssets) {
        setShowOverlayLoader(true);
      } else {
        setShowOverlayLoader(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loadingAssets]);

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
      sort = advancedConfig.collectionSortView === "alphabetical" ? selectOptions.sort[3] : selectOptions.sort[1];
    } else {
      sort = advancedConfig.assetSortView === "newest" ? selectOptions.sort[1] : selectOptions.sort[3];
    }

    setActiveSortFilter({
      ...activeSortFilter,
      mainFilter: activeFolder ? "all" : activeSubFolders ? "SubCollectionView" : defaultTab,
      sort,
    });
  };

  const getDefaultTab = (advConf: any = null) => {
    const config = advConf || advancedConfig;
    const defaultTab = config.defaultLandingPage === "allTab" ? "all" : "folders";
    return defaultTab;
  };

  // Upload asset
  const uploadAsset = async (
    i: number,
    assets: any,
    currentDataClone: any,
    totalSize: number,
    folderId: any,
    folderGroup = {},
    subFolderAutoTag = true,
  ) => {
    try {
      const formData = new FormData();
      let file = assets[i].file;
      let currentUploadingFolderId = null;
      let newAssets = 0;

      // Do validation
      if (assets[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE) {
        // Violate validation, mark failure
        const updatedAssets = assets.map((asset, index) =>
          index === i
            ? {
              ...asset,
              status: "fail",
              index,
              error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE,
            }
            : asset,
        );

        // Update uploading assets
        setUploadingAssets(updatedAssets);

        // Remove current asset from asset placeholder
        let newAssetPlaceholder = updatedAssets.filter((asset) => asset.status !== "fail");

        // At this point, file place holder will be removed
        setAssets([...newAssetPlaceholder, ...currentDataClone]);

        if (activeSortFilter?.mainFilter === "SubCollectionView") {
          setSubFoldersAssetsViewList({
            ...subFoldersAssetsViewList,
            results: [...newAssetPlaceholder, ...currentDataClone],
          });
        }

        // The final one
        if (i === assets.length - 1) {
          return folderGroup;
        } else {
          // Keep going
          await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag);
        }
      } else {
        // Show uploading toast
        showUploadProcess("uploading", i);
        // Set current upload file name
        setUploadingFileName(assets[i].asset.name);

        // If user is uploading files in folder which is not saved from server yet
        if (assets[i].dragDropFolderUpload && !folderId) {
          // Get file group info, this returns folderKey and newName of file
          let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.name, subFolderAutoTag);

          // Current folder Group have the key
          if (fileGroupInfo.folderKey && folderGroup[fileGroupInfo.folderKey]) {
            currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey];
          }
        }

        // Append file to form data
        formData.append("asset", assets[i].dragDropFolderUpload ? file : file.originalFile);
        formData.append(
          "fileModifiedAt",
          assets[i].dragDropFolderUpload
            ? new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString()
            : new Date(
              (file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified)).toUTCString(),
            ).toISOString(),
        );

        let size = totalSize;
        // Calculate the rest of size
        assets.map((asset) => {
          // Exclude done and  assets
          if (asset.status === "done" || asset.status === "fail") {
            newAssets += 1;
            size -= asset.asset.size;
          }
        });

        let attachedQuery = { estimateTime: 1, size, totalSize };

        // Uploading inside specific folders
        if (folderId) {
          attachedQuery["folderId"] = folderId;
        }

        // Uploading the new folder
        if (currentUploadingFolderId) {
          attachedQuery["folderId"] = currentUploadingFolderId;
        }

        // Call API to upload
        let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery));

        // If user is uploading files in folder which is not saved from server yet
        if (assets[i].dragDropFolderUpload && !folderId) {
          // Get file group info, this returns folderKey and newName of file
          let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.name, subFolderAutoTag);

          /// If user is uploading new folder and this one still does not have folder Id, add it to folder group
          if (fileGroupInfo.folderKey && !folderGroup[fileGroupInfo.folderKey]) {
            folderGroup[fileGroupInfo.folderKey] = data[0].asset.folders[0];
          }
        }

        data = data.map((item) => {
          item.isSelected = true;
          return item;
        });

        assets[i] = data[0];

        // At this point, file place holder will be removed
        setAssets([...assets, ...currentDataClone]);

        if (activeSortFilter?.mainFilter === "SubCollectionView") {
          setSubFoldersAssetsViewList({ ...subFoldersAssetsViewList, results: [...assets, ...currentDataClone] });
        }

        setAddedIds(data.map((assetItem) => assetItem.asset.id));

        // Mark this asset as done
        const updatedAssets = assets.map((asset, index) => (index === i ? { ...asset, status: "done" } : asset));

        setUploadingAssets(updatedAssets);

        // Update total assets
        setTotalAssets(totalAssets + newAssets + 1);

        // The final one
        if (i === assets.length - 1) {
          return folderGroup;
        } else {
          // Keep going
          await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag);
        }
      }
    } catch (e) {
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) =>
        index === i ? { ...asset, status: "fail", index, error: "Processing file error" } : asset,
      );

      // Update uploading assets
      setUploadingAssets(updatedAssets);

      // Remove current asset from asset placeholder
      let newAssetPlaceholder = updatedAssets.filter((asset) => asset.status !== "fail");

      // At this point, file place holder will be removed
      setAssets([...newAssetPlaceholder, ...currentDataClone]);

      if (activeSortFilter?.mainFilter === "SubCollectionView") {
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: [...newAssetPlaceholder, ...currentDataClone],
        });
      }

      // The final one
      if (i === assets.length - 1) {
        return folderGroup;
      } else {
        // Keep going
        await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag);
      }
    }
  };

  const onFilesDataGet = async (files: any) => {
    if (!hasPermission([ASSET_UPLOAD_APPROVAL])) {
      const currentDataClone = [...assets];
      const currenFolderClone = [...folders];
      const subFolderClone = [...subFoldersAssetsViewList.results];
      try {
        let needsFolderFetch;
        const newPlaceholders: any = [];
        const folderPlaceholders: any = [];
        const foldersUploaded = getFoldersFromUploads(files);
        if (foldersUploaded.length > 0) {
          needsFolderFetch = true;
        }
        foldersUploaded.forEach((folder) => {
          folderPlaceholders.push({
            name: folder,
            length: 10,
            assets: [],
            isLoading: true,
            createdAt: new Date(),
          });
        });

        let totalSize = 0;
        files.forEach((file) => {
          let fileToUpload = file;
          let dragDropFolderUpload = false;

          // Upload folder
          if (file.originalFile.path.includes("/")) {
            dragDropFolderUpload = true;
            fileToUpload = new File(
              [file.originalFile.slice(0, file.originalFile.size, file.originalFile.type)],
              file.originalFile.path.substring(1, file.originalFile.path.length),
              {
                type: file.originalFile.type,
                lastModified: file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified),
              },
            );
          } else {
            fileToUpload.path = null;
          }

          totalSize += file.originalFile.size;
          newPlaceholders.push({
            asset: {
              name: file.originalFile.name,
              createdAt: new Date(),
              size: file.originalFile.size,
              stage: "draft",
              type: "image",
              mimeType: file.originalFile.type,
            },
            file: fileToUpload,
            status: "queued",
            isUploading: true,
            dragDropFolderUpload, // Drag and drop folder will have different process a bit here
          });
        });

        // Store current uploading assets for calculation
        setUploadingAssets(newPlaceholders);

        // Showing assets = uploading assets + existing assets
        if (activeSortFilter?.mainFilter === "SubCollectionView") {
          setSubFoldersAssetsViewList(
            {
              ...subFoldersAssetsViewList,
              results: [...newPlaceholders, ...subFolderClone],
            },
            true,
          );
        } else {
          setAssets([...newPlaceholders, ...currentDataClone]);
          setFolders([...folderPlaceholders, ...currenFolderClone]);
        }
        // Get team advance configurations first
        const subFolderAutoTag = advancedConfig.subFolderAutoTag;

        // Start to upload assets
        let folderGroups = await uploadAsset(
          0,
          newPlaceholders,
          currentDataClone,
          totalSize,
          activeSortFilter?.mainFilter === "SubCollectionView" ? activeSubFolders : activeFolder,
          undefined,
          subFolderAutoTag,
        );

        // Save this for retry failure files later
        setFolderGroups(folderGroups);

        // Finish uploading process
        showUploadProcess("done");

        if (activeSortFilter?.mainFilter === "SubCollectionView") {
          // setNeedsFetch("SubCollectionView");
        } else if (needsFolderFetch) {
          setNeedsFetch("folders");
        }
      } catch (err) {
        // Finish uploading process
        showUploadProcess("done");

        setAssets(currentDataClone);
        setFolders(currenFolderClone);
        if (err.response?.status === 402) toastUtils.error(err.response.data.message);
        else toastUtils.error("Could not upload assets, please try again later.");
      }
    }
  };

  const getCreationParameters = (attachQuery?: any) => {
    let queryData: any = {};
    if (activeFolder) {
      queryData.folderId = activeFolder;
    }
    // Attach extra query
    if (attachQuery) {
      queryData = { ...queryData, ...attachQuery };
    }
    return queryData;
  };

  const getAssets = async (replace = true, complete: any = null) => {
    try {
      setLoadingAssets(true);
      if (replace) {
        setAddedIds([]);
      }

      // console.log(`>>> ... get assets`, activeSortFilter);
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

      setAssets({ ...data, results: data.results.map(mapWithToggleSelection) }, replace);
      setFirstLoaded(true);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    } finally {
      setLoadingAssets(false);
    }
  };

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
      const queryParams: {
        page: number;
        sortField: any;
        sortOrder: any;
        [key: string]: any;
      } = {
        page: replace ? 1 : nextPage,
        sortField: field,
        sortOrder: order,
      };
      if (!replace && addedIds.length > 0) {
        queryParams.excludeIds = addedIds.join(",");
      }
      if (activeSortFilter.filterFolders?.length > 0) {
        queryParams.folders = activeSortFilter.filterFolders.map((item: any) => item.value).join(",");
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

  const getSubCollectionsFolderData = async (
    replace = true,
    pageSize?: number = 10,
    nestedSubFolderId?: string = "",
  ) => {
    try {
      if (activeSortFilter.mainFilter !== "SubCollectionView") {
        return;
      }
      const { field, order } = activeSortFilter.sort;
      const { next } = subFoldersViewList;
      const queryParams = {
        page: replace ? 1 : next,
        pageSize: pageSize,
        sortField: field,
        sortOrder: order,
      };
      const { data: subFolders } = await folderApi.getSubFolders(
        {
          ...queryParams,
          ...(term && { term }),
        },
        nestedSubFolderId ? nestedSubFolderId : activeSubFolders,
      );
      setSubFoldersViewList(subFolders, replace);
    } catch (err) {
      // TODO: Handle Error
      console.log(err);
    }
  };

  const getSubCollectionsAssetData = async (replace = true, showAllAssets: boolean = false) => {
    try {
      if (activeSortFilter.mainFilter !== "SubCollectionView") {
        return;
      }
      const { results: SubFolders } = subFoldersViewList;
      const { next } = subFoldersAssetsViewList;
      const { data: subFolderAssets } = await assetApi.getAssets({
        ...getAssetsFilters({
          replace,
          activeFolder: activeSubFolders,
          addedIds: [],
          nextPage: next,
          userFilterObject: activeSortFilter,
        }),
        // sort: sortingString,
        ...(term && { term }),
        ...getAssetsSort(activeSortFilter),
        ...searchFilterParams, //commented because we don't search in case of sub-collection
        showAllAssets: showAllAssets,
      });
      setSubFoldersAssetsViewList(subFolderAssets, replace);
    } catch (err) {
      // TODO: Handle Error
      console.log(err);
    }
  };

  const toggleSelected = async (id: string) => {
    if (activeMode === "assets") {
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === id
      );

      setAssets((prev) => update(prev, {
        [assetIndex]: {
          isSelected: { $set: !prev[assetIndex].isSelected },
        },
      }),
      );
    } else if (activeMode === "folders") {
      const folderIndex = folders.findIndex((folder) => folder.id === id);
      if (folders[folderIndex].isSelected) {
        selectAllFolders(false);
      }
      setFolders(
        update(folders, {
          [folderIndex]: {
            isSelected: { $set: !folders[folderIndex].isSelected },
          },
        }),
      );
    } else if (activeMode === "SubCollectionView") {
      const assetIndex = subFoldersAssetsViewList.results.findIndex((assetItem) => assetItem.asset.id === id);
      const folderIndex = subFoldersViewList.results.findIndex((folder) => folder.id === id);
      if (folderIndex !== -1) {
        if (subFoldersViewList.results[folderIndex]?.isSelected) {
          setSelectedAllSubFoldersAndAssets(false);
        }
        setSelectedAllSubAssets(false);
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: update(subFoldersViewList.results, {
            [folderIndex]: {
              isSelected: {
                $set: !subFoldersViewList.results[folderIndex]?.isSelected,
              },
            },
          }),
        });
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: subFoldersAssetsViewList.results.map((asset) => ({
            ...asset,
            isSelected: false,
          })),
        });
      }
      if (assetIndex !== -1) {
        setSelectedAllSubFoldersAndAssets(false);
        if (subFoldersAssetsViewList.results[assetIndex]?.isSelected) {
          setSelectedAllSubAssets(false);
        }
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: update(subFoldersAssetsViewList.results, {
            [assetIndex]: {
              isSelected: {
                $set: !subFoldersAssetsViewList.results[assetIndex]?.isSelected,
              },
            },
          }),
        });
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: subFoldersViewList.results.map((folder: any) => ({
            ...folder,
            isSelected: false,
          })),
        });
      }
    }
  };

  const selectAll = () => {
    if (activeMode === "assets") {
      // Mark select all
      selectAllAssets();
      setAssets(assets.map((assetItem) => ({ ...assetItem, isSelected: true })));
    } else if (activeMode === "folders") {
      selectAllFolders();
      setFolders(folders.map((folder) => ({ ...folder, isSelected: true })));
    } else if (activeMode === "SubCollectionView") {
      if (subFoldersAssetsViewList.results.length > 0) {
        setSelectedAllSubAssets(true);
        setSelectedAllSubFoldersAndAssets(false);

        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: subFoldersAssetsViewList.results.map((asset: any) => ({ ...asset, isSelected: true })),
        });
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: subFoldersViewList.results.map((folder: any) => ({
            ...folder,
            isSelected: false,
          })),
        });
      } else {
        setSelectedAllSubFoldersAndAssets(true);
        setSelectedAllSubAssets(false);
        // For selecting the folders only subcollection view
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: subFoldersViewList.results.map((folder: any) => ({
            ...folder,
            isSelected: true,
          })),
        });
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: subFoldersAssetsViewList.results.map((asset: any) => ({
            ...asset,
            isSelected: false,
          })),
        });
      }

      // For selecting the assets only subcollection view
      // setSubFoldersAssetsViewList({
      //   ...subFoldersAssetsViewList, results: subFoldersAssetsViewList.results.map((asset) => ({ ...asset, isSelected: true }))
      // })
    }
  };

  const mapWithToggleSelection = (asset) => ({
    ...asset,
    isSelected: selectedAllAssets,
    toggleSelected,
  });

  const selectedAssets = assets.filter((asset) => asset.isSelected);

  const selectedFolders = folders.filter((folder) => folder.isSelected);

  const selectedSubFoldersAndAssets = {
    assets: subFoldersAssetsViewList?.results?.filter((asset) => asset.isSelected) || [],
    folders: subFoldersViewList?.results?.filter((folder) => folder.isSelected) || [],
  };

  const viewFolder = async (id: string, subCollection: boolean, nestedSubFolderId = "", folderName = "") => {
    if (!subCollection) {
      if (nestedSubFolderId) {
        await getSubCollectionsFolderData(true, 50, nestedSubFolderId);
      }
      setActiveFolder(id);
      setActiveSubFolders("");
      setHeaderName(
        folderName ? folderName : subFoldersViewList.results.find((folder: any) => folder.id === id)?.name || "",
      );
    } else {
      setActiveFolder("");
      setActiveSubFolders(id);
      setHeaderName(folderName ? folderName : folders.find((folder: any) => folder.id === id)?.name || "");
    }
  };

  const deleteFolder = async (id) => {
    try {
      await folderApi.deleteFolder(id);
      if (activeMode === "SubCollectionView") {
        const folderIndex = subFoldersViewList?.results?.findIndex((folder) => folder.id === id);
        if (folderIndex !== -1) {
          setSubFoldersViewList({
            ...subFoldersViewList,
            results: update(subFoldersViewList?.results, {
              $splice: [[folderIndex, 1]],
            }),
            total: subFoldersViewList.total > 0 ? subFoldersViewList.total - 1 : 0,
          });
        }
        appendNewSubSidenavFolders([], activeSubFolders, true, id);
        setListUpdateFlag(true);
        toastUtils.success("Subcollection deleted successfully");
      } else {
        const modFolderIndex = folders.findIndex((folder: any) => folder.id === id);
        setFolders(
          update(folders, {
            $splice: [[modFolderIndex, 1]],
          }),
        );
        setSidenavFolderList({
          results: [...sidenavFolderList.filter((folder: any) => folder.id !== id)],
          total: sidenavTotalCollectionCount - 1,
        });

        toastUtils.success("Collection deleted successfully");
      }
    } catch (err) {
      console.log({ err });

      toastUtils.error(err?.response?.data?.message || "Something went wrong please try again later");
    }
  };

  const closeSearchOverlay = () => {
    getAssets();
    setActiveSearchOverlay(false);
  };

  const confirmFolderRename = async (newValue) => {
    try {
      await folderApi.updateFolder(activeFolder, { name: newValue });
      const modFolderIndex = folders.findIndex((folder) => folder.id === activeFolder);
      setFolders(
        update(folders, {
          [modFolderIndex]: {
            name: { $set: newValue },
          },
        }),
      );
      toastUtils.success("Collection name updated");
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not update collection name");
    }
  };

  const loadMore = () => {
    if (activeMode === "assets") {
      getAssets(false);
    } else {
      getFolders(false);
    }
  };

  useEffect(() => {
    getSubCollectionsAssetData();
  }, [searchFilterParams]);

  return (
    <>
      {(activeMode === "assets"
        ? selectedAssets.length
        : activeMode === "folders"
          ? selectedFolders.length
          : selectedSubFoldersAndAssets.folders.length || selectedSubFoldersAndAssets.assets.length) > 0 && (
          <AssetHeaderOps
            isUnarchive={activeSortFilter.mainFilter === "archived"}
            isFolder={activeMode === "folders"}
            deletedAssets={false}
            activeMode={activeMode}
            selectedFolders={selectedFolders}
            selectedSubFoldersAndAssets={selectedSubFoldersAndAssets}
          />
        )}
      {hasPermission([ASSET_ACCESS]) || hasPermission([ASSET_UPLOAD_APPROVAL]) ? (
        <>
          <main className={`${styles.container}`}>
            <div className={styles.innnerContainer}>
              {sidebarOpen ? (
                <div className={styles.newsidenav}>
                  <NestedSidenav viewFolder={viewFolder} />
                </div>
              ) : null}
              <div className={`${sidebarOpen ? styles["rightSide"] : styles["rightSideToggle"]}`}>
                <div className="position-relative">
                  {advancedConfig.set && hasPermission([ASSET_ACCESS]) && (
                    <TopBar
                      activeFolder={activeFolder}
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
                      deletedAssets={false}
                      activeSearchOverlay={activeSearchOverlay}
                      closeSearchOverlay={closeSearchOverlay}
                      setDetailOverlayId={setDetailOverlayId}
                      setCurrentViewAsset={setCurrentViewAsset}
                      activeMode={activeMode}
                      isFolder={activeSortFilter?.mainFilter === "folders"}
                    />
                  )}
                </div>
                <div
                  className={`${sidebarOpen ? styles["grid-wrapper-web"] : styles["grid-wrapper"]} ${activeFolder && styles["active-breadcrumb-item"]
                    }`}
                >
                  <DropzoneProvider>
                    {advancedConfig.set && (
                      <AssetGrid
                        activeFolder={activeFolder}
                        getFolders={getFolders}
                        getSubFolders={getSubCollectionsFolderData}
                        getSubCollectionsAssetData={getSubCollectionsAssetData}
                        activeView={activeView}
                        activeSortFilter={activeSortFilter}
                        onFilesDataGet={onFilesDataGet}
                        toggleSelected={toggleSelected}
                        mode={activeMode}
                        viewFolder={viewFolder}
                        deleteFolder={deleteFolder}
                        loadMore={loadMore}
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
              </div>
            </div>
          </main>
          <AssetOps />
        </>
      ) : (
        <NoPermissionNotice />
      )}
      <RenameModal
        closeModal={() => setRenameModalOpen(false)}
        modalIsOpen={renameModalOpen}
        renameConfirm={confirmFolderRename}
        type={"Folder"}
        initialValue={activeFolder && folders.find((folder) => folder.id === activeFolder)?.name}
      />
      {uploadDetailOverlay && (
        <UploadStatusOverlayAssets
          closeOverlay={() => {
            setUploadDetailOverlay(false);
          }}
        />
      )}
      {currentViewAsset && (
        <DetailOverlay
          initiaParams={{ side: "detail" }}
          asset={currentViewAsset.asset}
          realUrl={currentViewAsset?.realUrl}
          thumbailUrl={currentViewAsset?.thumbailUrl}
          isShare={false}
          closeOverlay={(assetData) => {
            setDetailOverlayId(undefined);
            setCurrentViewAsset(assetData);
          }}
          outsideDetailOverlay={true}
        />
      )}
      {showOverlayLoader && (
        <SpinnerOverlay text="Account updating...this process might take a few seconds. Thank you for your patience." />
      )}
    </>
  );
};

export default AssetsLibrary;