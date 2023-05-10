import { useContext } from "react";
import { Line } from "rc-progress";
import clsx from "clsx";

import styles from "./index.module.css";

import { AssetContext } from "../../context";
import React from "react";
import { Utilities } from "../../assets";

const AssetUploadProcess = () => {
  const {
    uploadingAssets,
    uploadingStatus,
    showUploadProcess,
    uploadingFile,
    uploadRemainingTime,
    uploadingPercent,
    setUploadDetailOverlay,
    uploadingFileName,
    dropboxUploadingFile,
    uploadSourceType,
    uploadingType,
    retryListCount,
    folderImport,
  } = useContext(AssetContext);

  const uploadedAssets = uploadingAssets.filter(
    (asset) => asset.status === "done"
  );
  const failAssetsCount = uploadingAssets.filter(
    (asset) => asset.status === "fail"
  ).length;

  return (
    <div className={styles.uploadingContainer}>
      <div className={styles.uploadHeader}>
        <div className={styles.mainHeading}>
          Uploading {uploadingFile! + 1} of{" "}
          {uploadingStatus === "re-uploading"
            ? retryListCount
            : uploadingAssets.length}{" "}
          assets
        </div>
        <div className={styles.subHeading}>
          Estimated Time:{" "}
          {uploadingStatus === "done" ? "Finished" : "Less than 1 minute"}
        </div>
        {uploadingStatus === "done" && (
          <img
            src={Utilities.blueClose}
            alt={"close"}
            className={styles.closebtn}
            onClick={() => {
              showUploadProcess("none");
            }}
          />
        )}
      </div>
      <div className={styles.innerUploadList}>
        <div className={styles.uploadItem}>
          <div>{uploadingFileName}</div>
          {uploadingStatus === "done" && failAssetsCount === 0 && (
            <>
              <div>Complete</div>
              <div className={styles.flexdiv}>
                <img src={Utilities.checkMark} alt={"complete"} />
              </div>
            </>
          )}
          {uploadingStatus === "done" && failAssetsCount > 0 && (
            <>
              <span>Error</span>
              <div>x</div>
              <span className={`${styles['underline-text']} ${styles['no-max-min-width']}`}>Retry</span>
            </>
          )}
          {(uploadingStatus === "uploading" ||
            uploadingStatus === "re-uploading") && (
            <div className={styles.lineBar}>
              <Line
                percent={uploadingPercent}
                strokeWidth={1}
                strokeColor="#10bda5"
                style={{ width: "158px", height: "12px", borderRadius: "10px" }}
                trailColor={"#9597a6"}
              />
              {uploadingPercent}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetUploadProcess;
