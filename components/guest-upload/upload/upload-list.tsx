import { Utilities } from "../../../assets";
import { IGuestUploadItem } from "../../../interfaces/guest-upload/guest-upload";
import ButtonIcon from "../../common/buttons/button-icon";
import styles from "../upload-item.module.css";
import DisableBtn from "./disable-btn";
import UploadListItem from "./upload-list-item";

interface UploadListProps {
  files: IGuestUploadItem[];
  onUpload: () => void;
  uploadingPercent: number;
  onRetry: (i: number) => void;
  additionUploadDisabled: boolean;
  uploadingIndex: number;
}

const UploadList: React.FC<UploadListProps> = ({
  files,
  onUpload,
  uploadingPercent,
  onRetry,
  onRemove,
  additionUploadDisabled,
  uploadingIndex,
}) => {
  return (
    <div>
      <div className={styles.updateStatus}>
        <h2>
          {uploadingIndex === files.length && files.every((file) => file.status === "done")
            ? `Ready to Submit ${files.length} files`
            : `Uploading ${uploadingIndex} of ${files.length} files`}
        </h2>
        <div className={styles.uploadBtn}>
          {additionUploadDisabled ? (
            <DisableBtn icon={Utilities.add} text="Upload" />
          ) : (
            <ButtonIcon
              SVGElement={Utilities.addAlt}
              text="UPLOAD"
              onClick={onUpload}
              additionalClass={styles.uploadFileBtnIcon}
            />
          )}
        </div>
      </div>

      {files.map((data, index) => {
        return (
          <UploadListItem key={index} index={index} data={data} onRetry={onRetry} uploadingPercent={uploadingPercent} />
        );
      })}
    </div>
  );
};

export default UploadList;
