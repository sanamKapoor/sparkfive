import fileSize from "filesize";
import { Line } from "rc-progress";
import React from "react";
import { AssetOps, Utilities } from "../../../assets";
import { IGuestUploadItem } from "../../../interfaces/guest-upload/guest-upload";
import styles from "../upload-item.module.css";
interface UploadListItemProps {
  index: number;
  data: IGuestUploadItem;
  onRetry: (i: number) => void;
  uploadingPercent: number;
}

const UploadListItem: React.FC<UploadListItemProps> = ({
  index,
  data,
  onRetry,
  uploadingPercent,
}) => {
  return (
    <>
      <div key={index}>
        <div className={styles.uploadWrapper}>
          <div className={styles.imageInfo}>
            <div className={styles.fileImg}>
              <img src={Utilities.document} />
            </div>
            <div>
              <p>{data.asset.name}</p>
            </div>
          </div>
          <div>
            {!data.isUploading && data.status === "queued" && (
              <div className={styles.progressBar}>
                <Line
                  className={styles.progressLine}
                  percent={uploadingPercent}
                  strokeColor="
            #10BDA5"
                  strokeWidth={3}
                  trailWidth={3}
                  trailColor="#e5e5e5"
                  style={{ width: "80px", height: "10px" }}
                />
              </div>
            )}
            {!data.isUploading && data.status === "fail" && (
              <div className={styles.errorMsg}>
                <p>Upload error</p>
                <div className={styles.loadingImg}>
                  <img src={AssetOps.reload} onClick={() => onRetry(index)} />
                </div>
              </div>
            )}

            {data.isUploading && data.status === "in-progress" && (
              <div className={styles.progressBar}>
                <Line
                  percent={uploadingPercent}
                  strokeColor="
            #10BDA5"
                  strokeWidth={3}
                  trailWidth={3}
                  trailColor="#e5e5e5"
                  style={{
                    width: "80px",
                    height: "10px",
                    borderRadius: "30px",
                  }}
                />
              </div>
            )}

            {!data.isUploading && data.status === "done" && (
              <div className={styles.fileSize}>
                <p>{fileSize(data.file.size)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadListItem;
