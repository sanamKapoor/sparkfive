import { AssetContext, FilterContext, LoadingContext } from "../../../context";
import { useContext, useEffect, useState } from "react";
import assetApi from "../../../server-api/asset";
import projectApi from "../../../server-api/project";
import taskApi from "../../../server-api/task";
import folderApi from "../../../server-api/folder";
import toastUtils from "../../../utils/toast";
import { getAssetsFilters } from "../../../utils/asset";
import { useRouter } from "next/router";
import update from "immutability-helper";

// Components
import MoveModal from "../modals/move-modal";
import MoveReplaceModal from "../modals/move-replace-modal";
import CopyModal from "../modals/copy-modal";
import ShareModal from "../modals/share-modal";
import ShareCollectionModal from "../modals/share-collection-modal";
import ShareFolderModal from "../modals/share-folder-modal";
import ConfirmModal from "../modals/confirm-modal";
import BulkEditOverlay from "../bulk-edit-overlay";

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
    setOperationAssets,
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
  } = useContext(AssetContext);

  const { setIsLoading } = useContext(LoadingContext);

  const { loadFolders, activeSortFilter, term } = useContext(FilterContext);

  // We need this for all selected asset ignore pagination
  const unSelectedAssets = selectedAllAssets
    ? assets.filter((asset) => !asset.isSelected)
    : [];

  const router = useRouter();

  const [currentItem, setCurrentItem] = useState({
    type: "",
    id: "",
  });

  useEffect(() => {
    if (activeOperation === "move" || activeOperation === "copy" || activeOperation === "moveReplace") {
      getFolders(true);
    }

    // Edit assets in collections
    if (activeOperation === "edit" && selectedFolders.length > 0) {
      // Get all assets in collections and set it as selected
      getSelectedFolderAssets();
    }

    // Edit assets including hidden pagination items
    if (activeOperation === "edit" && selectedAllAssets) {
      //  Get all assets without pagination
      getSelectedAssets(unSelectedAssets.map((data) => data.asset.id));
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
          activeFolder,
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
      setCompletedAssets(
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

  const selectedAssets = assets.filter((asset) => asset.isSelected);
  const selectedFolders = folders.filter((folder) => folder.isSelected);

  const moveAssets = async (selectedFolder) => {
    try {
      setIsLoading(true);
      let updateAssets;
      let filters = {};
      if (!operationAsset) {
        updateAssets = selectedAssets.map((selectedAsset) => ({
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

      await assetApi.updateMultiple(updateAssets, filters);
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
      if (!operationAsset) {
        copyAssetIds = selectedAssets.map(
            (selectedAsset) => selectedAsset.asset.id
        );
      } else {
        copyAssetIds = [operationAsset.asset.id];
      }

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

      const { data } = await assetApi.moveAssets(
          { idList: copyAssetIds, folderId: selectedFolder },
          filters
      );
      closeModalAndClearOpAsset();
      toastUtils.success("Assets moved successfully");
      // if (!activeFolder && activePageMode === "library") {
      //   setAssets(update(assets, { $unshift: data }));
      // }
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
      if (!operationAsset) {
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
      if (selectedAssets.length > 1) {
        updateAssets = selectedAssets.map((assetItem) => ({
          id: assetItem.asset.id,
          changes: {
            status: "deleted",
            stage: "draft",
            deletedAt: new Date().toISOString(),
          },
        }));
      } else {
        updateAssets = {
          id: selectedAssets[0].asset.id,
          updateData: {
            status: "deleted",
            stage: "draft",
            deletedAt: new Date().toISOString(),
          },
        };
      }

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

      if (updateAssets.length > 1) {
        await assetApi.updateMultiple(updateAssets, filters);
        const newAssets = assets.filter((existingAsset) => {
          const searchedAssetIndex = selectedAssets.findIndex(
            (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
          );
          return searchedAssetIndex === -1;
        });

        setAssets(newAssets);
      } else {
        await assetApi.updateAsset(updateAssets.id, {
          updateData: updateAssets.updateData,
        });
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
        } else if (operationAssets.length > 0){
          assetIds = operationAssets.map((item) => item.asset.id).join(",");
        } else {
          assetIds = selectedAssets
            .map((assetItem) => assetItem.asset.id)
            .join(",");
        }

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

        const result = await folderApi.generateAndSendShareUrl(
            {
              recipients,
              message,
              ...sharedLinkData,
              expiredPeriod: sharedLinkData.expiredPeriod?.value || "",
            },
        );

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
          toastUtils.error("Could not share collections, please try again later.");
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
        versionGroups = operationFolder.assets.map((asset) => asset.versionGroup).join(",");
        assetIds = operationFolder.assets.map((asset) => asset.id).join(",");
      } else if(operationAssets.length > 0){
        versionGroups = operationAssets.map((item) => item.asset.versionGroup).join(",");
        assetIds = operationAssets.map((item) => item.asset.id).join(",");
      } else{
        versionGroups = selectedAssets
          .map((assetItem) => assetItem.asset.versionGroup)
          .join(",");

        assetIds = selectedAssets
            .map((assetItem) => assetItem.asset.id)
            .join(",");
      }

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
      filters["name"] = name;
      console.log(filters)

      const getCustomFields = (filters) => {
        let fields = ''
        Object.keys(filters).map((key)=>{
          if(key.includes('custom-p')){
            if(fields){
              fields = `${fields},${filters[key]}`
            }else{
              fields = `${filters[key]}`
            }
          }
        })

        return fields
      }

      const customFields = getCustomFields(filters)

      const params = {
        versionGroups,
        assetIds
      }

      // Create sub collection from tags/custom fields (only create sub colleciton if all filtered assets selected)
      if(filters['folderId'] && (customFields || filters['tags']) && filters['selectedAll'] && subCollectionShare){

        params['customFields'] = customFields
        params['folderId'] = filters['folderId']
        params['tags'] = filters['tags']

        filters['subCollection'] = '1'
      }

      return await assetApi.getShareUrl(
        params,
        filters
      );
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  const getShareCollectionLink = async (name) => {
    try {
      let folderIds;
      let filters = {};

      if(operationFolder){
        folderIds = operationFolder.id
      }else{
        folderIds = folders
            .filter((folder) => folder.isSelected)
            .map((item)=>item.id)
            .join(",");
      }


      // Select all assets without pagination
      if (selectedAllFolders) {
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

  const shareFolders = async ({
    shareStatus,
    newPassword,
    customUrl,
    notificationSettings,
  }) => {
    try {
      const { data } = await folderApi.shareFolder(operationFolder.id, {
        shareStatus,
        newPassword,
        customUrl,
        notificationSettings,
      });
      toastUtils.success("Collection shared successfully");
      const folderIndex = folders.findIndex((folder) => folder.id === data.id);
      console.log(folderIndex);
      setFolders(update(folders, { [folderIndex]: { $merge: data } }));
      closeModalAndClearOpAsset();
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not share collection, please try again later.");
    }
  };

  const getSharedCollectionCount = () => {
      let count = 1;

    if(!operationFolder){
      count = folders
          .filter((folder) => folder.isSelected).length
    }

    return count

  }

  const copyAssets = async (selectedFolder) => {
    try {
      let copyAssetIds;
      let filters = {};
      if (!operationAsset) {
        copyAssetIds = selectedAssets.map(
          (selectedAsset) => selectedAsset.asset.id
        );
      } else {
        copyAssetIds = [operationAsset.asset.id];
      }

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

      const { data } = await assetApi.copyAssets(
        { idList: copyAssetIds, folderId: selectedFolder },
        filters
      );
      closeModalAndClearOpAsset();
      toastUtils.success("Assets copied successfully");
      if (!activeFolder && activePageMode === "library") {
        setAssets(update(assets, { $unshift: data }));
      }
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
    if (!operationAsset) {
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
      if (selectedAssets.length > 1) {
        updateAssets = selectedAssets.map((assetItem) => ({
          id: assetItem.asset.id,
          changes: { status: "approved", deletedAt: null },
        }));
      } else {
        updateAssets = {
          id: selectedAssets[0].asset.id,
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
        await assetApi.updateMultiple(updateAssets, filters);
        const newAssets = assets.filter((existingAsset) => {
          const searchedAssetIndex = selectedAssets.findIndex(
            (assetListItem) => existingAsset.asset.id === assetListItem.asset.id
          );
          return searchedAssetIndex === -1;
        });

        setAssets(newAssets);
      } else {
        await assetApi.updateAsset(updateAssets.id, {
          updateData: updateAssets.updateData,
        });
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
      const assetIds = selectedAssets.map((assetItem) => assetItem.asset.id);
      const { data } = await assetApi.generateThumbnails({ assetIds });

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
    operationLength = operationAssets.length
  } else {
    operationLength = selectedAllAssets ? totalAssets : selectedAssets.length;
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
          modalIsOpen={activeOperation === "shareCollections" || activeOperation === "shareFolders"}
          closeModal={closeModalAndClearOpAsset}
          itemsAmount={getSharedCollectionCount()}
          shareAssets={shareCollections}
          getShareLink={getShareCollectionLink}
      />
      {/*<ShareFolderModal*/}
      {/*  modalIsOpen={activeOperation === "shareFolders"}*/}
      {/*  closeModal={closeModalAndClearOpAsset}*/}
      {/*  folder={operationFolder}*/}
      {/*  shareAssets={shareFolders}*/}
      {/*/>*/}
      <ConfirmModal
        modalIsOpen={activeOperation === "archive"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={archiveAssets}
        confirmText={"Archive"}
        message={`Archive ${operationLength} item(s)?`}
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
        message={`Delete ${operationLength} item(s)?`}
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
        confirmText={"Recreate Thumbnail"}
        message={`Recreate thumbnails for ${operationLength} asset(s)`}
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "update"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={updateAssetStatus}
        confirmText={"Delete"}
        message={`Delete ${operationLength} item(s)?`}
      />
      <ConfirmModal
        modalIsOpen={activeOperation === "recover"}
        closeModal={closeModalAndClearOpAsset}
        confirmAction={recoverAssetStatus}
        confirmText={"Recover"}
        message={`Recover ${operationLength} item(s)?`}
      />
      {activeOperation === "edit" && (
        <BulkEditOverlay
          handleBackButton={() => setActiveOperation("")}
          selectedAssets={selectedAllAssets ? completedAssets : selectedAssets}
        />
      )}
    </>
  );
};
