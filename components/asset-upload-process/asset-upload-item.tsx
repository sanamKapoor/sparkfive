import { Line } from "rc-progress";
import { useContext, useEffect, useState } from "react";

import { Utilities } from "../../assets";
import { AssetContext } from "../../context";
import styles from "./index.module.css";
import { getThemeFromLocalStorage } from "../../utils/theme";
import { defaultPrimaryColor } from "../../constants/theme";

const AssetUploadItem = ({ item, index, handleRetry }) => {
  const {
    uploadingStatus,
    uploadingPercent,
    uploadingFile,
    uploadRemainingTime,
    uploadSourceType,
    dropboxUploadingFile,
  } = useContext(AssetContext);

  const uploadSuccess = item?.status === "done" && uploadingStatus === "done";
  const uploadFail = item?.status === "fail" && uploadingStatus === "done";
  const uploadInProgress = uploadingStatus === "uploading" || uploadingStatus === "re-uploading";

  const uploadingFileIndex = uploadSourceType === "dropbox" ? dropboxUploadingFile : uploadingFile;

  const isUploadComplete = item?.status === "done" || item?.status === "fail" ? 100 : 0;

  const uploadProgressPercent = uploadingFileIndex === index ? uploadingPercent : isUploadComplete;

  const [loadingColor, setLoadingColor] = useState(defaultPrimaryColor);

  const loadCurrentTheme = () => {
    // Call API to get team theme then set to local storage
    const theme = getThemeFromLocalStorage();
    setLoadingColor(theme?.primary || defaultPrimaryColor);
  };

  useEffect(() => {
    loadCurrentTheme;
  }, []);

  return (
    <div className={styles.innerUploadList}>
      <div className={styles.uploadItem}>
        <div>{item?.asset?.name}</div>
        {uploadSuccess && (
          <>
            <div>Complete</div>
            <div className={styles.flexdiv}>
              <Utilities.checkMark />
            </div>
          </>
        )}
        {uploadFail && (
          <>
            <span>Error</span>
            <div className={styles.retryDiv}>x</div>
            <span
              className={`${styles["underline-text"]} ${styles["no-max-min-width"]}`}
              onClick={() => handleRetry(item?.index)}
            >
              Retry
            </span>
          </>
        )}
        {uploadInProgress && (
          <div className={styles.lineBar}>
            <Line
              percent={uploadProgressPercent}
              strokeWidth={1}
              strokeColor={loadingColor}
              className={styles.linePercent}
              trailColor="#9597a6"
            />
            {uploadProgressPercent ?? 0}%
          </div>
        )}
      </div>
      {(uploadInProgress || item?.status === "done" || item?.status === "fail") && (
        <div className={styles.subHeading}>
          Estimated Time:{" "}
          {item?.status === "done" || item?.status === "fail"
            ? "Finished"
            : uploadRemainingTime === "0 seconds remaining"
            ? "1 second remaining"
            : uploadRemainingTime}
        </div>
      )}
    </div>
  );
};

export default AssetUploadItem;
