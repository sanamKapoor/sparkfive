import React from "react";
import { Utilities } from "../../assets";
import { DropDownOption } from "../../types/common/components";
import { IUploadingFile, UploadingStatus } from "../../types/common/upload";
import AssetUploadProcess from "../asset-upload-process";
import ButtonIcon from "../common/buttons/button-icon";
import DropdownOptions from "./Dropdown/DropdownOptions";
import styles from "./index.module.css";
import UploadItem from "./upload-item";

interface GuestUploadSectionProps {
  uploadEnabled: boolean;
  uploading: boolean;
  uploadingStatus: UploadingStatus;
  files: IUploadingFile[];
  dropDownOptions: DropDownOption[];
  retryListCount: number;
  uploadingAssets: any; //TODO: fix this type
}

const GuestUploadSection: React.FC<GuestUploadSectionProps> = ({
  uploadEnabled,
  uploading,
  uploadingStatus,
  files,
  dropDownOptions,
  retryListCount,
  uploadingAssets,
}) => {
  return (
    <div className={styles.upload_area}>
      <div className={styles.upload_title}>Upload Files</div>
      {uploadEnabled && (
        <>
          <div className={styles.subtitle}>
            Please upload your files or folders that you would like to submit to
            us. This is more of text. Please upload your files or folders that
            you would like to submit to us
          </div>

          {uploading ? (
            <div>
              <div className={styles.cancel}>Cancel</div>
              <div className={styles["file-list-wrapper"]}>
                <div className={styles["file-list-header"]}>
                  <div className={styles.files_count}>
                    {files.length} Files Ready to Submit
                  </div>
                  <ButtonIcon icon={Utilities.addAlt} text="UPLOAD" />
                </div>
                <div className={styles["file-list"]}>
                  {files.map((file, index) => {
                    return (
                      <UploadItem
                        name={file.asset.name}
                        key={index}
                        status={file.status}
                        error={file.error}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={`row justify-center ${styles["row"]}`}>
                <DropdownOptions dropdownOptions={dropDownOptions} />
              </div>

              <div className={styles.option_helpertext}>
                *1GB max upload size & 200 files max at once
              </div>
            </>
          )}
        </>
      )}

      {uploading && (
        <>
          {uploadingStatus !== "none" && uploadingAssets.length > 0 && (
            <AssetUploadProcess />
          )}

          {uploadingStatus === "done" && retryListCount > 0 && (
            <div className={`row justify-center text-align-center m-b-10`}>
              {retryListCount} assets uploaded fail
            </div>
          )}

          {uploadingStatus === "done" && retryListCount > 0 && (
            <div className={`row justify-center text-align-center m-b-25`}>
              Press Retry button to try again
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GuestUploadSection;