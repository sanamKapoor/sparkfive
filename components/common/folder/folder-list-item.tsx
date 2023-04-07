import fileDownload from "js-file-download";
import styles from "./folder-list-item.module.css";
import gridStyles from "../asset/asset-grid.module.css";
import { Utilities, Assets } from "../../../assets";
import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useState,
} from "react";
import { format } from "date-fns";
import zipDownloadUtils from "../../../utils/download";

// Components
import FolderOptions from "./folder-options";
import ConfirmModal from "../modals/confirm-modal";
import IconClickable from "../buttons/icon-clickable";

import folderApi from "../../../server-api/folder";
import shareFolderApi from "../../../server-api/share-collection";

// Context
import { AssetContext } from "../../../context";

import toastUtils from "../../../utils/toast";
import {
  FAILED_TO_UPDATE_COLLECTION_NAME,
  COLLECTION_NAME_UPDATED,
} from "../../../constants/messages";

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
  deleteFolder = () => {},
  shareAssets = (folder) => {},
  copyShareLink = (folder) => {},
  setCurrentSortAttribute = (attribute) => {},
  copyEnabled,
  toggleSelected,
  isSelected,
  sortAttribute,
  changeThumbnail = (folder) => {},
  deleteThumbnail = (folder) => {},
  thumbnailPath,
  thumbnailExtension,
  thumbnails,
  activeView,
  isNameEditable = false,
  focusedItem,
  setFocusedItem,
  isShare=false,
  sharePath = ""
}) => {
  const { updateDownloadingStatus, folders, setFolders } =
    useContext(AssetContext);

  const dateFormat = "MMM do, yyyy h:mm a";

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [collectionName, setCollectionName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

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

    console.log('response data: ', data);
    
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
      setCurrentSortAttribute(sortAttribute.startsWith("-") ? attribute : "-" + attribute);
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

  return (
    <>
      <div className={styles.list}>
        {index === 0 && (
          <div className={styles.header}>
            <h4 onClick={() => setSortAttribute("folder.name")}>
              Name
              <IconClickable
                src={arrowIcon}
                additionalClass={`${
                  styles["sort-icon"]
                } ${getSortAttributeClassName("folder.name")}`}
              />
            </h4>
            <h4 onClick={() => setSortAttribute("folder.length")}>
              Assets
              <IconClickable
                src={arrowIcon}
                additionalClass={`${
                  styles["sort-icon"]
                } ${getSortAttributeClassName("folder.length")}`}
              />
            </h4>
            <h4 onClick={() => setSortAttribute("folder.created-at")}>
              Created At
              <IconClickable
                src={arrowIcon}
                additionalClass={`${
                  styles["sort-icon"]
                } ${getSortAttributeClassName("folder.created-at")}`}
              />
            </h4>
            <h4></h4>
          </div>
        )}
        <div className={styles.item}>
          <div
            className={`${styles["selectable-wrapper"]} ${
              isSelected && styles["selected-wrapper"]
            }`}
          >
            {!isLoading && (
              <IconClickable
                src={
                  isSelected
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={toggleSelected}
              />
            )}
          </div>

          <div
            className={`${styles.name} ${isLoading && "loadable"}`}
            onClick={!isNameEditable ? viewFolder : () => {}}
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
                className={`normal-text ${gridStyles["editable-preview"]}`}
                onClick={handleOnFocus}
              >
                {collectionName}
              </span>
            )}
          </div>

          <div
            className={
              !isNameEditable
                ? styles.field_name
                : `${styles["field_name"]} cursor: pointer`
            }
            onClick={isNameEditable ? viewFolder : () => {}}
          >
            {!isLoading && `${assetsCount} Assets`}
          </div>
          <div className={`${styles.field_name} ${isLoading && "loadable"}`}>
            {format(new Date(createdAt), dateFormat)}
          </div>
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
    </>
  );
};

export default FolderListItem;
