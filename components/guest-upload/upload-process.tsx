import clsx from "clsx";
import { Line } from "rc-progress";

import styles from "./upload-process.module.css";

interface AssetUploadProcessProps {
  uploadingAssets: Array<unknown>;
  uploadingStatus: "done" | "uploading" | "re-uploading";
  showUploadProcess: (val: string) => void;
  uploadingFile: number;
  uploadingPercent: number;
  setUploadDetailOverlay: (val: boolean) => void;
  uploadingFileName: string;
  retryListCount: number;
}

const AssetUploadProcess: React.FC<AssetUploadProcessProps> = (props) => {
  const {
    uploadingAssets,
    uploadingStatus,
    showUploadProcess,
    uploadingFile,
    uploadingPercent,
    setUploadDetailOverlay,
    uploadingFileName,
    retryListCount,
  } = props;

  const uploadedAssets = uploadingAssets.filter(
    (asset) => asset.status === "done"
  );
  const failAssetsCount = uploadingAssets.filter(
    (asset) => asset.status === "fail"
  ).length;

  return (
    <div
      className={clsx(styles.container, {
        [styles["center-align"]]: uploadingStatus === "done",
        [styles["less-margin-bottom"]]: uploadingStatus === "uploading",
      })}
    >
      <div className={clsx(styles.row, styles["no-margin"])}>
        {(uploadingStatus === "uploading" ||
          uploadingStatus === "re-uploading") && (
          <>
            <span>
              {
                <span className={styles["no-wrap-text"]}>
                  {uploadingFileName}
                </span>
              }
            </span>

            {!isNaN(uploadingFile) && (
              <span className={styles["processing-file-count"]}>
                {uploadingFile + 1} of{" "}
                {uploadingStatus === "re-uploading"
                  ? retryListCount
                  : uploadingAssets.length}{" "}
                assets
              </span>
            )}
          </>
        )}

        {uploadingStatus === "done" && (
          <span>
            {uploadedAssets.length} assets uploaded successfully.
            {failAssetsCount > 0 && (
              <span
                className={`${styles["fail-text"]} ${styles["no-max-min-width"]}`}
              >
                {failAssetsCount} failed
              </span>
            )}
          </span>
        )}
        {uploadingStatus === "done" && failAssetsCount > 0 && (
          <span
            className={`${styles["underline-text"]} ${styles["no-max-min-width"]}`}
            onClick={() => {
              setUploadDetailOverlay(true);
            }}
          >
            See detail
          </span>
        )}
      </div>
      {uploadingStatus === "done" && (
        <div
          className={styles["close-button"]}
          onClick={() => {
            showUploadProcess("none");
          }}
        >
          x
        </div>
      )}
      {(uploadingStatus === "uploading" ||
        uploadingStatus === "re-uploading") && (
        <Line
          percent={uploadingPercent}
          strokeWidth={1}
          strokeColor="#fff"
          trailColor={"#9597a6"}
        />
      )}
    </div>
  );
};

export default AssetUploadProcess;
