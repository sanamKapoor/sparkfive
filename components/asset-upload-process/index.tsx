import { useContext, useState } from "react";
import { Line } from "rc-progress";
import clsx from "clsx";

import styles from "./index.module.css";

import { AssetContext } from "../../context";
import React from "react";

import { Utilities } from "../../assets";
import teamApi from "../../server-api/team";

const AssetUploadProcess = () => {
  const {
    uploadingAssets,
    uploadingStatus,
    showUploadProcess,
    uploadingFile,
    uploadRemainingTime,
    uploadingPercent,
    dropboxUploadingFile,
    uploadSourceType,
    retryListCount,
    setUploadingAssets,
    reUploadAsset,
    assets,
    activeFolder,
    folderGroups
  } = useContext(AssetContext);

  const failAssetsCount = uploadingAssets.filter(
    (asset) => asset.status === "fail"
  ).length;

  const handleRetry = async (i) => {
    const failedAssets = uploadingAssets.filter(
      (asset) => asset.status === "fail"
    ).map(item => ({...item, status: 'queued', isUploading: true, index: i }))

    showUploadProcess('uploading', i)
		setUploadingAssets(failedAssets);

    let totalSize = 0;
    // Calculate the rest of size
    uploadingAssets.map((asset)=>{
      totalSize += asset.asset.size
    })

    const { data: subFolderAutoTag } = await teamApi.getAdvanceOptions()

    await reUploadAsset(
      i,
      failedAssets,
      assets,
      totalSize,
      failedAssets,
      activeFolder,
      folderGroups,
      subFolderAutoTag
    );
  };

  return (
    <>
      <div className={styles.uploadingContainer}>
        <div className={styles.uploadHeader}>
          {(uploadingStatus === "uploading" ||
            uploadingStatus === "re-uploading") &&
            (uploadSourceType === "dropbox" && dropboxUploadingFile ? (
              <div className={styles.mainHeading}>
                Uploading {dropboxUploadingFile! + 1} of{" "}
                {uploadingAssets.length} assets
              </div>
            ) : (
              <div className={styles.mainHeading}>
                Uploading {uploadingFile! + 1} of{" "}
                {uploadingStatus === "re-uploading"
                  ? retryListCount
                  : uploadingAssets.length}
                {" "}assets
              </div>
            ))}
          {uploadingStatus === "done" && (
            <div className={styles.mainHeading}>
              {uploadingAssets.length - failAssetsCount} of{" "}
              {uploadingAssets.length} assets uploaded
            </div>
          )}
          <div className={styles.subHeading}>
            Estimated Time:{" "}
            {uploadingStatus === "done" ? "Finished" : uploadRemainingTime}
          </div>
            <img
              src={Utilities.blueClose}
              alt={"close"}
              className={styles.closebtn}
              onClick={() => {
                showUploadProcess("none");
              }}
            />
        </div>

        {uploadingAssets.length > 0 &&
          uploadingAssets.map((item) => (
            <div className={styles.innerUploadList}>
              <div className={styles.uploadItem}>
                <div>{item?.asset?.name}</div>
                {item?.status === "done" && uploadingStatus === "done" && (
                  <>
                    <div>Complete</div>
                    <div className={styles.flexdiv}>
                      <img src={Utilities.checkMark} alt={"complete"} />
                    </div>
                  </>
                )}
                {item?.status === "fail" && uploadingStatus === "done" && (
                  <>
                    <span>Error</span>
                    <div style={{ color: "red", fontSize: "20px" }}>x</div>
                    <span
                      className={`${styles["underline-text"]} ${styles["no-max-min-width"]}`}
                      onClick={() => handleRetry(item?.index)}
                    >
                      Retry
                    </span>
                  </>
                )}
                {(uploadingStatus === "uploading" ||
                  uploadingStatus === "re-uploading") && (
                  <div className={styles.lineBar}>
                    <Line
                      percent={uploadingPercent}
                      strokeWidth={1}
                      strokeColor="#10bda5"
                      style={{
                        width: "158px",
                        height: "12px",
                        borderRadius: "10px",
                      }}
                      trailColor={"#9597a6"}
                    />
                    {uploadingPercent ?? 0}%
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AssetUploadProcess;
