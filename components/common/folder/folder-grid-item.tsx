import styles from "./folder-grid-item.module.css";
import { Utilities, Assets } from "../../../assets";
import { useContext, useState } from "react";
import fileDownload from "js-file-download";
import zipDownloadUtils from "../../../utils/download";
import _ from 'lodash'

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

const FolderGridItem = ({
  id,
  name,
  size,
  isSelected,
  length,
  assets,
  viewFolder,
  isLoading = false,
  deleteFolder,
  shareAssets = (folder) => { },
  changeThumbnail = (folder) => { },
  copyShareLink = (folder) => { },
  toggleSelected,
  copyEnabled,
  sharePath = '',
  isShare = false,
  thumbnailPath,
}) => {
  const { updateDownloadingStatus } = useContext(AssetContext);

  const previews = [1, 2, 3, 4].map((_, index) => ({
    name: assets[index]?.name || "empty",
    assetImg: assets[index]?.thumbailUrl || "",
    type: assets[index]?.type || "empty",
    extension: assets[index]?.extension,
  }));

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
      api = shareFolderApi
    }

    // Add sharePath property if user is at share collection page
    if (sharePath) {
      filters['sharePath'] = sharePath
    }

    const { data } = await api.downloadFoldersAsZip(payload, filters);

    // Download file to storage
    fileDownload(data, "assets.zip");

    updateDownloadingStatus("done", 0, 0);
  };

  return (
    <div className={`${styles.container} ${isLoading && "loadable"}`}>
      <div className={thumbnailPath ? styles.grid_border : styles["image-wrapper"]}>
        <>
          {thumbnailPath &&  <AssetImg assetImg={thumbnailPath} isCollection={false}/>}
          {!thumbnailPath && previews.map((preview, index) => (
            <div className={styles["sub-image-wrapper"]} key={index.toString()}>
              {preview.assetImg || preview.name === "empty" ? (
                <AssetImg {...preview} />
              ) : (
                <AssetIcon extension={preview.extension} isCollection={true} />
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
            className={`${styles["selectable-wrapper"]} ${isSelected && styles["selected-wrapper"]
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
      <div className={styles.info}>
        <div className="normal-text">{name}</div>
        <div className={styles["details-wrapper"]}>
          <div className="secondary-text">{`${length} Assets`}</div>
          <FolderOptions
            isShare={isShare}
            downloadFoldercontents={downloadFoldercontents}
            setDeleteOpen={setDeleteOpen}
            shareAssets={shareAssets}
            changeThumbnail={changeThumbnail}
            copyShareLink={copyShareLink}
            copyEnabled={copyEnabled}
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
        message={"Are you sure you want to delete this folder?"}
        modalIsOpen={deleteOpen}
      />
    </div>
  );
};

export default FolderGridItem;
