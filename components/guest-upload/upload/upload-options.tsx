import { useRef } from "react";
import { Assets } from "../../../assets";
import DropdownOptions from "../Dropdown/DropdownOptions";
import styles from "../index.module.css";

interface UploadOptionsProps {
  uploadingFiles: Array<unknown>; //TODO: fix type
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const UploadOptions: React.FC<UploadOptionsProps> = ({ onFileChange }) => {
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
  );
};

export default UploadOptions;
