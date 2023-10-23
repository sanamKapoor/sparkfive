import _ from "lodash";
import { useContext, useRef, useState } from "react";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

import IconClickable from "../buttons/icon-clickable";

import { Assets } from "../../../assets";
import toastUtils from "../../../utils/toast";
import styles from "./asset-related-files.module.css";
import AssetUpload from "./asset-upload";

import assetApi from "../../../server-api/asset";

import { validation } from "../../../constants/file-validation";
import { AssetContext, UserContext } from "../../../context";
import cookiesUtils from "../../../utils/cookies";
import { getFolderKeyAndNewNameByFileName } from "../../../utils/upload";
import AssetDuplicateModal from "./asset-duplicate-modal";
import AssetRelatedFilesSearch from "./asset-related-files-search";
import DriveSelector from "./drive-selector";

import { maximumAssociateFiles } from "../../../constants/asset-associate";

export default function AssetRelatedFileUpload({
  assets: assetData = [],
  associateFileId,
  onUploadFinish = (assets) => {},
  currentRelatedAssets = [],
}) {
  const { advancedConfig } = useContext(UserContext);
  const { uploadingPercent, setUploadingPercent } = useContext(AssetContext);

  const fileBrowserRef = useRef(undefined);
  const folderBrowserRef = useRef(undefined);

  const [assets, setAssets] = useState(assetData);
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(0);

  // Duplicated upload handle variables
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [duplicateAssets, setDuplicateAssets] = useState([]);
  const [uploadFrom, setUploadFrom] = useState("");

  const getCreationParameters = (attachQuery?: any) => {
    let queryData: any = { associateFile: associateFileId };

    let uploadToFolders = [];

    queryData.folderId = uploadToFolders.join(",");
    // Attach extra query
    if (attachQuery) {
      queryData = { ...queryData, ...attachQuery };
    }
    return queryData;
  };

  const setUploadUpdate = (updatedAssets) => {
    setAssets(updatedAssets);
    onUploadFinish(updatedAssets);
  };

  // Upload asset
  const uploadAsset = async (
    i: number,
    assets: any,
    currentDataClone: any,
    totalSize: number,
    folderId,
    folderGroup = {},
    subFolderAutoTag = true,
  ) => {
    let folderUploadInfo;
    try {
      setUploadingIndex(i);
      const formData = new FormData();
      let file = assets[i].file.originalFile;
      let currentUploadingFolderId = null;
      let newAssets = 0;

      // Get file group info, this returns folderKey and newName of file
      let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.webkitRelativePath, subFolderAutoTag);
      folderUploadInfo = { name: fileGroupInfo.folderKey, size: totalSize };

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
            : asset,
        );

        // The final one
        if (i === assets.length - 1) {
          return folderGroup;
        } else {
          // Keep going
          await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag);
        }
      } else {
        // If user is uploading files in folder which is not saved from server yet
        if (fileGroupInfo.folderKey && !folderId) {
          // Current folder Group have the key
          if (folderGroup[fileGroupInfo.folderKey]) {
            // Store this key to use to upload to same folder
            currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey];
          }
        }

        // Append file to form data
        formData.append("asset", file);
        formData.append(
          "fileModifiedAt",
          new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString(),
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

        let attachedQuery = { estimateTime: 1, size, totalSize };

        // Uploading inside specific folders which already existed in server
        if (folderId) {
          attachedQuery["folderId"] = folderId;
        }

        // For duplicate asset upload
        if (assets[i].asset && assets[i].asset.versionGroup) {
          attachedQuery["versionGroup"] = assets[i].asset.versionGroup;
        }

        if (assets[i].asset && assets[i].asset.changedName) {
          attachedQuery["changedName"] = assets[i].asset.changedName;
        }

        // Uploading the new folder where it's folderId has been created earlier in previous API call
        if (currentUploadingFolderId) {
          attachedQuery["folderId"] = currentUploadingFolderId;
        }

        // Call API to upload
        let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery));

        // If user is uploading files in folder which is not saved from server yet
        // Save folders data in response to use for subsequence request so that files in same folder can be located correctly
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

        // Mark this asset as done
        const updatedAssets = assets.map((asset, index) => (index === i ? { ...asset, status: "done" } : asset));

        // Update uploading assets
        setUploadUpdate(updatedAssets);

        // The final one
        if (i === assets.length - 1) {
          return;
        } else {
          // Keep going
          await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag);
        }
      }
    } catch (e) {
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) =>
        index === i ? { ...asset, index, status: "fail", error: "Processing file error" } : asset,
      );

      // Update uploading assets
      setUploadUpdate(updatedAssets);

      // The final one
      if (i === assets.length - 1) {
        return folderGroup;
      } else {
        // Keep going
        await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag);
      }
    }
  };

  // Upload asset
  const reUpload = async (
    i: number,
    assets: any,
    currentDataClone: any,
    totalSize: number,
    folderId,
    folderGroup = {},
    subFolderAutoTag = true,
  ) => {
    let folderUploadInfo;
    try {
      setUploadingIndex(i);
      const formData = new FormData();
      let file = assets[i].file.originalFile;
      let currentUploadingFolderId = null;
      let newAssets = 0;

      // Get file group info, this returns folderKey and newName of file
      let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.webkitRelativePath, subFolderAutoTag);
      folderUploadInfo = { name: fileGroupInfo.folderKey, size: totalSize };

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
            : asset,
        );

        // Update uploading assets
        setUploadUpdate(updatedAssets);

        return folderGroup;
      } else {
        // If user is uploading files in folder which is not saved from server yet
        if (fileGroupInfo.folderKey && !folderId) {
          // Current folder Group have the key
          if (folderGroup[fileGroupInfo.folderKey]) {
            // Store this key to use to upload to same folder
            currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey];
          }
        }

        // Append file to form data
        formData.append("asset", file);
        formData.append(
          "fileModifiedAt",
          new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString(),
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

        let attachedQuery = { estimateTime: 1, size, totalSize };

        // Uploading inside specific folders which already existed in server
        if (folderId) {
          attachedQuery["folderId"] = folderId;
        }

        // For duplicate asset upload
        if (assets[i].asset && assets[i].asset.versionGroup) {
          attachedQuery["versionGroup"] = assets[i].asset.versionGroup;
        }

        if (assets[i].asset && assets[i].asset.changedName) {
          attachedQuery["changedName"] = assets[i].asset.changedName;
        }

        // Uploading the new folder where it's folderId has been created earlier in previous API call
        if (currentUploadingFolderId) {
          attachedQuery["folderId"] = currentUploadingFolderId;
        }

        // Call API to upload
        let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery));

        // If user is uploading files in folder which is not saved from server yet
        // Save folders data in response to use for subsequence request so that files in same folder can be located correctly
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
        // Mark this asset as done
        const updatedAssets = assets.map((asset, index) => (index === i ? { ...asset, status: "done" } : asset));

        // Update uploading assets
        setUploadUpdate(updatedAssets);

        return;
      }
    } catch (e) {
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) =>
        index === i ? { ...asset, index, status: "fail", error: "Processing file error" } : asset,
      );

      // Update uploading assets
      setUploadUpdate(updatedAssets);

      return folderGroup;
    }
  };

  const onFilesDataGet = async (files) => {
    if (maximumAssociateFiles - currentRelatedAssets.length >= files.length) {
      const currentDataClone = [...assets];
      try {
        const newPlaceholders = [];

        let totalSize = 0;
        files.forEach((file) => {
          totalSize += file.originalFile.size;
          const asset = {
            name: file.originalFile.name,
            createdAt: new Date(),
            size: file.originalFile.size,
            stage: "draft",
            type: "image",
            mimeType: file.originalFile.type,
            fileModifiedAt: file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified),

            versionGroup: file.versionGroup,
            changedName: file.changedName,
          };
          if (file.versionGroup) {
            asset.versionGroup = file.versionGroup;
          }
          if (file.changedName) {
            asset.changedName = file.changedName;
          }
          newPlaceholders.push({
            asset,
            file,
            status: "queued",
            isUploading: true,
          });
        });

        // Showing assets = uploading assets + existing assets
        setAssets([...newPlaceholders, ...currentDataClone]);

        console.log([...newPlaceholders, ...currentDataClone]);

        // Get team advance configurations first
        const { subFolderAutoTag } = advancedConfig;

        setUploading(true);

        // Start to upload assets

        await uploadAsset(0, newPlaceholders, currentDataClone, totalSize, undefined, undefined, subFolderAutoTag);

        setUploadingPercent(0);
      } catch (err) {
        setAssets(currentDataClone);
        console.log(err);
        if (err.response?.status === 402) toastUtils.error(err.response.data.message);
        else toastUtils.error("Could not upload assets, please try again later.");
      }
    } else {
      toastUtils.error(`You already reached the maximum ${maximumAssociateFiles} associated files`);
    }
  };

  const reuploadAsset = async (index) => {
    // Get team advance configurations first
    const { subFolderAutoTag } = advancedConfig;
    const updatedAssets = [...assets];
    updatedAssets[index].status === "queued";

    // Make this asset as queue
    setAssets(updatedAssets);

    await reUpload(index, updatedAssets, updatedAssets, assets[index].size, undefined, undefined, subFolderAutoTag);
  };

  const onFileChange = async (e) => {
    const files = Array.from(e.target.files).map((originalFile) => ({
      originalFile,
    }));
    if (advancedConfig.duplicateCheck) {
      const names = files.map((file) => file.originalFile["name"]);
      const {
        data: { duplicateAssets },
      } = await assetApi.checkDuplicates(names);
      if (duplicateAssets.length) {
        setSelectedFiles(files);
        setDuplicateAssets(duplicateAssets);
        setDuplicateModalOpen(true);
        setUploadFrom("browser");
        if (fileBrowserRef.current.value) {
          fileBrowserRef.current.value = "";
        }
        if (folderBrowserRef.current.value) {
          folderBrowserRef.current.value;
        }
      } else {
        onFilesDataGet(files);
      }
    } else {
      onFilesDataGet(files);
    }
  };

  const onDragFile = async (files) => {
    if (advancedConfig.duplicateCheck) {
      const names = files.map((file) => file.originalFile["name"]);
      const {
        data: { duplicateAssets },
      } = await assetApi.checkDuplicates(names);
      if (duplicateAssets.length) {
        setSelectedFiles(files);
        setDuplicateAssets(duplicateAssets);
        setDuplicateModalOpen(true);
        setUploadFrom("browser");
        if (fileBrowserRef.current.value) {
          fileBrowserRef.current.value = "";
        }
        if (folderBrowserRef.current.value) {
          folderBrowserRef.current.value;
        }
      } else {
        onFilesDataGet(files);
      }
    } else {
      onFilesDataGet(files);
    }
  };

  const getBadgeClassByStatus = (status) => {
    switch (status) {
      case "done": {
        return "done-badge";
      }
      case "fail": {
        return "fail-badge";
      }
      default: {
        return "";
      }
    }
  };

  const onGdriveFilesGet = async (files) => {
    if (maximumAssociateFiles - currentRelatedAssets.length >= files.length) {
      const googleAuthToken = cookiesUtils.get("gdriveToken");
      let currentDataClone = [...assets];
      try {
        let totalSize = 0;
        const newPlaceholders = [];
        files.forEach((file) => {
          totalSize += file.sizeBytes;
          newPlaceholders.push({
            asset: {
              name: file.name,
              createdAt: new Date(),
              size: file.sizeBytes,
              stage: "draft",
              type: "image",
            },
            status: "queued",
            isUploading: true,
          });
        });

        setAssets([...newPlaceholders, ...currentDataClone]);

        setUploading(true);

        const { data } = await assetApi.importAssets(
          "drive",
          files.map((file) => ({
            googleAuthToken,
            id: file.id,
            name: file.name,
            size: file.sizeBytes,
            mimeType: file.mimeType,
            type: file.type,
            versionGroup: file.versionGroup,
            changedName: file.changedName,
          })),
          getCreationParameters({ estimateTime: 1, totalSize }),
        );

        setUploadingPercent(0);

        // Mark done
        const updatedAssets = data.map((asset) => {
          return { ...asset, status: "done" };
        });

        // Update uploading assets
        setUploadUpdate(updatedAssets);

        // toastUtils.success('Assets imported.')
      } catch (err) {
        setAssets(currentDataClone);

        console.log(err);
        if (err.response?.status === 402) toastUtils.error(err.response.data.message);
        else toastUtils.error("Could not import assets, please try again later.");
      }
    } else {
      toastUtils.error(`You already reached the maximum ${maximumAssociateFiles} associated files`);
    }
  };

  const onDropboxFilesGet = async (files) => {
    if (maximumAssociateFiles - currentRelatedAssets.length >= files.length) {
      let currentDataClone = [...assets];
      try {
        let totalSize = 0;
        const newPlaceholders = [];
        files.forEach((file) => {
          totalSize += file.bytes;
          newPlaceholders.push({
            asset: {
              name: file.name,
              createdAt: new Date(),
              size: file.bytes,
              stage: "draft",
              type: "image",
            },
            status: "queued",
            isUploading: true,
          });
        });

        setAssets([...newPlaceholders, ...currentDataClone]);

        setUploading(true);

        const { data } = await assetApi.importAssets(
          "dropbox",
          files.map((file) => ({
            link: file.link,
            isDir: file.isDir,
            name: file.name,
            size: file.bytes,
            versionGroup: file.versionGroup,
            changedName: file.changedName,
          })),
          getCreationParameters({ estimateTime: 1, totalSize }),
        );

        // Mark done
        const updatedAssets = data.map((asset) => {
          return { ...asset, status: "done" };
        });

        // Update uploading assets
        setUploadUpdate(updatedAssets);
      } catch (err) {
        setAssets(currentDataClone);

        setAssets(currentDataClone);
        console.log(err);
        if (err.response?.status === 402) toastUtils.error(err.response.data.message);
        else toastUtils.error("Could not import assets, please try again later.");
      }
    } else {
      toastUtils.error(`You already reached the maximum ${maximumAssociateFiles} associated files`);
    }
  };

  const onDriveFilesSelection = async (files) => {
    onGdriveFilesGet(files);
  };

  const onDropboxFilesSelection = async (files) => {
    onDropboxFilesGet(files);
  };

  const openDropboxSelector = () => {
    const options = {
      success: onDropboxFilesSelection,
      linkType: "preview",
      multiselect: true,
      folderselect: true,
      sizeLimit: 1000 * 1024 * 1024 * 2,
    };
    // Ignore this annoying warning
    Dropbox.choose(options);
  };

  const onConfirmDuplicates = (nameHistories) => {
    setDuplicateModalOpen(false);
    let files = [...selectedFiles];
    if (uploadFrom === "browser") {
      files = files.map((file) => {
        file.name = file.originalFile.name;
        return file;
      });
    }
    const mappedDuplicates = _.keyBy(duplicateAssets, "name");

    // eliminate canceled
    files = files.filter((file) => {
      const cancelledItem = nameHistories.find((item) => item.oldName === file.name && item.action === "cancel");
      return !cancelledItem;
    });

    files = files.map((file) => {
      const handledItem = nameHistories.find((histItem) => histItem.oldName === file.name);
      if (handledItem) {
        if (handledItem.action === "change") {
          file.changedName = handledItem.newName;
        }
        if (handledItem.action === "current") {
          file.versionGroup = mappedDuplicates[file.name].versionGroup;
        }
      }
      return file;
    });

    if (files.length) {
      switch (uploadFrom) {
        case "browser":
          onFilesDataGet(files);
          break;
        case "dropbox":
          onDropboxFilesGet(files);
          break;
        case "gdrive":
          onGdriveFilesGet(files);
          break;
      }
    }
  };

  const onAssetImport = async (asset) => {
    setUploading(true);

    setAssets([
      {
        asset: {
          name: asset.name,
          createdAt: new Date(),
          size: asset.size,
          stage: "draft",
          type: "image",
        },
        status: "queued",
        isUploading: true,
      },
    ]);

    const { data } = await assetApi.associate([asset.id, associateFileId], {
      assetToReturnInfo: asset.id,
    });

    setUploadUpdate([{ ...data, status: "done" }]);
  };

  return (
    <>
      {!uploading && (
        <div className={styles["modal-upload-content"]}>
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
            webkitdirectory=""
            id="file-input-id"
            ref={folderBrowserRef}
            style={{ display: "none" }}
            type="file"
            onChange={onFileChange}
          />
          <div className={styles["upload-icons-wrapper"]}>
            <div className={styles["upload-icon-wrapper"]}>
              <IconClickable
                src={Assets.computer}
                additionalClass={styles["upload-icon"]}
                onClick={() => {
                  fileBrowserRef.current.click();
                }}
              />
              <p>Computer</p>
            </div>
            <div className={styles["upload-icon-wrapper"]}>
              <DriveSelector multiSelect={true} folderSelect={true} onFilesSelect={onDriveFilesSelection}>
                <IconClickable SVGElement={Assets.gdrive} additionalClass={styles["upload-icon"]} onClick={() => {}} />
                <p>Google Drive</p>
              </DriveSelector>
            </div>
            <div className={styles["upload-icon-wrapper"]}>
              <IconClickable
                SVGElement={Assets.dropbox}
                additionalClass={styles["upload-icon"]}
                onClick={openDropboxSelector}
              />
              <p>Dropbox</p>
            </div>
          </div>

          <div className={"m-b-25"}>
            <AssetRelatedFilesSearch onSelect={onAssetImport} />
          </div>

          <AssetUpload
            onDragText={"Drop files here to upload"}
            preDragText={`Upload Images / Drag and Drop`}
            onFilesDataGet={onDragFile}
          />
        </div>
      )}

      {uploading && (
        <div className={styles["confirm-modal"]}>
          <h2>Add ({assets.length}) Related Files</h2>
          {assets.map(({ asset, status }, index) => {
            return (
              <div className={styles["file-progress"]}>
                <span className={styles["file-name"]}>{asset?.name}</span>
                {status !== "queued" && status !== "fail" && (
                  <span className={styles[getBadgeClassByStatus(status)]}>{status}</span>
                )}
                {status === "queued" && (
                  <Progress
                    style={{ fontWeight: "bold" }}
                    percent={uploadingIndex === index ? uploadingPercent : 0}
                    theme={{
                      active: {
                        trailColor: "#D9D9D9 ",
                        color: "#10BDA5",
                      },
                    }}
                  />
                )}
                {status === "fail" && (
                  <span className={styles.fail}>
                    <span className={styles["fail-badge"]}>Fail</span>
                    <span
                      className={styles["reload-btn"]}
                      onClick={() => {
                        reuploadAsset(index);
                      }}
                    >
                      Reload
                    </span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {duplicateAssets?.length > 0 && (
        <AssetDuplicateModal
          duplicateNames={duplicateAssets.map((asset) => asset.name)}
          modalIsOpen={duplicateModalOpen}
          closeModal={() => setDuplicateModalOpen(false)}
          confirmAction={onConfirmDuplicates}
        />
      )}
    </>
  );
}
