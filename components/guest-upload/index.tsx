import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import uploadLinkApi from "../../server-api/guest-upload";
import toastUtils from "../../utils/toast";
import SpinnerOverlay from "../common/spinners/spinner-overlay";
import PasswordOverlay from "../share-collections/password-overlay";

import { SocketContext } from "../../context";
import requestUtils from "../../utils/requests";

import { defaultInfo } from "../../config/data/upload-links";
import {
  IGuestUploadItem,
  IGuestUserInfo,
} from "../../interfaces/guest-upload/guest-upload";
import {
  getFolderKeyAndNewNameByFileName,
  getTotalSize,
  isFilesInputValid,
} from "../../utils/upload";
import ContactForm from "./contact-form";
import GuestDetails from "./guest-details";
import styles from "./index.module.css";
import UploadList from "./upload/upload-list";
import UploadOptions from "./upload/upload-options";

import shareUploadLinkApi from "../../server-api/share-upload-link";
import Button from "../common/buttons/button";

import BaseModal from "../common/modals/base";

interface GuestUploadMainProps {
  logo: string;
  setLogo: (val: string) => void;
  banner: string;
  setBanner: (val: string) => void;
}

const GuestUploadMain: React.FC<GuestUploadMainProps> = ({
  logo,
  setLogo,
  banner,
  setBanner,
}) => {
  const { query } = useRouter();
  const { socket, connected, connectSocket } = useContext(SocketContext);

  const [guestInfo, setGuestInfo] = useState<IGuestUserInfo>(defaultInfo);
  const [loading, setLoading] = useState<boolean>(false);
  const [activePasswordOverlay, setActivePasswordOverlay] =
    useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showUploadSection, setShowUploadSection] = useState<boolean>(false);

  const [showUploadError, setShowUploadError] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<IGuestUploadItem[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const [uploadingPercent, setUploadingPercent] = useState<number>(0);

  const [activeRequestId, setActiveRequestId] = useState<string>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(false);

  const [uploadingIndex, setUploadingIndex] = useState(0);

  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (query?.code) {
      getLinkInfo();
    }
  }, [query]);

  const getLinkInfo = async () => {
    try {
      setLoading(true);
      const { data } = await shareUploadLinkApi.getLinkDetail({
        url: query.code,
      });

      if (data) {
        // update info
        setTeamName(data.team);

        if (data.bannerSrc) {
          setBanner(data.bannerSrc);
        }
        setLogo(data.logo);
        setActivePasswordOverlay(false);
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        setLogo(err?.response?.data?.teamIcon);
      } else {
        toastUtils.error("Something went wrong");
      }
      setActivePasswordOverlay(true);
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (password: string) => {
    try {
      setLoading(true);

      const { data } = await uploadLinkApi.authenticateLink({
        password,
        url: query.code,
      });

      // Set axios headers
      requestUtils.setAuthToken(data.token, "share-upload-authorization");

      connectSocket(data.token);

      getLinkInfo();
    } catch (err) {
      toastUtils.error("Wrong password or invalid link, please try again");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = (data: IGuestUserInfo) => {
    setGuestInfo(data);
    setShowPreview(true);
    setShowUploadSection(true);
  };

  const onCancelGuestInfo = () => {
    //TODO: check if this pattern can be avoided
    setGuestInfo(defaultInfo);
    setShowPreview(false);
    setShowUploadSection(false);
    setShowUploadError(false);
    setUploading(false);
  };

  //TODO: add type for files
  const uploadFiles = async (
    i: number,
    files: Array<any>,
    requestId: string | null,
    isRetry = false
  ) => {
    setUploadingIndex(i + 1);
    const totalSize = getTotalSize(files);
    let folderGroup = {};
    let currentUploadingFolderId = null;
    const formData = new FormData();
    let file = files[i].file;

    files[i].isUploading = true;
    files[i].status = "in-progress";
    setUploadingFiles([...files]);

    // Get file group info, this returns folderKey and newName of file
    let fileGroupInfo = getFolderKeyAndNewNameByFileName(
      file.webkitRelativePath
    );
    // If user is uploading files in folder which is not saved from server yet
    if (fileGroupInfo.folderKey) {
      // Current folder Group have the key
      if (folderGroup[fileGroupInfo.folderKey]) {
        currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey];
        // Assign new file name without splash
        file = new File(
          [file.slice(0, file.size, file.type)],
          fileGroupInfo.newName,
          {
            type: file.type,
            lastModified: file.lastModifiedDate || new Date(file.lastModified),
          }
        );
      }
    }

    // Append file to form data
    formData.append("asset", file);
    formData.append(
      "fileModifiedAt",
      new Date(
        (file.lastModifiedDate || new Date(file.lastModified)).toUTCString()
      ).toISOString()
    );

    let attachedQuery = {
      estimateTime: 1,
      size: file.size,
      totalSize,
      url: query.code,
      ...guestInfo,
    };

    if (requestId) {
      attachedQuery["requestId"] = requestId;
    }
    // Uploading the new folder
    if (currentUploadingFolderId) {
      attachedQuery["folderId"] = currentUploadingFolderId;
    }

    if (i === files.length - 1) {
      setDisabled(false);
      attachedQuery["alertAdmin"] = true;
    }

    const { firstName, lastName, ...rest } = attachedQuery;

    const newQuery = {
      ...rest,
      name: `${firstName} ${lastName}`,
    };

    // Call API to upload
    try {
      let { data } = await shareUploadLinkApi.uploadAssets(formData, newQuery);
      files[i].asset = data[0].asset;

      if (!requestId) {
        requestId = data[0].requestId;
        setActiveRequestId(requestId);
      }

      files[i].status = "done";
    } catch (err) {
      files[i].status = "fail";
    } finally {
      files[i].isUploading = false;
    }

    setUploadingFiles([...files]);

    if (i < files.length - 1 && !isRetry) {
      await uploadFiles(i + 1, files, requestId);
    }
  };

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isAdditionalUpload = false
  ) => {
    const files = e.target.files;

    if (files.length > 0) {
      if (isFilesInputValid(files)) {
        setIsModalOpen(false);

        setShowUploadError(false);

        const formattedFiles: IGuestUploadItem[] = Array.from(files).map(
          (file) => {
            return {
              asset: {
                name: file.name,
                createdAt: new Date(),
                size: file.size,
                stage: "draft",
                type: "image",
                mimeType: file.type,
                fileModifiedAt: new Date(file.lastModified),
              },
              file,
              status: "queued",
              isUploading: false,
            };
          }
        );

        connectSocket();
        setUploading(true);
        setDisabled(true);
        await uploadFiles(
          isAdditionalUpload ? uploadingFiles.length : 0,
          [...uploadingFiles, ...formattedFiles],
          null
        );
        setUploadingFiles([...uploadingFiles, ...formattedFiles]);
      } else {
        setShowUploadError(true);
      }
    }
  };

  const onCancelUpload = () => {
    setUploading(false);
    setUploadingFiles([]);
    //TODO: delete assets that were already uploaded
  };

  // Init socket listener
  useEffect(() => {
    // Socket is available and connected
    if (socket && connected) {
      // Listen upload file process event
      socket.on("uploadFilesProgress", function (data) {
        setUploadingPercent(data.percent);
      });
    }
  }, [socket, connected]);

  const onAdditionalUpload = () => {
    setIsModalOpen(true);
  };

  const onSubmitUpload = () => {
    setUploadSuccess(true);
  };

  const onRetryUploadingFile = async (index: number) => {
    await uploadFiles(index, uploadingFiles, activeRequestId, true);
  };

  return (
    <>
      {activePasswordOverlay && (
        <PasswordOverlay onPasswordSubmit={submitPassword} logo={logo} />
      )}

      <section className={styles.container}>
        {!uploadSuccess ? (
          <div className={styles.wrapper}>
            <>
              <div>
                <h1>{teamName} - Guest Upload</h1>
                <p className={styles.detail}>
                  Please fill out the form below before uploading your files to
                  us
                </p>
              </div>
              <div className={styles.form}>
                {!showPreview ? (
                  <ContactForm
                    data={guestInfo}
                    onSubmit={saveChanges}
                    teamName={teamName}
                  />
                ) : (
                  <GuestDetails
                    userDetails={guestInfo}
                    onCancel={onCancelGuestInfo}
                  />
                )}
              </div>
            </>
            {showUploadSection && (
              <div className={styles.uploadSection}>
                <div className={styles.upload_title}>Upload Files</div>

                <div className={styles.subtitle}>
                  {showUploadError
                    ? "You are trying to upload too many files. Re-upload no more than 200 files, the total size of the files should not exceed 1GB"
                    : "Please upload your files or folders that you would like to submit to us. After files are selected, click “Submit Upload” button to send your files."}
                </div>
                {uploading ? (
                  <div className={styles.listWrapper}>
                    <UploadList
                      files={uploadingFiles}
                      onUpload={onAdditionalUpload}
                      uploadingPercent={uploadingPercent}
                      onRetry={onRetryUploadingFile}
                      additionUploadDisabled={disabled}
                      uploadingIndex={uploadingIndex}
                    />
                    <Button
                      className={"container primary GuestFileUploadBtn"}
                      text="Submit Upload"
                      onClick={onSubmitUpload}
                      disabled={disabled}
                    />
                  </div>
                ) : (
                  <UploadOptions
                    onFileChange={onFileChange}
                    uploading={uploading}
                    uploadingFiles={uploadingFiles}
                    onCancel={onCancelUpload}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={styles.submission}>
              <h1>{teamName} - Files Successfully Submitted</h1>
              <p className={styles.submissionMsg}>
                Thank you for submitting your files to us. Our team has been
                notified and will review the files. Have a great day !
              </p>
            </div>
          </>
        )}
      </section>

      <BaseModal
        showCancel={true}
        closeButtonOnly
        additionalClasses={[styles["modal-upload"]]}
        closeModal={() => setIsModalOpen(false)}
        modalIsOpen={isModalOpen}
        confirmText=""
        confirmAction={() => { }}
      >
        <div className={styles.uploadMOdal}>
          <h2>Upload Files</h2>
          <div className={styles.subtitle}>
            {showUploadError
              ? "You are trying to upload too many files. Re-upload no more than 200 files, the total size of the files should not exceed 1GB"
              : "Please upload your files or folders that you would like to submit to us.  After files are selected, click “Submit Upload” button to send your files."}
          </div>
          <UploadOptions
            onFileChange={(e) => onFileChange(e, true)}
            uploading={uploading}
            uploadingFiles={uploadingFiles}
            onCancel={onCancelUpload}
          />
        </div>
      </BaseModal>
      {loading && <SpinnerOverlay />}
    </>
  );
};

export default GuestUploadMain;
