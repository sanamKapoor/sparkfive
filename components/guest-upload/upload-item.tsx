import styles from "./upload-item.module.css";

import { AssetOps, Utilities } from "../../assets";

import { UploadingStatus } from "../../types/common/upload";
import IconClickable from "../common/buttons/icon-clickable";

interface UploadItemProps {
  name: string;
  key?: number;
  status?: UploadingStatus;
  error?: string;
}

export default function UploadItem({
  name,
  key,
  status,
  error = "",
}: UploadItemProps) {
  return (
    <div className={`row ${styles["file-upload-row"]}`} key={key}>
      <IconClickable
        src={AssetOps.uploadFilesGray}
        additionalClass={styles["file-icon"]}
        onClick={() => {}}
      />
      <span className={styles["file-name"]}>{name}</span>
      {status === "done" && (
        <IconClickable
          src={Utilities.radioButtonEnabled}
          additionalClass={styles["check-icon"]}
          onClick={() => {}}
        />
      )}
      {status === "fail" && (
        <IconClickable
          src={Utilities.info}
          additionalClass={styles["check-icon"]}
          tooltipId={`asset-${key}`}
          tooltipText={`${error}`}
          onClick={() => {}}
        />
      )}
    </div>
  );
}
