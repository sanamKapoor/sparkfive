import React, { useContext, useEffect } from "react";

import styles from "./index.module.css";

import { AssetContext } from "../../context";

import { Utilities } from "../../assets";
import teamApi from "../../server-api/team";
import AssetUploadItem from "./asset-upload-item";
import AssetImportItem from "./asset-import-item";

const AssetUploadProcess = () => {
  const {
    uploadingAssets,
    uploadingStatus,
    showUploadProcess,
    uploadingFile,
    dropboxUploadingFile,
    uploadSourceType,
    retryListCount,
    setUploadingAssets,
    reUploadAsset,
    assets,
    activeFolder,
    folderGroups,
  } = useContext(AssetContext);

  const uploadFailedAssets = uploadingAssets.filter((asset) => asset.status === "fail");

  const handleRetry = async (i) => {
    const failedAssets = uploadFailedAssets.map((item) => ({
      ...item,
      status: "queued",
      isUploading: true,
      index: i,
    }));

    showUploadProcess("uploading", i);
    setUploadingAssets(failedAssets);

    let totalSize = 0;

    uploadingAssets.map((asset) => {
      totalSize += asset.asset.size;
    });

    const { data: subFolderAutoTag } = await teamApi.getAdvanceOptions();

    await reUploadAsset(i, failedAssets, assets, totalSize, failedAssets, activeFolder, folderGroups, subFolderAutoTag);
  };

  const uploadInProgress = uploadingStatus === "uploading" || uploadingStatus === "re-uploading";

  return (
    <>
      <div className={styles.uploadingContainer}>
        <div className={styles.uploadHeader}>
          {uploadInProgress &&
            (uploadSourceType === "dropbox" ? (
              <div className={styles.mainHeading}>
                Uploading {!dropboxUploadingFile ? 1 : dropboxUploadingFile + 1} of {uploadingAssets.length} assets
              </div>
            ) : (
              <div className={styles.mainHeading}>
                Uploading {!uploadingFile ? 1 : uploadingFile + 1} of{" "}
                {uploadingStatus === "re-uploading" ? retryListCount : uploadingAssets.length} assets
              </div>
            ))}
          {uploadingStatus === "done" && (
            <div className={styles.mainHeading}>
              {uploadingAssets.length - uploadFailedAssets.length} of {uploadingAssets.length} assets uploaded
            </div>
          )}
          <Utilities.blueClose
            className={styles.closebtn}
            onClick={() => {
              showUploadProcess("none");
            }}
          />
        </div>

        <div className={styles.list}>
          {uploadSourceType === "dropbox" ? (
            <AssetImportItem handleRetry={handleRetry} />
          ) : (
            uploadingAssets.length > 0 &&
            uploadingAssets.map((item, index) => (
              <AssetUploadItem key={index} item={item} index={index} handleRetry={handleRetry} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AssetUploadProcess;
