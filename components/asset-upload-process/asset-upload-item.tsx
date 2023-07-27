import { Line } from "rc-progress";
import { useContext } from "react";

import { Utilities } from "../../assets";
import { AssetContext } from "../../context";
import styles from "./index.module.css";

const AssetUploadItem = ({ item, index, handleRetry }) => {
  const {
    uploadingStatus,
    uploadingPercent,
    uploadingFile,
    uploadRemainingTime,
  } = useContext(AssetContext);

  const uploadSuccess = item?.status === "done" && uploadingStatus === "done";
  const uploadFail = item?.status === "fail" && uploadingStatus === "done";
  const uploadInProgress =
    uploadingStatus === "uploading" || uploadingStatus === "re-uploading";

  const uploadProgressPercent =
    uploadingFile === index
      ? uploadingPercent
      : item?.status === "done" || item?.status === "fail"
      ? 100
      : 0;

  return (
    <div className={styles.innerUploadList}>
      <div className={styles.uploadItem}>
        <div>{item?.asset?.name}</div>
        {uploadSuccess && (
          <>
            <div>Complete</div>
            <div className={styles.flexdiv}>
              <img src={Utilities.checkMark} alt={"complete"} />
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
              strokeColor="#10bda5"
              className={styles.linePercent}
              trailColor="#9597a6"
            />
            {uploadProgressPercent ?? 0}%
          </div>
        )}
      </div>
      {(uploadInProgress ||
        item?.status === "done" ||
        item?.status === "fail") && (
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
