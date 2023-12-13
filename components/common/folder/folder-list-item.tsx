import { format } from "date-fns";
import fileDownload from "js-file-download";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AssetOps, Assets, Utilities } from "../../../assets";
import gridStyles from "../asset/asset-grid.module.css";
import styles from "./folder-list-item.module.css";

// Components
import IconClickable from "../buttons/icon-clickable";
import ConfirmModal from "../modals/confirm-modal";
import FolderOptions from "./folder-options";

import folderApi from "../../../server-api/folder";
import shareFolderApi from "../../../server-api/share-collection";

// Context
import { AssetContext } from "../../../context";

import update from "immutability-helper";
import {
  COLLECTION_NAME_UPDATED,
  FAILED_TO_UPDATE_COLLECTION_NAME,
} from "../../../constants/messages";
import toastUtils from "../../../utils/toast";
import RenameModal from "../../common/modals/rename-modal";

const FolderListItem = ({
  index,
  id,
  name,
  size,
  length,
  assetsCount,
  createdAt,
  assets,
  viewFolder,
  isLoading = false,
  deleteFolder = () => { },
  shareAssets = (folder) => { },
  copyShareLink = (folder) => { },
  setCurrentSortAttribute = (attribute) => { },
  copyEnabled,
  toggleSelected,
  isSelected,
  sortAttribute,
  changeThumbnail = (folder) => { },
  deleteThumbnail = (folder) => { },
  thumbnailPath,
  thumbnailExtension,
  thumbnails,
  activeView,
  isNameEditable = false,
  focusedItem,
  setFocusedItem,
  isShare = false,
  sharePath = "",
}) => {
  const { updateDownloadingStatus, folders, setFolders } =
    useContext(AssetContext);

  const dateFormat = "MMM do, yyyy";

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [collectionName, setCollectionName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const [folderRenameModalOpen, setFolderRenameModalOpen] = useState(false);

  const initialPreviewImgSrc =
    thumbnailPath ??
    (thumbnails?.thumbnails && thumbnails?.thumbnails?.length > 0
      ? thumbnails?.thumbnails[0].filePath
      : assets[0]?.realUrl);

  const [previewImgSrc, setPreviewImgSrc] = useState(initialPreviewImgSrc);

  const handleImagePreviewOnError = (e) => {
    setPreviewImgSrc(Assets.empty);
  };

  useEffect(() => {
    setCollectionName(name);
  }, [name]);

  const downloadFoldercontents = async () => {
    // Show processing bar
    updateDownloadingStatus("zipping", 0, 1);

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
  };

  const getSortAttributeClassName = (attribute) =>
    sortAttribute.replace("-", "") === attribute && styles["active"];

  const setSortAttribute = (attribute) => {
    if (attribute === sortAttribute) {
      setCurrentSortAttribute("-" + attribute);
    } else {
      setCurrentSortAttribute(
        sortAttribute.startsWith("-") ? attribute : "-" + attribute
      );
    }
  };

  const arrowIcon = sortAttribute.startsWith("-")
    ? Utilities.arrowUpGrey
    : Utilities.arrowGrey;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCollectionName(e.target.value);
  };

  const updateCollectionNameOnBlur = async () => {
    setFocusedItem(null);
    setIsEditing(false);
    //fire api only if name is changed
    if (collectionName && name !== collectionName) {
      try {
        const data = await folderApi.updateFolder(id, {
          name: collectionName,
        });

        if (data) {
          setFolders(
            folders.map((folder) => {
              if (folder.id === data.data.id) {
                return { ...folder, name: data.data.name };
              } else {
                return folder;
              }
            })
          );
        }

        toastUtils.success(COLLECTION_NAME_UPDATED);
      } catch (e) {
        toastUtils.error(FAILED_TO_UPDATE_COLLECTION_NAME);
      }
    } else {
      setCollectionName(name);
    }
  };

  const handleOnFocus = () => {
    setIsEditing(true);
  };

  const confirmFolderRename = async (newValue) => {
    try {
      await folderApi.updateFolder(id, { name: newValue });
      const modFolderIndex = folders.findIndex((folder) => folder.id === id);

      setFolders(
        update(folders, {
          [modFolderIndex]: {
            name: { $set: newValue },
          },
        })
      );

      toastUtils.success("Collection name updated");
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not update collection name");
    }
  };

  return (
    <>
      <div className={styles.list}>
        {index === 0 && (
          <div className={styles.header}>
            <div className={styles["headers-content"]}>
              <h4 onClick={() => setSortAttribute("folder.name")}>
                Name
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("folder.name")}`}
                />
              </h4>
              <h4></h4>
              <h4 onClick={() => setSortAttribute("folder.created-at")}>
                Create Date
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("folder.created-at")}`}
                />
              </h4>
              <h4 onClick={() => setSortAttribute("folder.length")}>
                Assets
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("folder.length")}`}
                />
              </h4>

            </div>
          </div>
        )}
        <div
          className={`${styles.item} ${isSelected ? styles["item--selected"] : ""
            }`}
          onClick={toggleSelected}
        >
          <div
            className={`${styles.thumbnail} cursor: pointer`}
            onClick={viewFolder}
          >
            <img
              src={previewImgSrc ?? Assets.empty}
              alt=""
              onError={handleImagePreviewOnError}
            />
          </div>

          <div
            className={`${styles.name} ${isLoading && "loadable"}`}
            onClick={!isNameEditable ? viewFolder : () => { }}
          >
            {isNameEditable &&
              isEditing &&
              focusedItem &&
              focusedItem === id ? (
              <input
                autoFocus
                className={`normal-text ${gridStyles["editable-input"]}`}
                value={collectionName}
                onChange={handleNameChange}
                onBlur={updateCollectionNameOnBlur}
              />
            ) : (
              <span
                id="editable-preview"
                className={`normal-text ${styles.textEllipse} ${gridStyles["editable-preview"]}`}
                onClick={handleOnFocus}
              >
                {collectionName}
              </span>
            )}
          </div>
          <div className={`${styles.field_name} ${styles.actions}`}>
            <img
              id="edit-icon"
              className={styles.edit}
              src={AssetOps.editGray}
              alt="edit"
              onClick={(e) => {
                e.stopPropagation();
                setFolderRenameModalOpen(true);
              }}
            />
            {!isLoading && (
              <div>
                <FolderOptions
                  activeFolderId={id}
                  downloadFoldercontents={downloadFoldercontents}
                  shareAssets={shareAssets}
                  setDeleteOpen={setDeleteOpen}
                  copyShareLink={copyShareLink}
                  copyEnabled={copyEnabled}
                  changeThumbnail={changeThumbnail}
                  deleteThumbnail={deleteThumbnail}
                  thumbnailPath={thumbnailPath || thumbnailExtension}
                  thumbnails={thumbnails}
                  activeView={activeView}
                />
              </div>
            )}
          </div>
          <div className={styles.field_name}>
            {!isLoading && `${assetsCount} Assets`}
          </div>
          <div
            className={`${styles.field_name} ${isLoading && "loadable"} ${styles["date-created"]
              }`}
          >
            {format(new Date(createdAt), dateFormat)}
          </div>
        </div>
      </div>
      <ConfirmModal
        closeModal={() => setDeleteOpen(false)}
        confirmAction={() => {
          deleteFolder();
          setDeleteOpen(false);
        }}
        confirmText={"Delete"}
        message={"Are you sure you want to delete this folder?"}
        modalIsOpen={deleteOpen}
      />
      <RenameModal
        closeModal={() => setFolderRenameModalOpen(false)}
        modalIsOpen={folderRenameModalOpen}
        renameConfirm={confirmFolderRename}
        type={"Folder"}
        initialValue={name}
      />
    </>
  );
};

export default FolderListItem;
