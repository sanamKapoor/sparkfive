import React from "react";
import { Utilities } from "../../assets";
import { DropDownOption } from "../../types/common/components";
import { UploadingStatus } from "../../types/common/upload";
import Button from "../common/buttons/button";
import ButtonIcon from "../common/buttons/button-icon";
import DropdownOptions from "./Dropdown/DropdownOptions";
import styles from "./index.module.css";
import UploadItem from "./upload-item";
import AssetUploadProcess from "./upload-process";

interface GuestUploadSectionProps {
  uploadEnabled: boolean;
  uploading: boolean;
  uploadingStatus: UploadingStatus;
  setUploadingStatus: (val: UploadingStatus) => void;
  files: {
    asset: Record<string, string>;
    status: "done" | "fail";
    error: string;
  }[];
  dropDownOptions: DropDownOption[];
  retryListCount: number;
  uploadingAssets: any; //TODO: fix this type
  showUploadProcess: (val: string) => void;
  uploadingFile: number;
  uploadingPercent: number;
  setUploadDetailOverlay: (val: boolean) => void;
  uploadingFileName: string;
}

const GuestUploadSection: React.FC<GuestUploadSectionProps> = ({
  uploadEnabled,
  uploading,
  uploadingStatus,
  files,
  dropDownOptions,
  retryListCount,
  uploadingAssets,
  showUploadProcess,
  uploadingFile,
  uploadingPercent,
  setUploadDetailOverlay,
  uploadingFileName,
  setUploadingStatus,
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
                * 1GB min & 200 files min at once
              </div>
            </>
          )}
        </>
      )}

      {uploading && (
        <>
          {uploadingStatus === "uploading" && (
            <AssetUploadProcess
              uploadingAssets={uploadingAssets}
              uploadingStatus={uploadingStatus}
              showUploadProcess={showUploadProcess}
              uploadingFile={uploadingFile}
              uploadingPercent={uploadingPercent}
              setUploadDetailOverlay={setUploadDetailOverlay}
              uploadingFileName={uploadingFileName}
              retryListCount={retryListCount}
            />
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

          {uploadingStatus !== "uploading" && (
            <div className={styles.form_button}>
              <Button
                form="contact-form"
                text={retryListCount ? "Retry" : "Submit"}
                className="container input-height-primary"
                onClick={() => setUploadingStatus("done")}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GuestUploadSection;
