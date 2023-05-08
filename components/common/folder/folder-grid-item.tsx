import styles from "./folder-grid-item.module.css";
import gridStyles from "../asset//asset-grid.module.css";
import { Utilities, Assets } from "../../../assets";
import {
  ChangeEvent,
  FocusEventHandler,
  useContext,
  useRef,
  useState,
} from "react";
import fileDownload from "js-file-download";
import zipDownloadUtils from "../../../utils/download";
import _ from "lodash";

// Context
import { AssetContext, FilterContext } from "../../../context";

// Components
import AssetImg from "../asset/asset-img";
import Button from "../buttons/button";
import FolderOptions from "./folder-options";
import IconClickable from "../buttons/icon-clickable";
import ConfirmModal from "../modals/confirm-modal";

import folderApi from "../../../server-api/folder";
import shareFolderApi from "../../../server-api/share-collection";
import AssetIcon from "../asset/asset-icon";
import React from "react";
import toastUtils from "../../../utils/toast";
import {
  FAILED_TO_UPDATE_COLLECTION_NAME,
  COLLECTION_NAME_UPDATED,
} from "../../../constants/messages";

const FolderGridItem = ({
  id,
  name,
  size,
  isSelected,
  length,
  assetsCount,
  assets,
  viewFolder,
  isLoading = false,
  deleteFolder,
  shareAssets = (folder) => {},
  changeThumbnail,
  deleteThumbnail = (folder) => {},
  copyShareLink = (folder) => {},
  toggleSelected,
  copyEnabled,
  sharePath = "",
  isShare = false,
  thumbnailPath,
  thumbnailExtension,
  thumbnails,
  openFilter = false,
  activeView,
  isThumbnailNameEditable = false,
  focusedItem,
  setFocusedItem,
}) => {
  const { updateDownloadingStatus, folders, setFolders } =
    useContext(AssetContext);

  const [thumbnailName, setThumbnailName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

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
    previews = thumbnails.thumbnails
      .sort(GetSortOrder("index"))
      .map((thumb: any, index) => ({
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
    // const { data } = await folderApi.getInfoToDownloadFolder(id)
    // // Get full assets url, because currently, it just get maximum 4 real url in thumbnail
    // zipDownloadUtils.zipAndDownload(data, name)

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

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThumbnailName(e.target.value);
  };

  const updateNameOnBlur = async (e) => {
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
            })
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

  return (
    <div className={`${styles.container} ${isLoading && "loadable"}`}>
      <div
        className={
          thumbnailPath || thumbnailExtension
            ? `${styles.grid_border} ${openFilter ? styles["filter_open"] : ""}`
            : `${styles["image-wrapper"]} ${
                openFilter ? styles["filter_open"] : ""
              }`
        }
      >
        <>
          {thumbnailPath && (
            <AssetImg
              assetImg={thumbnailPath}
              isCollection={false}
              imgClass="maxHeight"
              style={{ maxWidth: "330px !important" }}
            />
          )}
          {thumbnailExtension && !thumbnailPath && (
            <AssetIcon extension={thumbnailExtension} imgClass="maxHeight" />
          )}
          {!thumbnailPath &&
            !thumbnailExtension &&
            previews.map((preview, index) => (
              <div
                className={styles["sub-image-wrapper"]}
                key={index.toString()}
              >
                {preview.assetImg || preview.name === "empty" ? (
                  <AssetImg {...preview} />
                ) : (
                  <AssetIcon
                    extension={preview.extension}
                    isCollection={true}
                  />
                )}
              </div>
            ))}
          <div className={styles["image-button-wrapper"]}>
            <Button
              styleType={"primary"}
              text={"View Collection"}
              type={"button"}
              onClick={viewFolder}
            />
          </div>
          <div
            className={`${styles["selectable-wrapper"]} ${
              isSelected && styles["selected-wrapper"]
            }`}
          >
            <IconClickable
              src={
                isSelected
                  ? Utilities.radioButtonEnabled
                  : Utilities.radioButtonNormal
              }
              additionalClass={styles["select-icon"]}
              onClick={toggleSelected}
            />
          </div>
        </>
      </div>
      <div className={styles.info} onClick={handleOnFocus}>
        <div className={styles.folderItemHeadingOuter}>
          <div className={styles.folderItemHeading}>
            {isThumbnailNameEditable &&
            isEditing &&
            focusedItem &&
            focusedItem === id ? (
              <input
                className={`normal-text ${gridStyles["editable-input"]}`}
                value={thumbnailName}
                onChange={handleNameChange}
                onBlur={updateNameOnBlur}
                autoFocus
              />
            ) : (
              <span
                id="editable-preview"
                onClick={handleOnFocus}
                className={
                  isThumbnailNameEditable
                    ? `normal-text ${styles["wrap-text"]} ${gridStyles["editable-preview"]}`
                    : `${gridStyles["editable-preview"]} ${gridStyles["non-editable-preview"]}`
                }
              >
                {thumbnailName}
              </span>
            )}
            <div className={styles["details-wrapper"]}>
              <div className="secondary-text">{`${assetsCount} Assets`}</div>
            </div>
          </div>
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
          />
        </div>
      </div>
      <ConfirmModal
        closeModal={() => setDeleteOpen(false)}
        confirmAction={() => {
          deleteFolder();
          setDeleteOpen(false);
        }}
        confirmText={"Delete"}
        message={"Are you sure you want to delete this Collection?"}
        modalIsOpen={deleteOpen}
      />
    </div>
  );
};

export default FolderGridItem;
