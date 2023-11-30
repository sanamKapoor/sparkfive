import clsx from "clsx";
import { Line } from "rc-progress";
import { useContext } from "react";

import { AssetContext } from "../../context";
import styles from "./index.module.css";
import Button from "../common/buttons/button";

const AssetDownloadProcess = () => {
  const {
    downloadingPercent,
    downloadingStatus,
    updateDownloadingStatus,
    totalDownloadingAssets,
    downloadingError,
    downloadController,
  } = useContext(AssetContext);

  return (
    <>
      {downloadingStatus !== "zipping" && (
        <div
          className={clsx(styles.container, {
            [styles["center-align"]]: downloadingStatus === "done",
            [styles["less-margin-bottom"]]: downloadingStatus === "zipping" || downloadingStatus === "preparing",
            [styles["err"]]: downloadingStatus === "error",
          })}
        >
          <div className={clsx(styles.row, styles["no-margin"])}>
            <div className={styles.zipheading}>
              <div className={styles.zipheadingInner}>
                <div className={styles.preHeading}>
                  {(downloadingStatus === "zipping" || downloadingStatus === "preparing") && (
                    <>
                      <span className={styles["no-wrap-text"]}>Preparing download</span>
                      <div>
                        <strong>Estimated Time:</strong> less than a minute
                      </div>
                    </>
                  )}
                </div>
                {downloadingStatus === "done" && <span className={styles["no-wrap-text"]}>Download ready</span>}
                {downloadingStatus === "error" && (
                  <span className={styles["no-wrap-text"]}>
                    {downloadingError ? downloadingError : "Something went wrong"}
                  </span>
                )}
              </div>

              {downloadingStatus === "zipping" && (
                <div className={styles["processing-file-count"]}>Zipping {totalDownloadingAssets} assets</div>
              )}
            </div>

            {(downloadingStatus === "done" || downloadingStatus === "error") && (
              <div
                className={styles["close-button"]}
                onClick={() => {
                  updateDownloadingStatus("none", 0, 0, "");
                }}
              >
                x
              </div>
            )}

            {(downloadingStatus === "zipping" || downloadingStatus === "preparing") && (
              <Line
                percent={downloadingPercent}
                strokeWidth={1}
                style={{ height: "10px", width: "100%" }}
                strokeColor="#fff"
                trailColor={"#9597a6"}
              />
            )}
          </div>
        </div>
      )}

      {downloadingStatus === "zipping" && (
        <div className={clsx(styles["zip-container"])}>
          <div className={styles["zip-header"]}>Zipping {totalDownloadingAssets} assets</div>
          <div>Estimated Time: less than a minute</div>
          <div className={styles["zip-download-text"]}>Please wait - download in process</div>

          <div>
            <div className={`dot-flashing ${styles["zip-loading"]}`}></div>
          </div>

          {/*<button*/}
          {/*    className={styles["zip-cancel-btn"]}*/}
          {/*    onClick={() => {*/}
          {/*      downloadController.abort();*/}
          {/*    }}*/}
          {/*>Cancel</button>*/}
        </div>
      )}
    </>
  );
};

export default AssetDownloadProcess;
