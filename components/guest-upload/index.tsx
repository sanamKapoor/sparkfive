// External imports
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

// Contexts
import { GuestUploadContext, SocketContext } from "../../context";

// Components
import { Assets } from "../../assets";
import SpinnerOverlay from "../common/spinners/spinner-overlay";
import PasswordOverlay from "../share-folder/password-overlay";

// Utils
import { validation } from "../../constants/file-validation";
import requestUtils from "../../utils/requests";
import toastUtils from "../../utils/toast";
import {
  convertTimeFromSeconds,
  getFolderKeyAndNewNameByFileName,
} from "../../utils/upload";

// Apis
import uploadLinkApi from "../../server-api/guest-upload";
import shareUploadLinkApi from "../../server-api/share-upload-link";
import { UploadingStatus } from "../../types/common/upload";
import GuestDetails from "./guest-details";
import GuestInfoForm from "./guest-info-form";
import GuestUploadSection from "./guest-upload-section";

const GuestUpload: React.FC = () => {
  const { socket, connected, connectSocket } = useContext(SocketContext);
  const { updateLogo, logo } = useContext(GuestUploadContext);

  const { query } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const fileBrowserRef = useRef(undefined);
  const folderBrowserRef = useRef(undefined);
  const [uploadEnabled, setUploadEnabled] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);
  const [activePasswordOverlay, setActivePasswordOverlay] =
    useState<boolean>(true);

  const [teamName, setTeamName] = useState<string>("");
  const [files, setFiles] = useState<Array<Record<string, unknown>>>([]);
  const [totalSize, setTotalSize] = useState(0);

  // For processing uploading
  // Upload process
  const [uploadingAssets, setUploadingAssets] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [uploadingStatus, setUploadingStatus] =
    useState<UploadingStatus>("none");
  const [uploadingPercent, setUploadingPercent] = useState<number>(0); // Percent of uploading process: 0 - 100
  const [uploadingFile, setUploadingFile] = useState<number>(); // Current uploading file index
  const [uploadingFileName, setUploadingFileName] = useState<string>(); // Current uploading file name, import feature need this
  const [uploadRemainingTime, setUploadRemainingTime] = useState<string>("");
  const [uploadDetailOverlay, setUploadDetailOverlay] =
    useState<boolean>(false);
  const [folderGroups, setFolderGroups] = useState<Record<string, unknown>>({}); // This groups contain all folder key which is need to identity which folder file need to be saved to
  const [retryListCount, setRetryListCount] = useState<number>(0);

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

  const getCreationParameters = (attachQuery?: any) => {
    let queryData: any = {};
    // Attach extra query
    if (attachQuery) {
      queryData = { ...queryData, ...attachQuery };
    }
    return queryData;
  };

  // Show upload process toast
  const showUploadProcess = (value: UploadingStatus, fileIndex?: number) => {
    // Set uploading file index
    if (fileIndex !== undefined) {
      setUploadingFile(fileIndex);
    }

    // Update uploading status
    setUploadingStatus(value);

    // Reset all value
    if (fileIndex === 0) {
      setUploadingPercent(0);
    }
  };

  // Upload asset
  const uploadAsset = async (
    i: number,
    assets: any,
    currentDataClone: any,
    totalSize: number,
    folderId,
    folderGroup = {},
    attachedData,
    requestId
  ) => {
    try {
      const formData = new FormData();
      let file = assets[i].file.originalFile;
      let currentUploadingFolderId = null;
      let newAssets = 0;

      // Get file group info, this returns folderKey and newName of file
      let fileGroupInfo = getFolderKeyAndNewNameByFileName(
        file.webkitRelativePath
      );

      // Do validation
      if (assets[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE) {
        // Violate validation, mark failure
        const updatedAssets = assets.map((asset, index) =>
          index === i
            ? {
              ...asset,
              status: "fail",
              index,
              error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE,
            }
            : asset
        );

        // Update uploading assets
        setUploadingAssets(updatedAssets);
        setFiles(updatedAssets);
        // The final one
        if (i === assets.length - 1) {
          return { folderGroup, updatedAssets };
        } else {
          // Keep going
          return await uploadAsset(
            i + 1,
            updatedAssets,
            currentDataClone,
            totalSize,
            folderId,
            folderGroup,
            attachedData,
            requestId
          );
        }
      } else {
        // Show uploading toast
        showUploadProcess("uploading", i);

        // Set current upload file name
        setUploadingFileName(assets[i].asset.name);

        // If user is uploading files in folder which is not saved from server yet
        if (fileGroupInfo.folderKey && !folderId) {
          // Current folder Group have the key
          if (folderGroup[fileGroupInfo.folderKey]) {
            currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey];
            // Assign new file name without splash
            file = new File(
              [file.slice(0, file.size, file.type)],
              fileGroupInfo.newName,
              {
                type: file.type,
                lastModified:
                  file.lastModifiedDate || new Date(file.lastModified),
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

        let size = totalSize;
        // Calculate the rest of size
        assets.map((asset) => {
          // Exclude done or fail assets
          if (asset.status === "done" || asset.status === "fail") {
            size -= asset.asset.size;
            newAssets += 1;
          }
        });

        let attachedQuery = {
          estimateTime: 1,
          size,
          totalSize,
          url: query.code,
          ...attachedData,
        };

        // Uploading inside specific folders
        if (folderId) {
          attachedQuery["folderId"] = folderId;
        }

        // Uploading the new folder
        if (currentUploadingFolderId) {
          attachedQuery["folderId"] = currentUploadingFolderId;
        }

        if (requestId) {
          attachedQuery["requestId"] = requestId;
        }

        // Alert to admin user, if this is the final one of current request
        if (i === assets.length - 1) {
          attachedQuery["alertAdmin"] = true;
        }

        // Call API to upload
        let { data } = await shareUploadLinkApi.uploadAssets(
          formData,
          getCreationParameters(attachedQuery)
        );

        // If user is uploading files in folder which is not saved from server yet
        if (fileGroupInfo.folderKey && !folderId) {
          /// If user is uploading new folder and this one still does not have folder Id, add it to folder group
          if (!folderGroup[fileGroupInfo.folderKey]) {
            folderGroup[fileGroupInfo.folderKey] = data[0].asset.folders[0];
          }
        }

        data = data.map((item) => {
          item.isSelected = true;
          return item;
        });

        assets[i] = data[0];

        // If request id is not updated yet
        if (!requestId) {
          requestId = assets[i].requestId;
        }

        // Mark this asset as done
        const updatedAssets = assets.map((asset, index) =>
          index === i ? { ...asset, status: "done" } : asset
        );

        setUploadingAssets(updatedAssets);
        setFiles(updatedAssets);

        // The final one
        if (i === assets.length - 1) {
          return { folderGroup, updatedAssets };
        } else {
          // Keep going
          return await uploadAsset(
            i + 1,
            updatedAssets,
            currentDataClone,
            totalSize,
            folderId,
            folderGroup,
            attachedData,
            requestId
          );
        }
      }
    } catch (e) {
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) =>
        index === i
          ? { ...asset, index, status: "fail", error: "Processing file error" }
          : asset
      );

      // Update uploading assets
      setUploadingAssets(updatedAssets);

      // The final one
      if (i === assets.length - 1) {
        return { folderGroup, updatedAssets };
      } else {
        // Keep going
        return await uploadAsset(
          i + 1,
          updatedAssets,
          currentDataClone,
          totalSize,
          folderId,
          folderGroup,
          attachedData,
          requestId
        );
      }
    }
  };

  const onFilesDataGet = async (files) => {
    let totalSize = 0;
    const fileArr = [];

    files.forEach((file) => {
      totalSize += file.originalFile.size;
      fileArr.push({
        asset: {
          name: file.originalFile.name,
          createdAt: new Date(),
          size: file.originalFile.size,
          stage: "draft",
          type: "image",
          mimeType: file.originalFile.type,
          fileModifiedAt:
            file.originalFile.lastModifiedDate ||
            new Date(file.originalFile.lastModified),
        },
        file,
        status: "queued",
        isUploading: false,
      });
    });

    setTotalSize(totalSize);
    setFiles(fileArr);
  };

  const submitUpload = async (data, files) => {
    let { folderGroup, updatedAssets } = await uploadAsset(
      0,
      files,
      [...files],
      totalSize,
      null,
      {},
      data,
      null
    );

    // Save this for retry failure files later
    setFolderGroups(folderGroups);

    // Finish uploading process
    showUploadProcess("done");

    const failAssets = updatedAssets.filter(
      (updatedAsset) => updatedAsset.status === "fail"
    );

    // If there is any fail asset, keep at current screen
    if (failAssets.length > 0) {
      setRetryListCount(failAssets.length);
    } else {
      // Else, Show done screen
      setRetryListCount(0);
      setUploading(false);
    }
  };

  const saveChanges = async (data) => {
    // Scroll to top
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    // Retry upload
    if (retryListCount > 0) {
      const failAssets = files.filter(
        (updatedAsset) => updatedAsset.status === "fail"
      );

      setUploadingAssets(failAssets);
      submitUpload(data, failAssets);
    } else {
      setUploadingAssets(files);
      submitUpload(data, files);
    }
  };

  const onFileChange = (e) => {
    // Only allow to upload max 200 files
    if (
      e.target.files.length <= validation.UPLOAD.MAX_GUEST_UPLOAD_FILES.VALUE
    ) {
      setUploading(true);
      onFilesDataGet(
        Array.from(e.target.files).map((originalFile) => ({ originalFile }))
      );
    }
  };

  const submitPassword = async (password) => {
    try {
      // Show loading
      setLoading(true);

      const { data } = await uploadLinkApi.authenticateLink({
        password,
        url: query.code,
      });

      // Set axios headers
      requestUtils.setAuthToken(data.token, "share-upload-authorization");

      connectSocket(data.token);

      getLinkInfo(true);
    } catch (err) {
      console.log(err);
      // Show loading
      setLoading(false);
      toastUtils.error("Wrong password or invalid link, please try again");
    }
  };

  const getLinkInfo = async (displayError = false) => {
    try {
      const { data } = await shareUploadLinkApi.getLinkDetail({
        url: query.code,
      });

      // Show team name and logo
      updateLogo(data.logo);
      setTeamName(data.team);

      setActivePasswordOverlay(false);

      // Hide loading
      setLoading(false);
    } catch (err) {
      // If not 500, must be auth error, request user password
      if (err.response.status !== 500) {
        updateLogo(err.response?.data?.teamIcon);
        // Hide loading
        setLoading(false);

        // setFolderInfo(err.response.data)
        setActivePasswordOverlay(true);
      }

      if (displayError) {
        toastUtils.error("Wrong password or invalid link, please try again");
      }
    }
  };
  useEffect(() => {
    // If code is declared, use it to get link info
    if (query?.code) {
      // Get link info
      getLinkInfo();
    }
  }, [query]);

  // Init socket listener
  useEffect(() => {
    // Socket is available and connected
    if (socket && connected) {
      // Listen upload file process event
      socket.on("uploadFilesProgress", function (data) {
        setUploadingPercent(data.percent);
        setUploadRemainingTime(
          `${convertTimeFromSeconds(data.timeLeft)} remaining`
        );

        if (data.fileName) {
          setUploadingFileName(data.fileName);
        }
      });
    }
  }, [socket, connected]);

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        {uploadingStatus === "done" ? (
          <div className={styles.success}>
            <div className={styles.title}>{teamName} - Upload Success</div>
            <div className={styles.subtitle}>
              Thank you for submitting your files to us. Our team has been
              notified and will review the files. Have a great day!
            </div>
          </div>
        ) : (
          <>
            {!loading && (
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
                  onChange={onFileChange}
                />

                <>
                  {uploadingStatus === "none" && (
                    <>
                      <div className={styles.title}>
                        {teamName} - Guest Upload
                      </div>
                      <div className={styles.subtitle}>
                        Please upload your files or folders that you would like
                        to submit to us. This is more of text. Please upload
                        your files or folders that you would like to submit to
                        us
                      </div>
                    </>
                  )}

                  {uploadEnabled && !edit && <GuestDetails setEdit={setEdit} />}

                  {(!uploadEnabled || edit) && (
                    <GuestInfoForm
                      onSubmit={saveChanges}
                      teamName={teamName}
                      uploadingStatus={uploadingStatus}
                      setUploadEnabled={setUploadEnabled}
                      setEdit={setEdit}
                    />
                  )}
                </>

                <GuestUploadSection
                  uploadEnabled={uploadEnabled}
                  uploading={uploading}
                  uploadingStatus={uploadingStatus}
                  files={files}
                  dropDownOptions={dropdownOptions}
                  retryListCount={retryListCount}
                  uploadingAssets={uploadingAssets}
                  showUploadProcess={showUploadProcess}
                  uploadingFile={uploadingFile}
                  uploadingPercent={uploadingPercent}
                  setUploadDetailOverlay={setUploadDetailOverlay}
                  uploadingFileName={uploadingFileName}
                  setUploadingStatus={setUploadingStatus}
                />
                {activePasswordOverlay && (
                  <PasswordOverlay
                    onPasswordSubmit={submitPassword}
                    logo={logo}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      {loading && <SpinnerOverlay />}
    </section>
  );
};

export default GuestUpload;
