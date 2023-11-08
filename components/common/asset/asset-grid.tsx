import copyClipboard from "copy-to-clipboard";
import update from "immutability-helper";
import fileDownload from "js-file-download";
import { useContext, useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";

import { sizeToZipDownload } from "../../../constants/download";
import { ASSET_ACCESS } from "../../../constants/permissions";
import { AssetContext, LoadingContext, UserContext } from "../../../context";
import useSortedAssets from "../../../hooks/use-sorted-assets";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import shareApi from "../../../server-api/share-collection";
import { checkIfUserCanEditThumbnail } from "../../../utils/asset";
import downloadUtils from "../../../utils/download";
import toastUtils from "../../../utils/toast";
import urlUtils from "../../../utils/url";
import SubCollection from "../../Sub-collection/sub-collection";
import Button from "../buttons/button";
import FolderGridItem from "../folder/folder-grid-item";
import FolderListItem from "../folder/folder-list-item";
import useDropzone from "../misc/dropzone";
import ChangeThumbnail from "../modals/change-thumnail-modal";
import ConfirmModal from "../modals/confirm-modal";
import AssetAddition from "./asset-addition";
import styles from "./asset-grid.module.css";
import AssetThumbail from "./asset-thumbail";
import AssetUpload from "./asset-upload";
import DetailOverlay from "./detail-overlay";
import ListItem from "./list-item";
import React from "react";
import { Utilities } from "../../../assets";
import  FolderTableHeader  from "./Folder-table-header/folder-table-header";
import AssetTableHeader from "./Asset-table-header/asset-table-header";


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
  openFilter,
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
  } = useContext(AssetContext);

  const { advancedConfig, hasPermission, user } = useContext(UserContext);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeArchiveAsset, setActiveArchiveAsset] = useState(undefined);
  const [activeAssetId, setActiveAssetId] = useState("");

  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false);

  const [initAsset, setInitAsset] = useState(undefined);

  const [modalOpen, setModalOpen] = useState(false); // Open or close modal of change thumbnail

  const [modalData, setModalData] = useState({}); // load or unload data for change thumbnail modal

  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] =
    useSortedAssets(assets);
  const [
    sortedFolders,
    currentSortFolderAttribute,
    setCurrentSortFolderAttribute,
  ] = useSortedAssets(folders);

  const { setIsLoading } = useContext(LoadingContext);

  const [focusedItem, setFocusedItem] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const ref = useRef(null);
  useEffect(() => {
    const { assetId } = urlUtils.getQueryParameters();
    if (assetId) getInitialAsset(assetId);
  }, []);

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
      setCurrentSortFolderAttribute(
        currentSortFolderAttribute.startsWith("-") ? attribute : "-" + attribute
      );
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
        const assetIndex = subFoldersAssetsViewList.results.findIndex(
          (assetItem) => assetItem.asset.id === id
        );
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
        const assetIndex = assets.findIndex(
          (assetItem) => assetItem.asset.id === id
        );
        if (assetIndex !== -1)
          setAssets(
            update(assets, {
              $splice: [[assetIndex, 1]],
            })
          );
      }
      toastUtils.success("Assets deleted successfully");
    } catch (err) {
      // TODO: Error handling
      toastUtils.error("Could not delete assets, please try again later.");
    }
  };

  const archiveAsset = async (id) => {
    const newState =
      activeArchiveAsset?.stage !== "archived" ? "archived" : "draft";
    try {
      let assetsApi: any = assetApi;
      await assetsApi.updateAsset(id, { updateData: { stage: newState } });
      if (mode === "SubCollectionView") {
        const assetIndex = subFoldersAssetsViewList.results.findIndex(
          (assetItem) => assetItem.asset.id === id
        );
        if (assetIndex !== -1) {
          setSubFoldersAssetsViewList({
            ...subFoldersAssetsViewList,
            results: update(subFoldersAssetsViewList.results, {
              $splice: [[assetIndex, 1]],
            }),
          });
        }
      } else {
        const assetIndex = assets.findIndex(
          (assetItem) => assetItem.asset.id === id
        );
        setAssets(
          update(assets, {
            $splice: [[assetIndex, 1]],
          })
        );
      }

      toastUtils.success(
        `Assets ${newState === "archived" ? "archived" : "unarchived"
        } successfully`
      );
    } catch (err) {
      // TODO: Error handling
      toastUtils.error(
        `Could not ${newState === "archived" ? "archive" : "unarchive"
        } assets, please try again later.`
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
      updateDownloadingStatus(
        "error",
        0,
        0,
        "Internal Server Error. Please try again."
      );
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

  const showLoadMore =
    (mode === "assets" && assets.length > 0) ||
    (mode === "folders" && folders.length > 0);

  const loadingAssetsFolders =
    (assets.length > 0 && assets[assets.length - 1].isLoading) ||
    (folders.length > 0 && folders[folders.length - 1].isLoading);

  const refreshVersion = (currentVersion) => {
    if (currentVersion) {
      const clonedAssets = [...assets].filter((asset) => !asset.isUploading);
      const versionIndex = clonedAssets.findIndex(
        (item) => item.asset.versionGroup === currentVersion.versionGroup
      );
      const oldAsset = clonedAssets[versionIndex];
      const newVersionAsset = {
        asset: currentVersion,
        realUrl: currentVersion.realUrl,
        thumbailUrl: currentVersion.thumbailUrl,
        toggleSelected: { ...oldAsset.toggleSelected },
      };
      clonedAssets[versionIndex] = newVersionAsset;
      setAssets(clonedAssets);
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

  return (
    <>
      <section className={`${styles.container} ${openFilter && styles.filter}`}>
        {(shouldShowUpload || isDragging) && !isShare && (
          <AssetUpload
            onDragText={"Drop files here to upload"}
            preDragText={
              shouldShowUpload
                ? `Drag and drop your files here to upload (png, jpg, gif, doc, xlsx, pdf or mp4)`
                : ""
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
        {
          <div className={styles["list-wrapper"]}>
            {/* testing component starts from here */}
            {
              <ul
                className={`${mode === "SubCollectionView" ? "" : styles["grid-list"]
                  } ${styles[itemSize]} ${activeView === "list" && styles["list-view"]
                  } 
            ${mode === "assets"
                    ? openFilter
                      ? styles["grid-filter-" + advancedConfig.assetThumbnail]
                      : styles["grid-" + advancedConfig.assetThumbnail]
                    : openFilter
                      ? styles["grid-filter-" + advancedConfig.collectionThumbnail]
                      : styles["grid-" + advancedConfig.collectionThumbnail]
                  }
            `}
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
                    openFilter
                    widthCard
                    ref={ref}
                    copyShareLink
                    getShareIsEnabled={getShareIsEnabled}
                    beginAssetOperation={beginAssetOperation}
                    beginChangeThumbnailOperation={
                      beginChangeThumbnailOperation
                    }
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
                  />
                )}

                {mode === "assets" &&
                  sortedAssets.map((assetItem, index) => {
                    if (assetItem.status !== "fail") {
                      return (
                        <>
                        <div>
                        <AssetTableHeader index={index} activeView={activeView} setSortAttribute={setSortAssetAttribute} />
                          <li
                            className={styles["grid-item"]}
                            key={assetItem.asset.id || index}
                            onClick={(e) =>
                              handleFocusChange(e, assetItem.asset.id)
                            }
                            ref={ref}
                            style={{ width: `$${widthCard}px` }}
                          >
                            <AssetThumbail
                              {...assetItem}
                              sharePath={sharePath}
                              activeFolder={activeFolder}
                              isShare={isShare}
                              type={type}
                              toggleSelected={() =>
                                toggleSelected(assetItem.asset.id)
                              }
                              openArchiveAsset={() =>
                                openArchiveAsset(assetItem.asset)
                              }
                              openDeleteAsset={() =>
                                openDeleteAsset(assetItem.asset.id)
                              }
                              openMoveAsset={() =>
                                beginAssetOperation(
                                  { asset: assetItem },
                                  "move"
                                )
                              }
                              openCopyAsset={() =>
                                beginAssetOperation(
                                  { asset: assetItem },
                                  "copy"
                                )
                              }
                              openShareAsset={() =>
                                beginAssetOperation(
                                  { asset: assetItem },
                                  "share"
                                )
                              }
                              downloadAsset={() => downloadAsset(assetItem)}
                              openRemoveAsset={() =>
                                beginAssetOperation(
                                  { asset: assetItem },
                                  "remove_item"
                                )
                              }
                              handleVersionChange={refreshVersion}
                              loadMore={loadMore}
                              onCloseDetailOverlay={onCloseDetailOverlay}
                              isThumbnailNameEditable={
                                isThumbnailNameEditable
                              }
                              focusedItem={focusedItem}
                              setFocusedItem={setFocusedItem}
                              activeView={activeView}
                              mode={mode}

                            />
                          </li>

                        </div>
                         
                        </>
                      );
                    }
                  })}

                {mode === "folders" &&
                  sortedFolders.map((folder, index) => {
                    return (
                      <>
                        <div>
                          <FolderTableHeader index={index} activeView={activeView} setSortAttribute={setSortFolderAttribute} />
                          <li
                            className={styles["grid-item"]}
                            key={folder.id || index}
                            onClick={(e) => handleFocusChange(e, folder.id)}
                            ref={ref}
                            style={{ width: `$${widthCard}px` }}
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
                              openFilter={openFilter}
                              shareAssets={() =>
                                beginAssetOperation({ folder }, "shareFolders")
                              }
                              changeThumbnail={beginChangeThumbnailOperation}
                              deleteThumbnail={() =>
                                deleteThumbnail({ folder }, "shareFolders")
                              }
                              activeView={activeView}
                              isThumbnailNameEditable={isThumbnailNameEditable}
                              focusedItem={focusedItem}
                              setFocusedItem={setFocusedItem}
                              mode={mode}
                            />
                          </li>
                        </div>
                      </>
                    );
                  })}
              </ul>
            }

            {showLoadMore && nextPage !== -1 && (
              <>
                {nextPage > 2 || mode === "folders" ? (
                  <>
                    {!loadingAssetsFolders && (
                      <Waypoint onEnter={loadMore} fireOnRapidScroll={false} />
                    )}
                  </>
                ) : (
                  <>
                    {!loadingAssetsFolders && (
                      <div className={styles["button-wrapper"]}>
                        <Button
                          text="Load More"
                          type="button"
                          className="container primary"
                          onClick={loadMore}
                        />
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
              Are you sure you want to &nbsp;<strong>Delete</strong>&nbsp; this
              asset?
            </span>
          }
          modalIsOpen={deleteModalOpen}
        />

        {/* Archive modal */}
        <ConfirmModal
          closeModal={() => setActiveArchiveAsset(undefined)}
          confirmAction={() => {
            archiveAsset(activeAssetId);
            setActiveAssetId("");
            setActiveArchiveAsset(undefined);
          }}
          confirmText={`${activeArchiveAsset?.stage !== "archived" ? "Archive" : "Unarchive"
            }`}
          message={
            <span>
              Are you sure you want to &nbsp;
              <strong>{`${activeArchiveAsset?.stage !== "archived"
                ? "Archive"
                : "Unarchive"
                }`}</strong>
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
            openShareAsset={() =>
              beginAssetOperation({ asset: initAsset }, "share")
            }
            openDeleteAsset={() => openDeleteAsset(initAsset.asset.id)}
            closeOverlay={() => setInitAsset(undefined)}
            loadMore={loadMore}
            availableNext={nextPage !== -1}
          />
        )}
      </section>
    </>
  );
};

export default AssetGrid;
