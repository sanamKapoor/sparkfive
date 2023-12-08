import update from "immutability-helper";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AssetContext, FilterContext, LoadingContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import projectApi from "../../../server-api/project";
import taskApi from "../../../server-api/task";
import { getAssetsFilters } from "../../../utils/asset";
import toastUtils from "../../../utils/toast";

// Components
import BulkEditOverlay from "../bulk-edit-overlay";
import ConfirmModal from "../modals/confirm-modal";
import CopyModal from "../modals/copy-modal";
import MoveModal from "../modals/move-modal";
import MoveReplaceModal from "../modals/move-replace-modal";
import ShareCollectionModal from "../modals/share-collection-modal";
import ShareModal from "../modals/share-modal";

export default ({ getAssets }) => {
  const {
    assets,
    setAssets,
    folders,
    setFolders,
    activeOperation,
    setActiveOperation,
    operationAsset,
    operationAssets,
    setOperationAsset,
    operationFolder,
    setOperationFolder,
    activeFolder,
    activePageMode,
    setLoadingAssets,
    selectedAllAssets,
    selectedAllFolders,
    completedAssets,
    setCompletedAssets,
    totalAssets,
    subFoldersViewList,
    subFoldersAssetsViewList,
    setSubFoldersAssetsViewList,
    selectedAllSubFoldersAndAssets,
    activeSubFolders,
    setSubFoldersViewList,
    setSidenavFolderList,
    sidenavFolderList,
    setListUpdateFlag,
    selectedAllSubAssets,
    setSelectedAllSubAssets,
    setNeedsFetch
  } = useContext(AssetContext);

  const { setIsLoading } = useContext(LoadingContext);

  const [completedSubAssets, setCompletedSubAssets] = useState([])
  const { loadFolders, activeSortFilter, term, searchFilterParams } =
    useContext(FilterContext);

  // We need this for all selected asset ignore pagination
  const unSelectedAssets = selectedAllAssets
    ? assets.filter((asset) => !asset.isSelected)
    : [];
  const unSelectedSubAssets = selectedAllSubAssets
    ? subFoldersAssetsViewList?.results.filter((asset) => !asset.isSelected)
    : [];
  const router = useRouter();

  const [currentItem, setCurrentItem] = useState({
    type: "",
    id: "",
  });
  const selectedAssets = assets.filter((asset) => asset.isSelected);
  const selectedFolders = folders.filter((folder) => folder.isSelected);
  const selectedSubFolderAssetId = subFoldersAssetsViewList?.results?.filter(
    (asset) => asset.isSelected
  ) || []
  const selectedSubFoldersViewListId = subFoldersViewList?.results?.filter((folder) => folder.isSelected) || [];

  useEffect(() => {
    if (
      activeOperation === "move" ||
      activeOperation === "copy" ||
      activeOperation === "moveReplace"
    ) {
      getFolders(true);
    }

    // Edit assets in collections
    if (activeOperation === "edit" && selectedFolders.length > 0 && activeSortFilter?.mainFilter !== "SubCollectionView") {
      // Get all assets in collections and set it as selected
      getSelectedFolderAssets();
    }

    // Edit assets including hidden pagination items
    if (activeOperation === "edit" && selectedAllAssets && activeSortFilter?.mainFilter !== "SubCollectionView") {
      //  Get all assets without pagination
      getSelectedAssets(unSelectedAssets.map((data) => data.asset.id));
    }
    if (activeOperation === "edit" && selectedAllSubAssets && activeSortFilter?.mainFilter === "SubCollectionView") {
      //  Get all assets without pagination
      getSelectedAssets(unSelectedSubAssets.map((data) => data.asset.id));
    }
  }, [activeOperation]);

  useEffect(() => {
    const { asPath } = router;
    if (asPath.indexOf("project") !== -1) {
      setCurrentItem({
        type: "project",
        id: asPath.split("/")[3],
      });
    } else if (asPath.indexOf("task") !== -1) {
      setCurrentItem({
        type: "task",
        id: asPath.split("/")[3],
      });
    } else {
      setCurrentItem({
        type: "",
        id: "",
      });
    }
  }, [router.asPath]);

  const getSelectedFolderAssets = async () => {
    try {
      setLoadingAssets(true);
      const { data } = await assetApi.getAssets({
        ...getAssetsFilters({
          replace: true,
          addedIds: [],
          nextPage: 1,
          userFilterObject: {
            filterFolders: selectedFolders.map((folder) => ({
              value: folder.id,
            })),
          },
        }),
        complete: "1",
      });
      setAssets(
        {
          ...data,
          results: data.results.map((asset) => ({
            ...asset,
            isSelected: true,
          })),
        },
        true
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAssets(false);
    }
  };

  const getSelectedAssets = async (excludeIds = []) => {
    try {
      setLoadingAssets(true);
      let filters = {
        ...getAssetsFilters({
          replace: false,
          activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
          addedIds: excludeIds,
          nextPage: 1,
          userFilterObject: activeSortFilter,
        }),
        complete: "1",
      };
      if (term) {
        // @ts-ignore
        filters.term = term;
      }
      const { data } = await assetApi.getAssets(filters);
      selectedAllAssets ?
        setCompletedAssets(
          {
            ...data,
            results: data?.results.map((asset) => ({
              ...asset,
              isSelected: true,
            })),
          },
          true
        )
        : setCompletedSubAssets(data?.results.map((asset) => ({
          ...asset,
          isSelected: true,
        })))
        ;
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    } finally {
      setLoadingAssets(false);
    }
  };

  const getFolders = async (ignoreSetTotalItems) => {
    try {
      const { data } = await folderApi.getFolders();
      setFolders(data, true, ignoreSetTotalItems);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    }
  };

  const closeModalAndClearOpAsset = () => {
    setActiveOperation("");
    setOperationAsset(null);
    setOperationFolder(null);
  };

  const moveAssets = async (selectedFolder) => {
    try {
      setIsLoading(true);
      let updateAssets;
      let filters = {};

      let moveAssets: any = selectedAssets;

      if (activeSortFilter?.mainFilter === "SubCollectionView" && !operationAsset) {
        moveAssets = selectedSubFolderAssetId
      }

      if (!operationAsset) {
        updateAssets = moveAssets.map((selectedAsset) => ({
          id: selectedAsset.asset.id,
          userId: selectedAsset.asset.userId,
          changes: { folderId: selectedFolder },
        }));
      } else {
        updateAssets = [
          {
            id: operationAsset.asset.id,
            userId: operationAsset.asset.userId,
            changes: { folderId: selectedFolder },
          },
        ];
      }

      // Select all assets without pagination
      if (selectedAllAssets || selectedAllSubAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      }

      await assetApi.updateMultiple(updateAssets, filters);
      setListUpdateFlag(true);
      removeSelectedFromList();
      closeModalAndClearOpAsset();
      if (activeFolder && activeFolder !== selectedFolder) {
        removeSelectedFromList();
      }
      setIsLoading(false);
      toastUtils.success("Assets moved successfully");
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not move assets, please try again later.");
    }
  };

  const moveReplaceAssets = async (selectedFolder) => {
    try {
      let copyAssetIds;
      let filters = {};
      if (activeSortFilter?.mainFilter === "SubCollectionView" && !operationAsset) {
        copyAssetIds = selectedSubFolderAssetId.map(
          (selectedAsset) => selectedAsset.asset.id
        )
      } else if (!operationAsset) {
        copyAssetIds = selectedAssets.map(
          (selectedAsset) => selectedAsset.asset.id
        );
      } else {
        copyAssetIds = [operationAsset.asset.id];
      }

      // Select all assets without pagination
      if (selectedAllAssets || selectedAllSubAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      }

      const { data } = await assetApi.moveAssets(
        { idList: copyAssetIds, folderId: selectedFolder },
        filters
      );
      setListUpdateFlag(true);
      removeSelectedFromList();
      closeModalAndClearOpAsset();
      toastUtils.success("Assets moved successfully");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 402)
        toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not move assets, please try again later.");
    }
  };

  const archiveAssets = async () => {
    modifyAssetsStage(
      "archived",
      "Assets archived successfully",
      "Could not archive assets, please try again later."
    );
  };

  const unarchiveAssets = async () => {
    modifyAssetsStage(
      "draft",
      "Assets unarchived successfully",
      "Could not unarchive assets, please try again later."
    );
  };

  const modifyAssetsStage = async (stage, successMessage, errMessage) => {
    try {
      let updateAssets;
      let filters = {};
      if (activeSortFilter?.mainFilter === "SubCollectionView" && !operationAsset) {
        updateAssets = selectedSubFolderAssetId.map((assetItem) => ({
          id: assetItem.asset.id,
          changes: { stage },
        }));
      } else if (!operationAsset) {
        updateAssets = selectedAssets.map((assetItem) => ({
          id: assetItem.asset.id,
          changes: { stage },
        }));
      } else {
        updateAssets = [
          {
            id: operationAsset.asset.id,
            changes: { stage },
          },
        ];
      }

      // Select all assets without pagination
      if (selectedAllAssets || selectedAllSubAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      }

      await assetApi.updateMultiple(updateAssets, filters);
      removeSelectedFromList();
      closeModalAndClearOpAsset();
      toastUtils.success(successMessage);
    } catch (err) {
      console.log(err);
      toastUtils.error(errMessage);
    }
  };

  const deleteSelectedAssets = async () => {
    try {
      let filters = {};
      if (selectedAllAssets) {
        filters = {
          selectedAll: "1",
          deletedAssets: true,
        };
      }

      // Select all assets without pagination
      if (selectedAssets.length > 0) {
        await assetApi.deleteMultipleAssets({
          assetIds: selectedAssets.map((assetItem) => assetItem.asset.id),
          filters,
        });
        const newAssets = assets.filter((existingAsset) => {
          const searchedAssetIndex = selectedAssets.findIndex(
            (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
          );
          return searchedAssetIndex === -1;
        });
        setAssets(newAssets);
      } else {
        await assetApi.deleteAsset(operationAsset.asset.id, filters);
        const assetIndex = assets.findIndex(
          (assetItem) => assetItem.asset.id === operationAsset.asset.id
        );
        if (assetIndex !== -1)
          setAssets(
            update(assets, {
              $splice: [[assetIndex, 1]],
            })
          );
      }

      closeModalAndClearOpAsset();
      toastUtils.success("Assets deleted successfully");
      getAssets();
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not delete assets, please try again later.");
    }
  };

  const updateAssetStatus = async () => {
    try {
      let updateAssets;
      let filters = {};
      let deletedAssets: any = selectedAssets;

      if (activeSortFilter?.mainFilter === "SubCollectionView") {
        deletedAssets = selectedSubFolderAssetId
      }

      if (deletedAssets.length > 1) {
        updateAssets = deletedAssets.map((assetItem) => ({
          id: assetItem.asset.id,
          changes: {
            status: "deleted",
            stage: "draft",
            deletedAt: new Date().toISOString(),
          },
        }));
      } else {
        updateAssets = {
          id: deletedAssets[0].asset.id,
          updateData: {
            status: "deleted",
            stage: "draft",
            deletedAt: new Date().toISOString(),
          },
        };
      }

      // Select all assets without pagination
      if (selectedAllAssets || selectedAllSubAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
            addedIds: [],
            nextPage: 2,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      }

      if (updateAssets.length > 1) {
        await assetApi.updateMultiple(updateAssets, filters);
        if (activeSortFilter?.mainFilter === "SubCollectionView") {
          const newAssets = subFoldersAssetsViewList.results.filter((existingAsset) => {
            const searchedAssetIndex = deletedAssets.findIndex(
              (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
            );
            return searchedAssetIndex === -1;
          });

          setSubFoldersAssetsViewList({
            ...subFoldersAssetsViewList,
            results: [...newAssets]
          });

        } else {
          const newAssets = assets.filter((existingAsset) => {
            const searchedAssetIndex = deletedAssets.findIndex(
              (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
            );
            return searchedAssetIndex === -1;
          });
          setAssets(newAssets)
        }
      } else {
        await assetApi.updateAsset(updateAssets.id, {
          updateData: updateAssets.updateData,
        });
        if (activeSortFilter?.mainFilter === "SubCollectionView") {

          const assetIndex = subFoldersAssetsViewList.results.findIndex(
            (assetItem) => assetItem.asset.id === updateAssets.id
          );

          if (assetIndex !== -1)
            setSubFoldersAssetsViewList({
              ...subFoldersAssetsViewList,
              results: update(subFoldersAssetsViewList.results, {
                $splice: [[assetIndex, 1]],
              }),
            });
        } else {
          const assetIndex = assets.findIndex(
            (assetItem) => assetItem.asset.id === updateAssets.id
          );
          if (assetIndex !== -1)
            setAssets(
              update(assets, {
                $splice: [[assetIndex, 1]],
              })
            );
        }

      }

      closeModalAndClearOpAsset();
      toastUtils.success("Assets deleted successfully");
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not delete assets, please try again later.");
    }
  };

  const shareAssets = async (
    recipients,
    message,
    sharedLinkData,
    closeAfterDone = true,
    showStatusToast = true
  ) => {
    return new Promise<any>(async (resolve) => {
      try {
        let assetIds;
        let filters = {};
        if (operationAsset) {
          assetIds = operationAsset.asset.id;
        } else if (operationFolder) {
          assetIds = operationFolder.assets.map((asset) => asset.id).join(",");
        } else if (operationAssets.length > 0) {
          assetIds = operationAssets.map((item) => item.asset.id).join(",");
        } else {
          assetIds = selectedAssets
            .map((assetItem) => assetItem.asset.id)
            .join(",");
        }

        // Select all assets without pagination
        if (selectedAllAssets || selectedAllSubAssets) {
          filters = {
            ...getAssetsFilters({
              replace: false,
              activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
              addedIds: [],
              nextPage: 1,
              userFilterObject: activeSortFilter,
            }),
            selectedAll: "1",
          };

          if (term) {
            // @ts-ignore
            filters.term = term;
          }

          filters.advSearchFrom = searchFilterParams?.advSearchFrom;

          // @ts-ignore
          delete filters.page;
        }

        const result = await assetApi.generateAndSendShareUrl(
          {
            recipients,
            message,
            ...sharedLinkData,
            expiredPeriod: sharedLinkData.expiredPeriod?.value || "",
            assetIds,
          },
          filters
        );

        if (showStatusToast) {
          toastUtils.success("Assets shared succesfully");
        }

        if (closeAfterDone) {
          closeModalAndClearOpAsset();
        }

        resolve(result);
      } catch (err) {
        console.log(err);
        if (showStatusToast) {
          toastUtils.error("Could not share assets, please try again later.");
        }
        resolve({});
      }
    });
  };

  const shareCollections = async (
    recipients,
    message,
    sharedLinkData,
    closeAfterDone = true,
    showStatusToast = true
  ) => {
    return new Promise<any>(async (resolve) => {
      try {
        const result = await folderApi.generateAndSendShareUrl({
          recipients,
          message,
          ...sharedLinkData,
          expiredPeriod: sharedLinkData.expiredPeriod?.value || "",
        });

        if (showStatusToast) {
          toastUtils.success("Collections shared succesfully");
        }

        if (closeAfterDone) {
          closeModalAndClearOpAsset();
        }

        resolve(result);
      } catch (err) {
        console.log(err);
        if (showStatusToast) {
          toastUtils.error(
            "Could not share collections, please try again later."
          );
        }
        resolve({});
      }
    });
  };

  const getShareLink = async (name, subCollectionShare = false) => {
    try {
      let versionGroups;
      let assetIds;
      let filters = {};
      if (operationAsset) {
        versionGroups = operationAsset.asset.versionGroup;
        assetIds = operationAsset.asset.id;
      } else if (operationFolder) {
        versionGroups = operationFolder.assets
          .map((asset) => asset.versionGroup)
          .join(",");
        assetIds = operationFolder.assets.map((asset) => asset.id).join(",");
      } else if (operationAssets.length > 0) {
        versionGroups = operationAssets
          .map((item) => item.asset.versionGroup)
          .join(",");
        assetIds = operationAssets.map((item) => item.asset.id).join(",");
      } else if (activeSortFilter?.mainFilter === "SubCollectionView" && !operationFolder) {
        assetIds = selectedSubFolderAssetId
          .map((assetItem) => assetItem.asset.id)
          .join(",");
        versionGroups = selectedSubFolderAssetId
          .map((assetItem) => assetItem.asset.versionGroup)
          .join(",");
      } else {
        versionGroups = selectedAssets
          .map((assetItem) => assetItem.asset.versionGroup)
          .join(",");

        assetIds = selectedAssets
          .map((assetItem) => assetItem.asset.id)
          .join(",");
      }

      // Select all assets without pagination
      if (selectedAllAssets || selectedAllSubAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }

        // @ts-ignore
        delete filters.page;
      }
      filters["name"] = name;

      const getCustomFields = (filters) => {
        let fields = "";
        Object.keys(filters).map((key) => {
          if (key.includes("custom-p")) {
            if (fields) {
              fields = `${fields},${filters[key]}`;
            } else {
              fields = `${filters[key]}`;
            }
          }
        });

        return fields;
      };

      const customFields = getCustomFields(filters);

      const params = {
        versionGroups,
        assetIds,
      };

      // Create sub collection from tags/custom fields (only create sub colleciton if all filtered assets selected)
      if (
        filters["folderId"] &&
        (customFields || filters["tags"]) &&
        filters["selectedAll"] &&
        subCollectionShare
      ) {
        params["customFields"] = customFields;
        params["folderId"] = filters["folderId"];
        params["tags"] = filters["tags"];

        filters["subCollection"] = "1";
      }

      return await assetApi.getShareUrl(params, filters);
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  const getShareCollectionLink = async (name) => {
    try {
      let folderIds;
      let filters = {};

      if (operationFolder) {
        folderIds = operationFolder.id;
      } else if (activeSortFilter?.mainFilter === "SubCollectionView" && !operationFolder) {
        folderIds = selectedSubFoldersViewListId.map((item) => item.id).join(",")
      } else {
        folderIds = folders
          .filter((folder) => folder.isSelected)
          .map((item) => item.id)
          .join(",");
      }

      // Select all assets without pagination
      if (selectedAllFolders || selectedAllSubFoldersAndAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      }
      if (selectedAllSubFoldersAndAssets && activeSortFilter?.mainFilter === "SubCollectionView") {
        filters["parent_id"] = activeSubFolders;
      }
      filters["name"] = name;
      return await folderApi.getShareUrl(
        {
          folderIds,
        },
        filters
      );
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  const getSharedCollectionCount = () => {
    let count = 1;
    if (activeSortFilter?.mainFilter === "SubCollectionView" && !operationFolder) {
      count = selectedSubFoldersViewListId?.length
    } else if (!operationFolder) {
      count = selectedFolders?.length;
    }
    return count;
  };

  const copyAssets = async (selectedFolder) => {
    try {
      setIsLoading(true);
      let copyAssetIds;
      let filters = {};

      if (activeSortFilter?.mainFilter === "SubCollectionView" && !operationAsset) {
        copyAssetIds = selectedSubFolderAssetId.map(
          (selectedAsset) => selectedAsset.asset.id
        )
      } else
        if (!operationAsset) {
          copyAssetIds = selectedAssets.map(
            (selectedAsset) => selectedAsset.asset.id
          );
        } else {
          copyAssetIds = [operationAsset.asset.id];
        }

      // Select all assets without pagination
      if (selectedAllAssets || selectedAllSubAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      }

      const { data } = await assetApi.copyAssets(
        { idList: copyAssetIds, folderId: selectedFolder },
        filters
      );
      closeModalAndClearOpAsset();
      if (!activeFolder && activePageMode === "library") {
        setAssets(update(assets, { $unshift: data }));
      }
      setListUpdateFlag(true);
      setIsLoading(false);
      toastUtils.success("Assets copied successfully");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 402)
        toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not copy assets, please try again later.");
    }
  };

  const createFolder = async (newFolderName) => {
    try {
      const { data } = await folderApi.createFolder({ name: newFolderName });
      setFolders(update(folders, { $push: [data] }));
      // TODO Comment because we don't want to create collection inside the subcollection view port
      // setSubFoldersViewList({
      //   ...subFoldersViewList,
      //   results: [data, ...subFoldersViewList.results],
      // }, false);
      setSidenavFolderList({ results: [data, ...sidenavFolderList] });
      loadFolders();
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not create folder, please try again later.");
    }
  };

  const removeSelectedAssetsFromItem = async () => {
    try {
      let filters = {};
      // Select all assets without pagination
      if (selectedAllAssets) {
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: "1",
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      }

      if (!operationAsset) {
        if (currentItem.type === "project") {
          await projectApi.associateAssets(
            currentItem.id,
            { assetIds: selectedAssets.map((assetItem) => assetItem.asset.id) },
            { operation: "disassociate", ...filters }
          );
        } else if (currentItem.type === "task") {
          await taskApi.associateAssets(
            currentItem.id,
            { assetIds: selectedAssets.map((assetItem) => assetItem.asset.id) },
            { operation: "disassociate", ...filters }
          );
        }
        const newAssets = assets.filter((existingAsset) => {
          const searchedAssetIndex = selectedAssets.findIndex(
            (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
          );
          return searchedAssetIndex === -1;
        });

        setAssets(newAssets);
      } else {
        if (currentItem.type === "project") {
          await projectApi.associateAssets(
            currentItem.id,
            { assetIds: [operationAsset.asset.id] },
            { operation: "disassociate", ...filters }
          );
        } else if (currentItem.type === "task") {
          await taskApi.associateAssets(
            currentItem.id,
            { assetIds: [operationAsset.asset.id] },
            { operation: "disassociate", ...filters }
          );
        }
        const assetIndex = assets.findIndex(
          (assetItem) => assetItem.asset.id === operationAsset.asset.id
        );
        if (assetIndex !== -1)
          setAssets(
            update(assets, {
              $splice: [[assetIndex, 1]],
            })
          );
      }

      closeModalAndClearOpAsset();
      toastUtils.success("Assets removed successfully");
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not remove assets, please try again later.");
    }
  };

  const removeSelectedFromList = () => {
    if (activeSortFilter?.mainFilter === "SubCollectionView") {
      const newAssets = subFoldersAssetsViewList.results.filter((existingAsset) => {
        const searchedAssetIndex = selectedSubFolderAssetId.findIndex(
          (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
        );
        return searchedAssetIndex === -1;
      });
      setSubFoldersAssetsViewList({
        ...subFoldersAssetsViewList,
        results: [...newAssets]
      });
    } else if (!operationAsset) {
      const newAssets = assets.filter((existingAsset) => {
        const searchedAssetIndex = selectedAssets.findIndex(
          (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
        );
        return searchedAssetIndex === -1;
      });

      setAssets(newAssets);
    } else {
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === operationAsset.asset.id
      );
      setAssets(
        update(assets, {
          $splice: [[assetIndex, 1]],
        })
      );
    }
  };

  const recoverAssetStatus = async () => {
    try {
      let updateAssets;
      let filters = {};
      let recoverAssets: any = selectedAssets;

      if (activeSortFilter?.mainFilter === "SubCollectionView") {
        recoverAssets = selectedSubFolderAssetId
      }

      if (recoverAssets.length > 1) {
        updateAssets = recoverAssets.map((assetItem) => ({
          id: assetItem.asset.id,
          changes: { status: "approved", deletedAt: null },
        }));
      } else {
        updateAssets = {
          id: recoverAssets[0].asset.id,
          updateData: {
            status: "approved",
            deletedAt: null,
          },
        };
      }

      if (selectedAllAssets) {
        filters = {
          selectedAll: "1",
          deletedAssets: true,
        };
      }
      if (updateAssets.length > 1) {
        if (activeSortFilter?.mainFilter === "SubCollectionView") {
          const newAssets = subFoldersAssetsViewList.results.filter((existingAsset) => {
            const searchedAssetIndex = recoverAssets.findIndex(
              (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
            );
            return searchedAssetIndex === -1;
          });

          setSubFoldersAssetsViewList({
            ...subFoldersAssetsViewList,
            results: [...newAssets]
          });

        } else {
          await assetApi.updateMultiple(updateAssets, filters);
          const newAssets = assets.filter((existingAsset) => {
            const searchedAssetIndex = selectedAssets.findIndex(
              (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
            );
            return searchedAssetIndex === -1;
          });

          setAssets(newAssets);
        }
      } else {
        await assetApi.updateAsset(updateAssets.id, {
          updateData: updateAssets.updateData,
        });

        if (activeSortFilter?.mainFilter === "SubCollectionView") {
          const assetIndex = subFoldersAssetsViewList.results.findIndex(
            (assetItem) => assetItem.asset.id === updateAssets.id
          );
          if (assetIndex !== -1)
            setSubFoldersAssetsViewList({
              ...subFoldersAssetsViewList,
              results: update(subFoldersAssetsViewList.results, {
                $splice: [[assetIndex, 1]],
              }),
            });
        } else {
          const assetIndex = assets.findIndex(
            (assetItem) => assetItem.asset.id === updateAssets.id
          );
          if (assetIndex !== -1)
            setAssets(
              update(assets, {
                $splice: [[assetIndex, 1]],
              })
            );
        }
      }

      closeModalAndClearOpAsset();
      toastUtils.success("Assets restored successfully");
      getAssets();
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not restore assets, please try again later.");
    }
  };

  const generateAssetsThumbnails = async () => {
    try {
      let assetIds = [];
      assetIds = selectedAssets.map((assetItem) => assetItem.asset.id);
      if (selectedSubFolderAssetId.length && activeSortFilter?.mainFilter === "SubCollectionView") {
        assetIds = selectedSubFolderAssetId.map((assetItem) => assetItem.asset.id);
      }

      const { data } = await assetApi.generateThumbnails({ assetIds });
      if (activeSortFilter?.mainFilter === "SubCollectionView") {
        setNeedsFetch("SubCollectionView");
      }
      setAssets([
        ...assets.map((item) => ({
          ...item,
          thumbailUrl: data[item.asset.id]
            ? data[item.asset.id]?.thumbailUrl
            : item.thumbailUrl,
        })),
      ]);
      closeModalAndClearOpAsset();
      toastUtils.success("Thumbnails generated successfully");
    } catch (err) {
      console.log(err);
      toastUtils.error(
        "Could not proceed with generation of thumbnails, please try again later."
      );
    }
  };

  let operationLength = 0;

  // Check selected assets to be operated
  if (operationAsset) {
    operationLength = 1;
  } else if (operationFolder) {
    operationLength = operationFolder.assets.length;
  } else if (operationAssets.length > 0) {
    operationLength = operationAssets.length;
  } else {
    operationLength = (activeSortFilter?.mainFilter === "SubCollectionView" && selectedSubFolderAssetId.length > 0)
      ? selectedAllAssets ? subFoldersAssetsViewList.total : selectedSubFolderAssetId.length
      : selectedAllAssets ? totalAssets : selectedAssets.length;
  }

  return (
    <>
      <MoveReplaceModal
        modalIsOpen={activeOperation === "moveReplace"}
        closeModal={closeModalAndClearOpAsset}
        itemsAmount={operationLength}
        moveAssets={moveReplaceAssets}
        confirmText={"Move"}
        createFolder={createFolder}
      />
      <MoveModal
        modalIsOpen={activeOperation === "move"}
        closeModal={closeModalAndClearOpAsset}
        itemsAmount={operationLength}
        moveAssets={moveAssets}
        createFolder={createFolder}
      />
      <CopyModal
        modalIsOpen={activeOperation === "copy"}
        closeModal={closeModalAndClearOpAsset}
        itemsAmount={operationLength}
        moveAssets={copyAssets}
        confirmText={"Copy"}
        createFolder={createFolder}
      />
      <ShareModal
        modalIsOpen={activeOperation === "share"}
        closeModal={closeModalAndClearOpAsset}
        itemsAmount={operationLength}
        shareAssets={shareAssets}
        getShareLink={getShareLink}
      />
      <ShareModal
        modalIsOpen={activeOperation === "share-as-subcollection"}
        closeModal={closeModalAndClearOpAsset}
        itemsAmount={operationLength}
        shareAssets={shareAssets}
        getShareLink={getShareLink}
        subCollectionShare={true}
      />
      <ShareCollectionModal
        modalIsOpen={
          activeOperation === "shareCollections" ||
          activeOperation === "shareFolders"
        }
        closeModal={closeModalAndClearOpAsset}
        itemsAmount={getSharedCollectionCount()}
        shareAssets={shareCollections}
        getShareLink={getShareCollectionLink}
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "archive"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={archiveAssets}
        confirmText={"Archive"}
        message={`Archive ${operationLength} asset(s)?`}
        subText="Archiving a asset removes it from view/searches but allows you to restore it at anytime. "
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "unarchive"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={unarchiveAssets}
        confirmText={"Unarchive"}
        message={`Unarchive ${operationLength} item(s)?`}
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "delete"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={deleteSelectedAssets}
        confirmText={"Delete"}
        message={`Delete ${operationLength} asset(s)?`}
        subText="Are you sure you want to delete these assets?"
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "remove_item"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={removeSelectedAssetsFromItem}
        confirmText={"Remove"}
        message={`Remove ${operationLength} item(s) from ${currentItem.type}?`}
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "generate_thumbnails"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={generateAssetsThumbnails}
        confirmText={"Recreate"}
        message={`Recreate ${operationLength} thumbnail(s)`}
        subText="Recreate the thumbnail preview for all selected assets"
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "update"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={updateAssetStatus}
        confirmText={"Delete"}
        message={`Delete ${operationLength} asset(s)?`}
        subText="Are you sure you want to delete these assets?"
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "recover"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={recoverAssetStatus}
        confirmText={"Recover"}
        message={`Recover ${selectedAssets.length} item(s)?`}
      />
      {activeOperation === "edit" && (
        <BulkEditOverlay
          handleBackButton={() => setActiveOperation("")}
          selectedAssets={
            activeSortFilter?.mainFilter === "SubCollectionView" ?
              selectedAllSubAssets ? completedSubAssets : selectedSubFolderAssetId
              :
              selectedAllAssets ? completedAssets : selectedAssets}
        />
      )}
    </>
  );
};