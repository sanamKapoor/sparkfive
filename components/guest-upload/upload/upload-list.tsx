import { Utilities } from "../../../assets";
import { IGuestUploadItem } from "../../../types/guest-upload/guest-upload";
import ButtonIcon from "../../common/buttons/button-icon";
import UploadListItem from "./upload-list-item";
import styles from "../upload-item.module.css"
import DisableBtn from "./disable-btn";


interface UploadListProps {
  files: IGuestUploadItem[];
  onUpload: () => void;
  uploadingPercent: number;
  onRetry: (i: number) => void;
  onRemove: (i: number) => void;
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
        {uploadingIndex === files.length &&
        files.every((file) => file.status === "done")
          ? `Ready to Submit ${files.length} files`
          : `Uploading ${uploadingIndex} of ${files.length} files`}
      </h2>
      <div className={styles.uploadBtn}>
      <ButtonIcon
        icon={Utilities.addAlt}
        text="Upload"
        onClick={onUpload}
        disabled={additionUploadDisabled}
      />
      <DisableBtn 
       icon={Utilities.add}
       text="Upload"
       onClick={onUpload}
        disabled={additionUploadDisabled}
      
      />
    
      </div>
      </div>
     
      
      {files.map((data, index) => {
        return (
         
            <UploadListItem
            key={index}
            index={index}
            data={data}
            onRemove={onRemove}
            onRetry={onRetry}
            uploadingPercent={uploadingPercent}
          />

         
          
        );
      })}
    </div>
  );
};

export default UploadList;
