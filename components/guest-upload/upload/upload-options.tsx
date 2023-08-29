import { useRef } from "react";
import { Assets } from "../../../assets";
import Button from "../../common/buttons/button";
import DropdownOptions from "../Dropdown/DropdownOptions";
import styles from "../index.module.css";
import UploadList from "./upload-list";

interface UploadOptionsProps {
  showError?: boolean;
  uploadingFiles: Array<unknown>; //TODO: fix type
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const UploadOptions: React.FC<UploadOptionsProps> = ({
  showError = false,
  onFileChange,
  uploadingFiles,
  uploading,
  onCancel,
}) => {
  const fileBrowserRef = useRef(undefined);
  const folderBrowserRef = useRef(undefined);

  const dropdownOptions = [
    {
      label: "Upload",
      text: "Files",
      onClick: () => fileBrowserRef.current.click(),
      icon: Assets.upload,
      CustomContent: null,
    },
    {
      label: "Upload",
      text: "Folder",
      onClick: () => folderBrowserRef.current.click(),
      icon: Assets.folder,
      CustomContent: null,
    },
  ];
  return (
    <div>
      <div className={styles.upload_title}>Upload Files</div>

      <div className={styles.subtitle}>
        {showError
          ? "You are trying to upload too many files. Re-upload no more than 200 files, the total size of the files should not exceed 1GB"
          : "Please upload your files or folders that you would like to submit to us.  After files are selected, click “Submit Upload” button to send your files."}
      </div>
      {!uploading ? (
        <>
          <input
            multiple={true}
            id="file-input-id"
            ref={fileBrowserRef}
            style={{ display: "none" }}
            type="file"
            onChange={onFileChange}
          />
          <input
            multiple={true}
            id="file-input-id"
            ref={folderBrowserRef}
            style={{ display: "none" }}
            type="file"
            webkitdirectory=""
            onChange={onFileChange}
          />
          <div className={`row justify-center ${styles["row"]}`}>
            <DropdownOptions dropdownOptions={dropdownOptions} />
          </div>

          <div className={styles.option_helpertext}>
            *1GB max upload size & 200 files max at once
          </div>
        </>
      ) : (
        <div>
          <Button text="Cancel" onClick={onCancel} />
          <UploadList files={uploadingFiles} />
          <Button text="Submit Upload" disabled={uploading} />
        </div>
      )}
    </div>
  );
};

export default UploadOptions;
