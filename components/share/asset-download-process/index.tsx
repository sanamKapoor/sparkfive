import clsx from "clsx";
import { Line } from "rc-progress";

import styles from "./index.module.css";

const AssetDownloadProcess = (props) => {
  const { downloadingPercent, downloadingStatus, onClose, downloadingError = "", selectedAsset = 0 } = props;

  return (
    <>
      {downloadingStatus !== "zipping" && (
        <div
          className={clsx(styles.container, {
            [styles["center-align"]]: downloadingStatus === "done",
            [styles["less-margin-bottom"]]: downloadingStatus === "zipping" || downloadingStatus === "preparing",
          })}
        >
          <div className={clsx(styles.row, styles["no-margin"])}>
            {(downloadingStatus === "zipping" || downloadingStatus === "preparing") && (
              <>
                <span>{<span className={styles["no-wrap-text"]}>Preparing download</span>}</span>
              </>
            )}

            {downloadingStatus === "zipping" && (
              <span className={styles["processing-file-count"]}>Zipping {selectedAsset} assets</span>
            )}

            {downloadingStatus === "done" && <span>Download ready</span>}

            {downloadingStatus === "error" && <span>{downloadingError}</span>}

            {(downloadingStatus === "done" || downloadingStatus === "error") && (
              <div className={styles["close-button"]} onClick={onClose}>
                x
              </div>
            )}
            {(downloadingStatus === "zipping" || downloadingStatus === "preparing") && (
              <Line percent={downloadingPercent} strokeWidth={1} strokeColor="#fff" trailColor={"#9597a6"} />
            )}
          </div>
        </div>
      )}
      {downloadingStatus === "zipping" && (
        <div className={clsx(styles["zip-container"])}>
          <div className={styles["zip-header"]}>Zipping {selectedAsset} assets</div>
          <div>Estimated Time: less than a minute</div>
          <div className={styles["zip-download-text"]}>Please wait - download in process</div>
          <div>
            <div className={`dot-flashing ${styles["zip-loading"]}`}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetDownloadProcess;
