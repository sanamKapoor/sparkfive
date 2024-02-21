import { boxesIntersect, useSelectionContainer } from '@air/react-drag-to-select';
import copyClipboard from 'copy-to-clipboard';
import update from 'immutability-helper';
import fileDownload from 'js-file-download';
import { CSSProperties, useContext, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { Waypoint } from 'react-waypoint';

import { sizeToZipDownload } from '../../../constants/download';
import { ASSET_ACCESS, ASSET_UPLOAD_APPROVAL } from '../../../constants/permissions';
import { AssetContext, FilterContext, LoadingContext, UserContext } from '../../../context';
import useSortedAssets from '../../../hooks/use-sorted-assets';
import assetApi from '../../../server-api/asset';
import folderApi from '../../../server-api/folder';
import shareApi from '../../../server-api/share-collection';
import { checkIfUserCanEditThumbnail } from '../../../utils/asset';
import downloadUtils from '../../../utils/download';
import toastUtils from '../../../utils/toast';
import urlUtils from '../../../utils/url';
import SubCollection from '../../Sub-collection/sub-collection';
import Button from '../buttons/button';
import FilterView from '../filter-view';
import FolderGridItem from '../folder/folder-grid-item';
import useDropzone from '../misc/dropzone';
import ChangeThumbnail from '../modals/change-thumnail-modal';
import ConfirmModal from '../modals/confirm-modal';
import SpinnerOverlay from '../spinners/spinner-overlay';
import AssetAddition from './asset-addition';
import styles from './asset-grid.module.css';
import AssetTableHeader from './Asset-table-header/asset-table-header';
import AssetThumbail from './asset-thumbail';
import AssetUpload from './asset-upload';
import DetailOverlay from './detail-overlay';
import FolderTableHeader from './Folder-table-header/folder-table-header';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

// Components
const AssetGrid = ({
  activeView = "grid",
  isShare = false,
  onFilesDataGet = (files: any) => { },
  toggleSelected,
  mode = "assets",
  deleteFolder = (id: string) => { },
  itemSize = "regular",
  activeFolder = "",
  type = "",
  itemId = "",
  getFolders = () => { },
  loadMore = () => { },
  viewFolder = (id: string) => { },
  sharePath = "",
  onCloseDetailOverlay = (assetData) => { },
  setWidthCard,
  widthCard,
  getSubCollectionsAssetData,
  getSubFolders,
}) => {
  let isDragging;
  if (!isShare) isDragging = useDropzone();

  const {
    assets,
    setAssets,
    setActiveOperation,
    setOperationAsset,
    nextPage,
    setOperationFolder,
    folders,
    updateDownloadingStatus,
    activeSubFolders,
    subFoldersAssetsViewList,
    setSubFoldersAssetsViewList,
    setListUpdateFlag,
    sidebarOpen,
    setFolders,
    selectAllFolders,
    selectAllAssets,
    setSelectedAllSubFoldersAndAssets,
    setSelectedAllSubAssets,
    setSubFoldersViewList,
    subFoldersViewList: { results, next, total },
    setAssetDragFlag,
    setAssetDragId,
    setAssetDragType,
    setDroppableId,
    setCollectionDragFlag,
    setCollectionDragId,
    setCollectionParentDragId
  } = useContext(AssetContext);

  const { advancedConfig, hasPermission, user } = useContext(UserContext);
  const { activeSortFilter } = useContext(FilterContext);
  const { setIsLoading } = useContext(LoadingContext);

  // Ref values
  const childFolder = useRef("")
  const parentFolder = useRef("")

  const ref = useRef(null);
  const selectionArea = useRef(null);
  const selectableItemsRef = useRef<Box[]>([]);
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);
  const elementsAssetContainerRef = useRef<HTMLDivElement | null>(null);
  const elementsFolderContainerRef = useRef<HTMLDivElement | null>(null);

  // Drag selection states
  const [loader, setLoader] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeAssetId, setActiveAssetId] = useState("");
  const [activeArchiveAsset, setActiveArchiveAsset] = useState(undefined);
  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false);
  const [initAsset, setInitAsset] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false); // Open or close modal of change thumbnail
  const [modalData, setModalData] = useState({}); // load or unload data for change thumbnail modal
  const [focusedItem, setFocusedItem] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [render, setRender] = useState(false);
  const [moveModalFlag, setMoveModalFlag] = useState(false);

  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] = useSortedAssets(assets);
  const [sortedFolders, currentSortFolderAttribute, setCurrentSortFolderAttribute] = useSortedAssets(folders);

  useEffect(() => {
    const { assetId } = urlUtils.getQueryParameters();
    if (assetId) getInitialAsset(assetId);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (ref.current) {
      setWidthCard(ref.current.clientWidth);
    }
  }, [ref.current, windowWidth]);
  // For sorting the list view the hook in folder and asset view ----

  const setSortAssetAttribute = (attribute) => {
    if (attribute === currentSortAttribute) {
      setCurrentSortAttribute("-" + attribute);
    } else {
      setCurrentSortAttribute(currentSortAttribute.startsWith("-") ? "" : attribute);
    }
  };

  const setSortFolderAttribute = (attribute) => {
    if (attribute === currentSortFolderAttribute) {
      setCurrentSortFolderAttribute("-" + attribute);
    } else {
      setCurrentSortFolderAttribute(currentSortFolderAttribute.startsWith("-") ? attribute : "-" + attribute);
    }
  };
  //----

  const getInitialAsset = async (id) => {
    try {
      let assetsApi: any = assetApi;
      const { data } = await assetsApi.getById(id);
      setInitAsset(data);
    } catch (err) {
      console.log(err);
    }
  };

  const openArchiveAsset = (asset) => {
    setActiveAssetId(asset.id);
    setActiveArchiveAsset(asset);
  };

  const openDeleteAsset = (id) => {
    setActiveAssetId(id);
    setDeleteModalOpen(true);
  };

  const deleteAsset = async (id) => {
    try {
      let assetsApi: any = assetApi;
      await assetsApi.updateAsset(id, {
        updateData: {
          status: "deleted",
          stage: "draft",
          deletedAt: new Date(new Date().toUTCString()).toISOString(),
        },
      });
      if (mode === "SubCollectionView") {
        const assetIndex = subFoldersAssetsViewList.results.findIndex((assetItem) => assetItem.asset.id === id);
        if (assetIndex !== -1) {
          setSubFoldersAssetsViewList({
            ...subFoldersAssetsViewList,
            results: update(subFoldersAssetsViewList.results, {
              $splice: [[assetIndex, 1]],
            }),
            total: subFoldersAssetsViewList.total - 1,
          });
        }
      } else {
        const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
        if (assetIndex !== -1)
          setAssets(
            update(assets, {
              $splice: [[assetIndex, 1]],
            }),
          );
      }
      setListUpdateFlag(true);
      toastUtils.success("Assets deleted successfully");
    } catch (err) {
      // TODO: Error handling
      toastUtils.error("Could not delete assets, please try again later.");
    }
  };

  const archiveAsset = async (id) => {
    const newState = activeArchiveAsset?.stage !== "archived" ? "archived" : "draft";
    try {
      let assetsApi: any = assetApi;
      await assetsApi.updateAsset(id, { updateData: { stage: newState } });
      if (mode === "SubCollectionView") {
        const assetIndex = subFoldersAssetsViewList.results.findIndex((assetItem) => assetItem.asset.id === id);
        if (assetIndex !== -1) {
          setSubFoldersAssetsViewList({
            ...subFoldersAssetsViewList,
            results: update(subFoldersAssetsViewList.results, {
              $splice: [[assetIndex, 1]],
            }),
          });
        }
      } else {
        const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
        setAssets(
          update(assets, {
            $splice: [[assetIndex, 1]],
          }),
        );
      }

      toastUtils.success(`Assets ${newState === "archived" ? "archived" : "unarchived"} successfully`);
    } catch (err) {
      // TODO: Error handling
      toastUtils.error(
        `Could not ${newState === "archived" ? "archive" : "unarchive"} assets, please try again later.`,
      );
    }
  };

  const beginAssetOperation = ({ asset = null, folder = null }, operation) => {
    if (asset) setOperationAsset(asset);
    if (folder) setOperationFolder(folder);
    setActiveOperation(operation);
  };

  //Use for upload thumbnail
  const beginChangeThumbnailOperation = (folder, operation) => {
    setModalData(folder);
    setModalOpen(true);
  };

  const deleteThumbnail = async ({ folder }, operation) => {
    setIsLoading(true);
    try {
      const data = await folderApi.updateFolder(folder.id, {
        thumbnailPath: null,
        thumbnailExtension: null,
      });
      if (data) {
        setIsLoading(false);
        if (activeSubFolders !== "") {
          await getSubFolders(true, 5);
        } else {
          getFolders();
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const downloadSelectedAssets = async (id) => {
    try {
      let payload = {
        assetIds: [id],
      };

      let totalDownloadingAssets = 1;
      let filters = {
        estimateTime: 1,
      };

      // Add sharePath property if user is at share collection page
      if (sharePath) {
        filters["sharePath"] = sharePath;
      }

      // Show processing bar
      updateDownloadingStatus("zipping", 0, totalDownloadingAssets);

      let api: any = assetApi;

      if (isShare) {
        api = shareApi;
      }

      const { data } = await api.downloadAll(payload, filters);

      // Download file to storage
      fileDownload(data, "assets.zip");

      updateDownloadingStatus("done", 0, 0);
    } catch (e) {
      updateDownloadingStatus("error", 0, 0, "Internal Server Error. Please try again.");
    }

    // downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
  };

  const downloadAsset = (assetItem) => {
    if (assetItem.asset.size >= sizeToZipDownload) {
      downloadSelectedAssets(assetItem.asset.id);
    } else {
      downloadUtils.downloadFile(assetItem.realUrl, assetItem.asset.name);
    }
  };

  const shouldShowUpload =
    (activeSearchOverlay ||
      (mode === "assets" && assets.length === 0) ||
      (mode === "folders" && folders.length === 0)) &&
    hasPermission([ASSET_ACCESS]);

  const copyShareLink = (folder) => {
    const link = folder.sharedLinks[0];
    const sharedLink = !link.team.advancedCollectionShareLink
      ? `${process.env.CLIENT_BASE_URL}/collections/${link.collectionLink}`
      : link.sharedLink;

    copyClipboard(sharedLink);
  };

  const getShareIsEnabled = ({ sharedLinks }) => {
    return sharedLinks && sharedLinks.length > 0;
  };

  const showLoadMore = (mode === "assets" && assets.length > 0) || (mode === "folders" && folders.length > 0);

  const loadingAssetsFolders =
    (assets.length > 0 && assets[assets.length - 1].isLoading) ||
    (folders.length > 0 && folders[folders.length - 1].isLoading);

  const refreshVersion = (currentVersion) => {
    if (!currentVersion) {
      return;
    }
    const assetsList = activeSortFilter.mainFilter === "SubCollectionView" ? subFoldersAssetsViewList.results : assets;

    const clonedAssets = [...assetsList].filter((asset) => !asset.isUploading);
    const versionIndex = clonedAssets.findIndex((item) => item.asset.versionGroup === currentVersion.versionGroup);

    if (versionIndex !== -1) {
      const oldAsset = clonedAssets[versionIndex];
      const newVersionAsset = {
        asset: currentVersion,
        realUrl: currentVersion.realUrl,
        thumbailUrl: currentVersion.thumbailUrl,
        toggleSelected: { ...oldAsset.toggleSelected },
      };

      clonedAssets[versionIndex] = newVersionAsset;

      if (activeSortFilter.mainFilter === "SubCollectionView") {
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: clonedAssets,
        });
      } else {
        setAssets(clonedAssets);
      }
    }
  };

  const isThumbnailNameEditable = checkIfUserCanEditThumbnail(user?.roleId);

  const handleFocusChange = (e, id) => {
    if (focusedItem === id && e.target.tagName.toLowerCase() !== "input") {
      setFocusedItem(null);
    } else if (e.target.id === "editable-preview") {
      setFocusedItem(id);
    }
  };

  //------Drag-Select-area-------Start======//
  // Set the co-ordinates for the selected area of dragged area
  const onSelectionChange = (box) => {
    if (elementsContainerRef.current && mode !== "SubCollectionView") {
      const containerRect = elementsContainerRef.current.getBoundingClientRect();
      const scrollAwareBox = {
        ...box,
        top: box.top - containerRect.top,
        left: box.left - containerRect.left,
      };
      selectionArea.current = scrollAwareBox
    } else if (elementsFolderContainerRef.current
      && subFoldersAssetsViewList.results.length === 0
    ) {
      const containerRect = elementsFolderContainerRef.current.getBoundingClientRect();
      const scrollAwareBox = {
        ...box,
        top: box.top - containerRect.top,
        left: box.left - containerRect.left
      };
      selectionArea.current = scrollAwareBox
    }
    else if (elementsAssetContainerRef.current && subFoldersAssetsViewList.results.length > 0) {
      const containerRect = elementsAssetContainerRef.current.getBoundingClientRect();
      const scrollAwareBox = {
        ...box,
        top: box.top - containerRect.top,
        left: box.left - containerRect.left
      };
      selectionArea.current = scrollAwareBox
    }
  };

  // Toggling the state for the selectionall asset and collection
  const bulkToggle = async (idsToFind) => {
    if (mode === "assets") {
      const updatedAssets = assets.map((asset, index) => {
        // Check if the object's ID is in the idsToFind array
        if (idsToFind.includes(asset.asset.id)) {
          return {
            ...asset,
            isSelected: true,
          };
        }
        return asset; // Return the original object for non-matching IDs
      });
      selectAllAssets(false);
      setAssets(updatedAssets);
    } else if (mode === "folders") {
      const updatedFolders = folders.map((folder, index) => {
        // Check if the object's ID is in the idsToFind array
        if (idsToFind.includes(folder.id)) {
          return {
            ...folder,
            isSelected: true,
          };
        }
        return folder; // Return the original object for non-matching IDs
      });
      selectAllFolders(false);
      setFolders(updatedFolders);
    }
    else if (mode === "SubCollectionView") {
      if (results.length !== 0 && subFoldersAssetsViewList.results.length === 0) {
        setSelectedAllSubFoldersAndAssets(false)
        setSelectedAllSubAssets(false)
        const updatedFolders = results.map((folder, index) => {
          // Check if the object's ID is in the idsToFind array
          if (idsToFind.includes(folder.id)) {
            return {
              ...folder,
              isSelected: true
            };
          }
          return folder; // Return the original object for non-matching IDs
        });
        setSubFoldersViewList({
          results: updatedFolders, next, total
        });
      } else if (subFoldersAssetsViewList.results.length > 0) {
        setSelectedAllSubFoldersAndAssets(false)
        setSelectedAllSubAssets(false)

        const updatedAssets = subFoldersAssetsViewList.results.map((asset, index) => {
          if (idsToFind.includes(asset.asset.id)) {
            return {
              ...asset,
              isSelected: true
            };
          }
          return asset; // Return the original object for non-matching IDs
        });
        setSubFoldersAssetsViewList({ ...subFoldersAssetsViewList, results: updatedAssets });
        setSubFoldersViewList({
          next, total,
          results: results.map((folder: any) => ({
            ...folder,
            isSelected: false,
          })),
        });
      }
    }
  }

  //library initialization
  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById("__next"),
    onSelectionChange,
    shouldStartSelecting: (target) => {
      const dragValue = target.dataset.drag
      const isDraggable = dragValue === "false" ? false : true; // Adjust the condition based on your needs
      return isDraggable;
    },
    onSelectionStart: () => { },
    onSelectionEnd: () => {
      const indexesToSelect: string[] = [];
      selectableItemsRef.current.forEach((item) => {
        if (boxesIntersect(selectionArea.current, item)) {
          indexesToSelect.push(item.id);
        }
      });
      if (indexesToSelect.length > 0) {
        bulkToggle(indexesToSelect);
      }
    },
    selectionProps: {
      style: {
        border: "2px solid darkblue",
        borderRadius: 4,
        backgroundColor: "lightskyblue",
        opacity: 0.5,
        zIndex: 9999
      },
    },
    isEnabled: true
  });

  //Handle the selctable Item for the drag selct area at initial load and load more functionality 
  useEffect(() => {
    if (elementsContainerRef.current && mode !== "SubCollectionView") {
      if (sortedFolders?.length) {
        const containerRect = elementsContainerRef.current.getBoundingClientRect();
        const liElements = elementsContainerRef.current.querySelectorAll('li');
        selectableItemsRef.current = new Array();
        Array.from(liElements).forEach((item) => {
          const { left, top, width, height } = item.getBoundingClientRect();
          const adjustedTop = top - containerRect.top;
          const adjustedLeft = left - containerRect.left;
          if (item.id !== "") selectableItemsRef.current.push({
            left: adjustedLeft,
            top: adjustedTop,
            width,
            height,
            id: item.id,
          })
        });
      } else if (sortedAssets?.length) {
        const containerRect = elementsContainerRef.current.getBoundingClientRect();
        const liElements = elementsContainerRef.current.querySelectorAll('li');
        selectableItemsRef.current = new Array();
        Array.from(liElements).forEach((item) => {
          const { left, top, width, height } = item.getBoundingClientRect();
          const adjustedTop = top - containerRect.top;
          const adjustedLeft = left - containerRect.left;
          if (item.id !== "") selectableItemsRef.current.push({
            left: adjustedLeft,
            top: adjustedTop,
            width,
            height,
            id: item.id,
          })

        });
      }
    }
  }, [sortedFolders?.length, activeView, sortedAssets?.length]);
  //------Drag-Select-area-------End======//

  //Handle the dynamically stopage of filters at top of page position on scroll down  


  const filterRef = useRef<HTMLDivElement>(null);

  const getStyling = useMemo((): CSSProperties => {
    if (!isShare) {
      if (mode === "folders") {
        return { marginTop: 60 };
      }
      if (mode === "SubCollectionView") {
        if (!sidebarOpen) {
          return { marginTop: 44 + 14 };
        }
        return { marginTop: 44 };
      }
      if (!sidebarOpen) {
        return { marginTop: (filterRef?.current?.clientHeight ?? 0) + 14 };
      }
      return { marginTop: filterRef?.current?.clientHeight };
    } else {
      return {};
    }
  }, [render, mode]);

  const onDragStart = (evt) => {
    const element = evt.currentTarget;
    childFolder.current = element.id
  };

  const filterFolderInList = (folderList, updatedFolder) => {
    return folderList.filter((folder) => {
      return folder.id === updatedFolder.id ? false : true;
    });
  };

  const onDragDrop = async (evt) => {
    const element = evt.currentTarget
    parentFolder.current = element.id
    if (childFolder.current !== "" && childFolder.current !== parentFolder.current) {
      setMoveModalFlag(true)
    } else if (childFolder.current === "") {
      toastUtils.error("You can't move collection with sub-collection");
    }
    setCollectionDragFlag(false);// Global state in for collection drag when
    setCollectionDragId("");// Global state in for collection drag
    setCollectionParentDragId("")
    setDroppableId("")
  };

  const isAdmin = () => {
    return user?.role?.id === "admin" || user?.role?.id === "super_admin";
  };

  // Helper function to determine if the item is draggable
  const isDraggable = () => {
    return isAdmin();
  };

  // Helper function to handle drag start
  const handleDragStart = (e, folder) => {
    if (!folder?.childFolders?.length > 0) {
      onDragStart(e);
      setCollectionDragFlag(true);
      setCollectionDragId(e.currentTarget.id)
    }
  };

  const handleAssetDragStart = (e) => {
    const element = e.currentTarget;
    setAssetDragFlag(true);
    setAssetDragId(element.id);
    setAssetDragType(activeFolder === "" ? "copy" : "move");
  }

  const handleAssetDrop = (e) => {
    setAssetDragFlag(false);
    setAssetDragId("");
    setAssetDragType("");
    setDroppableId("")
  }
  // Helper function to handle drop (assuming onDragDrop is your drop handler)
  const handleDrop = (e) => {
    if (isAdmin()) {
      onDragDrop(e);
    }
  };

  const moveCollection = async () => {
    try {
      setLoader(true);
      const data = await folderApi.updateParent({
        parentId: parentFolder.current,
        folderId: childFolder.current,
      });

      if (data) {
        const updatedFolders = filterFolderInList(folders, data.data);
        setFolders(updatedFolders);
      }
      childFolder.current = ""
      parentFolder.current = ""
      setMoveModalFlag(false);
      setListUpdateFlag(true);
      setLoader(false);
      toastUtils.success("Collection successfully moved");
    } catch (err) {
      setLoader(false);
      setMoveModalFlag(false);
      toastUtils.error(err.response.data.error.name);
    }
  };

  const closeMoveModal = () => {
    childFolder.current = "";
    parentFolder.current = "";
    setMoveModalFlag(false);
    setLoader(false);
  }

  return (
    <>
      {loader && <SpinnerOverlay />}
      <div
        ref={filterRef}
        id="filter-container-height"
        className={`${isShare ? styles["share-page-filter"] : ""} ${styles["filter-view-container"]} ${!sidebarOpen && isShare ? styles["share-page-open"] : ""
          }`}
      >
        {mode === "assets" && <FilterView render={render} setRender={setRender} />}
      </div>
      {/* <section
        className={`${styles.container}  ${shouldShowUpload ? styles.uploadAsset : ""} ${!sidebarOpen  ? styles["container-on-toggle"] : ""
          }`}
        style={getStyling}
      > */}
      <section
      className={`${styles.container} ${shouldShowUpload ? styles.uploadAsset : ""} ${!sidebarOpen ? styles["container-on-toggle"] : ""} ${isShare ? styles["share-page-container"] : ""}`}
      style={getStyling}
    >

        {(shouldShowUpload || isDragging) && !isShare && !hasPermission([ASSET_UPLOAD_APPROVAL]) && (
          <AssetUpload
            onDragText={"Drop files here to upload"}
            preDragText={
              shouldShowUpload ? `Drag and drop your files here to upload (png, jpg, gif, doc, xlsx, pdf or mp4)` : ""
            }
            onFilesDataGet={onFilesDataGet}
          />
        )}
        {shouldShowUpload && !isShare && (
          <AssetAddition
            displayMode="regular"
            folderAdd={false}
            activeFolder={activeFolder}
            getFolders={getFolders}
            type={type}
            itemId={itemId}
            activeSearchOverlay={activeSearchOverlay}
            setActiveSearchOverlay={setActiveSearchOverlay}
          />
        )}
        <DragSelection />
        {
          <div className={`${styles["collectionAssets"]} ${styles["w-100"]} `}>
            {
            //   <ul
            //     className={`${mode === "SubCollectionView" ? "" : styles["grid-list"]} ${styles[itemSize]} ${activeView === "list" ? styles["list-view"] : ""
            //       }    ${!sidebarOpen ? styles["marginTop"] : ""}
            // ${mode === "assets"
            //         ? styles["grid-" + advancedConfig.assetThumbnail]
            //         : styles["grid-" + advancedConfig.collectionThumbnail]
            //       }
            // `}
            //     {...(mode === "assets" && activeView !== "list" ? { style: { marginTop: "60px" } } : {})}
            //     id="asset-parent"
            //     ref={elementsContainerRef}
            //   >
            <ul
                className={`${mode === "SubCollectionView" ? "" : styles["grid-list"]} ${styles[itemSize]} ${activeView === "list" ? styles["list-view"] : ""
                  }    ${!sidebarOpen ? styles["marginTop"] : ""}
            ${mode === "assets"
                    ? styles["grid-" + advancedConfig.assetThumbnail]
                    : styles["grid-" + advancedConfig.collectionThumbnail]
                  }
                  ${isShare ? styles["share-page-mob"] : ""}
            `}
                {...(mode === "assets" && activeView !== "list" ? { style: { marginTop: "60px" } } : {})}
                id="asset-parent"
              // onMouseUp={(e) => {
              //   console.log("Mai mouse up", e.clientX, e.clientY)
              // }}
              // {...(mode === "assets" && !sidebarOpen && { style: { marginTop: '60px' } })}
              >
                {mode === "SubCollectionView" && (
                  <SubCollection
                    activeView={activeView}
                    isShare={isShare}
                    toggleSelected={toggleSelected}
                    mode={mode}
                    deleteFolder={deleteFolder}
                    viewFolder={viewFolder}
                    sharePath={sharePath}
                    widthCard
                    ref={ref}
                    copyShareLink
                    getShareIsEnabled={getShareIsEnabled}
                    beginAssetOperation={beginAssetOperation}
                    beginChangeThumbnailOperation={beginChangeThumbnailOperation}
                    deleteThumbnail={deleteThumbnail}
                    isThumbnailNameEditable={isThumbnailNameEditable}
                    setFocusedItem={setFocusedItem}
                    focusedItem={focusedItem}
                    handleFocusChange={handleFocusChange}
                    loadMoreSubCollctions={getSubFolders}
                    openArchiveAsset={openArchiveAsset}
                    openDeleteAsset={openDeleteAsset}
                    downloadAsset={downloadAsset}
                    refreshVersion={refreshVersion}
                    loadMoreAssets={getSubCollectionsAssetData}
                    onCloseDetailOverlay={onCloseDetailOverlay}
                    elementsFolderContainerRef={elementsFolderContainerRef}
                    elementsAssetContainerRef={elementsAssetContainerRef}
                    selectableItemsRef={selectableItemsRef}
                  />
                )}
                {mode === "assets" && assets?.length > 0 && (
                  <>
                    {activeView === "list" && (
                      <AssetTableHeader activeView={activeView} setSortAttribute={setSortAssetAttribute} />
                    )}
                    {sortedAssets.map((assetItem, index) => {
                      if (assetItem.status !== "fail") {
                        return (
                          <li
                            className={`${styles["grid-item"]} ${styles["asset-image-outer"]} ${activeView === "grid" ? styles["grid-item-new"] : ""}
                            ${activeView === "grid" && styles["list-wrapper-asset"]}
                            `}
                            key={index}
                            id={assetItem.asset?.id}
                            onClick={(e) => handleFocusChange(e, assetItem.asset.id)}
                            style={{ width: `$${widthCard} px` }}
                            draggable={isDraggable()}
                            onDragStart={(e) => handleAssetDragStart(e)}
                            onDragOver={(ev) => ev.preventDefault()}
                            onDrop={e => { handleAssetDrop(e) }}
                          >
                            <div className={activeView === "grid" && styles["collection-assets"]}>
                              <AssetThumbail
                                {...assetItem}
                                assetItem={assetItem}
                                sharePath={sharePath}
                                activeFolder={activeFolder}
                                isShare={isShare}
                                type={type}
                                toggleSelected={() => toggleSelected(assetItem.asset.id)}
                                openArchiveAsset={() => openArchiveAsset(assetItem.asset)}
                                openDeleteAsset={() => openDeleteAsset(assetItem.asset.id)}
                                openMoveAsset={() => beginAssetOperation({ asset: assetItem }, "move")}
                                openCopyAsset={() => beginAssetOperation({ asset: assetItem }, "copy")}
                                openShareAsset={() => beginAssetOperation({ asset: assetItem }, "share")}
                                downloadAsset={() => downloadAsset(assetItem)}
                                openRemoveAsset={() => beginAssetOperation({ asset: assetItem }, "remove_item")}
                                handleVersionChange={refreshVersion}
                                loadMore={loadMore}
                                onCloseDetailOverlay={onCloseDetailOverlay}
                                isThumbnailNameEditable={isThumbnailNameEditable}
                                focusedItem={focusedItem}
                                setFocusedItem={setFocusedItem}
                                activeView={activeView}
                                mode={mode}
                              />
                            </div>
                          </li>
                        );
                      }
                    })}
                  </>
                )}
                {mode === "folders" && (
                  <>
                    {activeView === "list" && (
                      <FolderTableHeader activeView={activeView} setSortAttribute={setSortFolderAttribute} />
                    )}
                    {sortedFolders.map((folder, index) => {
                      return (
                        <li
                          draggable={isDraggable()}
                          onDragStart={(e) => handleDragStart(e, folder)}
                          onDragOver={(ev) => ev.preventDefault()}
                          onDrop={(e) => handleDrop(e)}
                          data-drag="false"
                          className={`${styles["grid-item"]}`}
                          id={folder.id}
                          key={folder.id || index}
                          onClick={(e) => handleFocusChange(e, folder.id)}
                          ref={ref}
                          style={{ width: `$${widthCard} px` }}
                        >
                          <FolderGridItem
                            {...folder}
                            isShare={isShare}
                            sharePath={sharePath}
                            toggleSelected={() => toggleSelected(folder.id)}
                            viewFolder={() => viewFolder(folder.id, true)}
                            deleteFolder={() => deleteFolder(folder.id)}
                            copyShareLink={() => copyShareLink(folder)}
                            copyEnabled={getShareIsEnabled(folder)}
                            shareAssets={() => beginAssetOperation({ folder }, "shareFolders")}
                            changeThumbnail={beginChangeThumbnailOperation}
                            deleteThumbnail={() => deleteThumbnail({ folder }, "shareFolders")}
                            activeView={activeView}
                            isThumbnailNameEditable={isThumbnailNameEditable}
                            focusedItem={focusedItem}
                            setFocusedItem={setFocusedItem}
                            mode={mode}
                          />
                        </li>
                      );
                    })}
                  </>
                )}
              </ul>
            }
            {showLoadMore && nextPage !== -1 && (
              <>
                {nextPage > 2 || mode === "folders" ? (
                  <>{!loadingAssetsFolders && <Waypoint onEnter={loadMore} fireOnRapidScroll={false} />}</>
                ) : (
                  <>
                    {!loadingAssetsFolders && (
                      <div className={styles["button-wrapper"]}>
                        <Button text="Load More" type="button" className="container primary" onClick={loadMore} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        }
        {/* Change thumbnail modal */}
        <ChangeThumbnail
          closeModal={() => {
            setModalData({});
            setModalOpen(false);
          }}
          cleareProps={modalData}
          additionalClasses={["visible-block"]}
          modalData={modalData}
          modalIsOpen={modalOpen}
          confirmAction={() => { }}
          getSubFolders={getSubFolders}
        />
        {/* Delete modal */}
        <ConfirmModal
          closeModal={() => setDeleteModalOpen(false)}
          confirmAction={() => {
            deleteAsset(activeAssetId);
            setActiveAssetId("");
            setDeleteModalOpen(false);
          }}
          confirmText={"Delete"}
          message={
            <span>
              Are you sure you want to &nbsp;<strong>Delete</strong>&nbsp; this asset?
            </span>
          }
          modalIsOpen={deleteModalOpen}
        />
        <ConfirmModal
          message={"Make Collection a Subcollection"}
          modalIsOpen={moveModalFlag}
          closeModal={() => closeMoveModal()}
          confirmAction={moveCollection}
          confirmText={"Make Subcollection"}
          subText="The selected collection will be moved from its current location and made a subcollection of the selected parent collection"
        />
        {/* Archive modal */}
        <ConfirmModal
          closeModal={() => setActiveArchiveAsset(undefined)}
          confirmAction={() => {
            archiveAsset(activeAssetId);
            setActiveAssetId("");
            setActiveArchiveAsset(undefined);
          }}
          confirmText={`${activeArchiveAsset?.stage !== "archived" ? "Archive" : "Unarchive"} `}
          message={
            <span>
              Are you sure you want to &nbsp;
              <strong>{`${activeArchiveAsset?.stage !== "archived" ? "Archive" : "Unarchive"} `}</strong>
              &nbsp; this asset?
            </span>
          }
          modalIsOpen={activeArchiveAsset}
        />
        {/* Overlay exclusive to page load assets */}
        {initAsset && (
          <DetailOverlay
            isShare={isShare}
            sharePath={sharePath}
            asset={initAsset.asset}
            realUrl={initAsset.realUrl}
            initialParams={{ side: "comments" }}
            openShareAsset={() => beginAssetOperation({ asset: initAsset }, "share")}
            openDeleteAsset={() => openDeleteAsset(initAsset.asset.id)}
            closeOverlay={() => setInitAsset(undefined)}
            loadMore={loadMore}
            availableNext={nextPage !== -1}
          />
        )}
      </section >
    </>
  );
};


export default AssetGrid;