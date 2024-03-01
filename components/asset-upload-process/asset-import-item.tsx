import React, { useContext, useEffect } from "react";
import { Line } from "rc-progress";

import styles from "./index.module.css";
import { AssetContext } from "../../context";

const AssetImportItem = ({ handleRetry }) => {
  const {
    uploadingStatus,
    uploadingPercent,
    uploadRemainingTime,
    dropboxUploadingFile,
    uploadingAssets,
  } = useContext(AssetContext);

  const uploadInProgress =
    uploadingStatus === "uploading" || uploadingStatus === "re-uploading";

  const remainingTime =
    uploadRemainingTime === "0 seconds remaining"
      ? "1 second remaining"
      : uploadRemainingTime;

  useEffect(() => {}, [dropboxUploadingFile]);
  return (
    <div className={styles.innerUploadList}>
      <div className={styles.uploadItem}>
        <div>
          {
            uploadingAssets[
              (!dropboxUploadingFile ? 0 : dropboxUploadingFile + 1) %
                uploadingAssets?.length
            ]?.asset?.name
          }
        </div>
        {uploadInProgress && (
          <div className={styles.lineBar}>
            <Line
              percent={uploadingPercent}
              strokeWidth={1}
              strokeColor="#10bda5"
              className={styles.linePercent}
              trailColor="#9597a6"
            />
            {uploadingPercent ?? 0}%
          </div>
        )}
      </div>
      {(uploadInProgress ||
        uploadingStatus === "done" ||
        uploadingStatus === "fail") && (
        <div className={styles.subHeading}>
          Estimated Time:
          {uploadingStatus === "done" || uploadingStatus === "fail"
            ? "Finished"
            : remainingTime}
        </div>
      )}
    </div>
  );
};

export default AssetImportItem;
