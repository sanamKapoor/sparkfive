import { format } from "date-fns";
import fileDownload from "js-file-download";
import React, { ChangeEvent, useContext, useState } from "react";

import { Utilities } from "../../../assets";
import { COLLECTION_NAME_UPDATED, FAILED_TO_UPDATE_COLLECTION_NAME } from "../../../constants/messages";
import { AssetContext } from "../../../context";
import folderApi from "../../../server-api/folder";
import shareFolderApi from "../../../server-api/share-collection";
import toastUtils from "../../../utils/toast";
import RenameModal from "../../common/modals/rename-modal";
import gridStyles from "../asset//asset-grid.module.css";
import AssetIcon from "../asset/asset-icon";
import AssetImg from "../asset/asset-img";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import ConfirmModal from "../modals/confirm-modal";
import styles from "./folder-grid-item.module.css";
import FolderOptions from "./folder-options";
import MoveCollectionModal from "../modals/move-collection-modal";
import SpinnerOverlay from "../spinners/spinner-overlay";

// Context
// Components
const FolderGridItem = ({
  id,
  name,
  isSelected,
  assetsCount,
  assets,
  totalchildassests,
  totalchild,
  viewFolder,
  isLoading = false,
  deleteFolder,
  createdAt,
  shareAssets = (folder: string) => {},
  changeThumbnail,
  deleteThumbnail = (folder: string) => {},
  copyShareLink = (folder: string) => {},
  toggleSelected,
  copyEnabled,
  sharePath = "",
  isShare = false,
  thumbnailPath,
  thumbnailExtension,
  thumbnails,
  activeView,
  isThumbnailNameEditable = false,
  focusedItem,
  setFocusedItem,
  folderType,
  mode,
  childFolders,
  parentId,
}: any) => {
  const {
    updateDownloadingStatus,
    folders,
    setFolders,
    setListUpdateFlag,
    subFoldersViewList: { results: SubFolders, next, total },
    setSubFoldersViewList,
  } = useContext(AssetContext);

  const [folderRenameModalOpen, setFolderRenameModalOpen] = useState(false);
  const [moveCollectionOpenModal, setMoveCollectionOpenModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const [thumbnailName, setThumbnailName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const dateFormat = "MMM do, yyyy";

  let previews;

  function GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }

  if (thumbnails && thumbnails.thumbnails) {
    previews = thumbnails.thumbnails.sort(GetSortOrder("index")).map((thumb: any, index) => ({
      name: "thumbnail",
      assetImg: thumb?.filePath || "",
      type: thumb?.type || "thumbnail",
      extension: thumb?.extension,
    }));
  } else {
    const assetsCopy = [];
    let maxCount = 4;
    for (let i = 0; i < assets.length; i++) {
      if (maxCount === 0) {
        break;
      }
      if (assets[i].version === 1) {
        assetsCopy.push(assets[i]);
        maxCount = maxCount - 1;
      }
    }

    previews = [1, 2, 3, 4].map((_, index) => ({
      name: assetsCopy[index]?.name || "empty",
      assetImg: assetsCopy[index]?.thumbailUrl || "",
      type: assetsCopy[index]?.type || "empty",
      extension: assetsCopy[index]?.extension,
    }));
  }

  const [deleteOpen, setDeleteOpen] = useState(false);

  const downloadFoldercontents = async () => {
    // Show processing bar
    try {
      updateDownloadingStatus("zipping", 0, assetsCount);

      let payload = {
        folderIds: [id],
      };

      let filters = {
        estimateTime: 1,
      };

      let api = folderApi;

      if (isShare) {
        api = shareFolderApi;
      }

      // Add sharePath property if user is at share collection page
      if (sharePath) {
        filters["sharePath"] = sharePath;
      }

      const { data } = await api.downloadFoldersAsZip(payload, filters);
      // Download file to storage
      fileDownload(data, "assets.zip");

      updateDownloadingStatus("done", 0, 0);
    } catch (err) {
      updateDownloadingStatus("error", 0, 0);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThumbnailName(e.target.value);
  };

  const updateNameOnBlur = async (e) => {
    console.log("onBlurr", e);
    setFocusedItem(null);
    setIsEditing(false);
    //fire api only if name is changed

    if (thumbnailName && name !== thumbnailName) {
      try {
        const data = await folderApi.updateFolder(id, {
          name: e.target.value,
        });

        if (data) {
          setFolders(
            folders.map((folder) => {
              if (folder.id === data.data.id) {
                return { ...folder, name: data.data.name };
              } else {
                return folder;
              }
            }),
          );
        }

        toastUtils.success(COLLECTION_NAME_UPDATED);
      } catch (e) {
        toastUtils.error(FAILED_TO_UPDATE_COLLECTION_NAME);
      }
    } else {
      setThumbnailName(name);
    }
  };

  const handleOnFocus = () => {
    setIsEditing(true);
  };
  //Rename collection Logic Added in action Item
  const renameCollection = () => {
    setFolderRenameModalOpen(true);
  };
  const moveCollection = () => {
    setMoveCollectionOpenModal(true);
  };

  const confirmMoveCollection = async (parentFolder) => {
    try {
      setLoader(true);
      const data = await folderApi.updateParent({
        parentId: parentFolder[0] || "",
        folderId: id,
      });
      if (data) {
        let updatedAssets;

        if (mode === "SubCollectionView") {
          updatedAssets = filterFolderInList(SubFolders, data.data);
          setSubFoldersViewList({
            next: next,
            total: total - 1,
            results: updatedAssets,
          });
        } else {
          const updatedFolders = filterFolderInList(folders, data.data);
          setFolders(updatedFolders);
        }
      }
      setListUpdateFlag(true);
      setLoader(false);

      toastUtils.success("Collection successfully moved");
    } catch (err) {
      setLoader(false);
      toastUtils.error(err.response.data.error);
    }
  };

  const confirmFolderRename = async (newValue) => {
    try {
      const data = await folderApi.updateFolder(id, {
        name: newValue,
      });

      if (data) {
        let updatedAssets;

        if (mode === "SubCollectionView") {
          updatedAssets = updateFolderInList(SubFolders, data.data);
          setSubFoldersViewList({
            next: next,
            total: total,
            results: updatedAssets,
          });
        } else {
          const updatedFolders = updateFolderInList(folders, data.data);
          setFolders(updatedFolders);
        }

        setListUpdateFlag(true);
        setThumbnailName(newValue);
      }

      toastUtils.success("Collection name updated");
    } catch (err) {
      console.error(err);
      toastUtils.error("Could not update collection name");
    }
  };

  const updateFolderInList = (folderList, updatedFolder) => {
    return folderList.map((folder) => {
      return folder.id === updatedFolder.id ? { ...folder, name: updatedFolder.name } : folder;
    });
  };

  const filterFolderInList = (folderList, updatedFolder) => {
    return folderList.filter((folder) => {
      return folder.id === updatedFolder.id ? false : true;
    });
  };

  return (
    <div
      data-drag="false"
      className={`${styles.container} ${activeView === "list" && styles.listContainer} ${isLoading && "loadable"}`}
    >
      {/* select wrapper is for list view  */}
      <div data-drag="false" className={activeView === "list" && styles["list-item-wrapper"]}>
        {activeView === "list" ? (
          <div
            data-drag="false"
            className={`${activeView === "list" && styles["list-select-icon"]} ${
              isSelected && styles["selected-wrapper"]
            }`}
          >
            <IconClickable
              src={isSelected ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
              additionalClass={styles["select-icon"]}
              onClick={toggleSelected}
            />
          </div>
        ) : null}
        <div
          data-drag="false"
          className={`${styles["main-border"]} ${activeView === "list" && styles["list-main-border"]}`}
        >
          <div
            data-drag="false"
            className={
              thumbnailPath || thumbnailExtension
                ? `${styles.grid_border} ${activeView === "list" ? styles.grid_border_list : ""} `
                : `${styles["image-wrapper"]} ${activeView === "list" ? styles["list-image-wrapper"] : ""}`
            }
            onClick={activeView === "list" && viewFolder}
          >
            <>
              {thumbnailPath && (
                <AssetImg assetImg={thumbnailPath} imgClass="maxHeight" style={{ maxWidth: "330px !important" }} />
              )}
              {thumbnailExtension && !thumbnailPath && (
                <AssetIcon extension={thumbnailExtension} imgClass="maxHeight" />
              )}
              {!thumbnailPath &&
                !thumbnailExtension &&
                previews.map((preview: any, index: number) => (
                  <div className={styles["sub-image-wrapper"]} key={index.toString()}>
                    {preview.assetImg || preview.name === "empty" ? (
                      <AssetImg {...preview} />
                    ) : (
                      <AssetIcon extension={preview.extension} isCollection={true} />
                    )}
                  </div>
                ))}
              {activeView !== "list" && (
                <div className={styles["image-button-wrapper"]}>
                  <Button className="container primary" text={"View Collection"} type={"button"} onClick={viewFolder} />
                </div>
              )}
              {activeView !== "list" && (
                <div className={`${styles["selectable-wrapper"]} ${isSelected && styles["selected-wrapper"]}`}>
                  <IconClickable
                    src={isSelected ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                    additionalClass={styles["select-icon"]}
                    onClick={toggleSelected}
                  />
                </div>
              )}
            </>
          </div>
          {
            // isThumbnailNameEditable &&
            // isEditing &&
            // focusedItem &&
            // focusedItem === id ? (
            //   <input
            //     className={`normal-text ${styles["editable-field"]} ${
            //       activeView === "list" && styles["list-editable-field"]
            //     } ${gridStyles["editable-input"]}`}
            //     value={thumbnailName}
            //     onChange={handleNameChange}
            //     onBlur={updateNameOnBlur}
            //     autoFocus
            //   />
            // ) : (
            <span
              data-drag="false"
              id="editable-preview"
              onClick={handleOnFocus}
              className={`normal-text ${styles["wrap-text"]} ${activeView === "list" && styles["list-wrap-text"]} ${
                gridStyles["editable-preview"]
              } ${activeView === "list" && styles["list-text"]}`}
            >
              {thumbnailName}
            </span>
            // )
          }
        </div>
      </div>

      <div
        data-drag="false"
        className={`${styles["details-wrapper"]} ${activeView === "list" && styles["list-detail-wrapper"]}`}
      >
        {folderType === "SubCollection" ? (
          <div className="secondary-text">{`${assetsCount ?? 0} Asset${assetsCount !== 1 ? "s" : ""}`}</div>
        ) : (
          <div data-drag="false" className={styles["modified-date"]}>
            {`${Number(assetsCount ?? 0) + Number(totalchildassests ?? 0)} Asset${
              Number(assetsCount ?? 0) + Number(totalchildassests ?? 0) !== 1 ? "s" : ""
            } ${
              Number(totalchild) !== 0 ? `${totalchild ?? 0} Subcollection${Number(totalchild) !== 1 ? "s" : ""}` : ""
            }`}
          </div>
        )}
      </div>
      {activeView === "list" && (
        <div className={styles["modified-date"]}> {format(new Date(createdAt), dateFormat)}</div>
      )}
      {loader && <SpinnerOverlay />}

      <FolderOptions
        activeFolderId={id}
        isShare={isShare}
        downloadFoldercontents={downloadFoldercontents}
        setDeleteOpen={setDeleteOpen}
        shareAssets={shareAssets}
        changeThumbnail={changeThumbnail}
        deleteThumbnail={deleteThumbnail}
        copyShareLink={copyShareLink}
        copyEnabled={copyEnabled}
        thumbnailPath={thumbnailPath || thumbnailExtension}
        assetsData={assets}
        thumbnails={thumbnails}
        activeView={activeView}
        renameCollection={renameCollection}
        moveCollection={moveCollection}
        childFolders={childFolders}
        parentId={parentId}
      />
      <RenameModal
        closeModal={() => setFolderRenameModalOpen(false)}
        modalIsOpen={folderRenameModalOpen}
        renameConfirm={confirmFolderRename}
        type={"Folder"}
        initialValue={thumbnailName}
      />
      <MoveCollectionModal
        modalIsOpen={moveCollectionOpenModal}
        closeModal={() => setMoveCollectionOpenModal(false)}
        moveFolder={confirmMoveCollection}
        parentId={parentId}
        itemsAmount={1}
      />
      <ConfirmModal
        closeModal={() => setDeleteOpen(false)}
        confirmAction={() => {
          deleteFolder();
          setDeleteOpen(false);
        }}
        confirmText={"Delete"}
        message={`Are you sure you want to delete this ${
          mode === "SubCollectionView" ? "Subcollection" : "Collection"
        }?`}
        modalIsOpen={deleteOpen}
      />
    </div>
  );
};

export default FolderGridItem;
