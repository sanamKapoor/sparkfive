import update from "immutability-helper";
import _ from "lodash";
import moment from "moment";
import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

// Components
import AssetImg from "../../common/asset/asset-img";
import AssetSubheader from "../../common/asset/asset-subheader";
import AssetThumbail from "../../common/asset/asset-thumbail";
import DriveSelector from "../../common/asset/drive-selector";
import Button from "../../common/buttons/button";
import IconClickable from "../../common/buttons/icon-clickable";
import CreatableSelect from "../../common/inputs/creatable-select";
import Input from "../../common/inputs/input";
import TextArea from "../../common/inputs/text-area";
import Base from "../../common/modals/base";
import RenameModal from "../../common/modals/rename-modal";

//Styles
import assetGridStyles from "../../common/asset/asset-grid.module.css";
import detailPanelStyles from "../../common/asset/detail-side-panel.module.css";
import styles from "./index.module.css";

import { isMobile } from "react-device-detect";
import { Assets } from "../../../assets";
import { DropzoneProvider } from "../../common/misc/dropzone";

// Contexts
import { AssetContext, LoadingContext, UserContext } from "../../../context";

// Utils
import { Utilities } from "../../../assets";
import { validation } from "../../../constants/file-validation";
import cookiesUtils from "../../../utils/cookies";
import toastUtils from "../../../utils/toast";
import { getFolderKeyAndNewNameByFileName } from "../../../utils/upload";

// APIs
import assetApi from "../../../server-api/asset";
import tagApi from "../../../server-api/tag";
import approvalApi from "../../../server-api/upload-approvals";

import { ASSET_UPLOAD_APPROVAL } from "../../../constants/permissions";

// Hooks
import { useDebounce } from "../../../hooks/useDebounce";
import AssetIcon from "../../common/asset/asset-icon";
import AssetPdf from "../../common/asset/asset-pdf";

// Constants
import { maxAssetsUpload } from "../../../constants/upload-approvals";
import AssetUpload from "../../common/asset/asset-upload";

const UploadApproval = () => {
  const { advancedConfig, hasPermission, user } = useContext(UserContext);

  const {
    setAddedIds,
    showUploadProcess,
    setUploadingType,
    setUploadingAssets,
    setUploadingFileName,
    setUploadSourceType,
    setTotalAssets,
    totalAssets,
    setFolderImport,
  } = useContext(AssetContext);

  const { setIsLoading } = useContext(LoadingContext);
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [duplicateAssets, setDuplicateAssets] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [uploadFrom, setUploadFrom] = useState("");
  const versionGroup = "";
  const [selectedAllAssets, setSelectedAllAssets] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState("");
  const [inputTags, setInputTags] = useState([]);
  const [assetTags, setTags] = useState([]); // Used for right pannel to update bulk, need to reset
  const [approvalId, setApprovalId] = useState();
  const [comments, setComments] = useState(""); // Used for right pannel to update bulk, need to reset
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();

  const [tempTags, setTempTags] = useState([]); // For update tag in each asset
  const [tempComments, setTempComments] = useState(""); // For update tag in each asset

  const [batchName, setBatchName] = useState("");

  const [prevBatches, setPrevBatches] = useState([]);

  const debouncedBatchName = useDebounce(batchName, 500);
  const [sideOpen, setSideOpen] = useState(isMobile ? false : true);

  const toggleSideMenu = (value = null) => {
    if (value === null) setSideOpen(!sideOpen);
    else setSideOpen(value);
  };

  const fileBrowserRef = useRef(undefined);

  const updateName = async (value) => {
    if (approvalId) {
      approvalApi.update(approvalId, { name: value });
    }
  };

  const getCreationParameters = (attachQuery?: any) => {
    const activeFolder = "";
    const type = "";

    let queryData: any = {};

    if (activeFolder) {
      uploadToFolders = [activeFolder];
    }
    // Attach extra query
    if (attachQuery) {
      queryData = { ...queryData, ...attachQuery };
    }
    return queryData;
  };

  const updateAssetList = (newAssetPlaceholder, currentDataClone, folderUploadInfo) => {
    const lastAsset = newAssetPlaceholder[newAssetPlaceholder.length - 1];
    if (lastAsset) {
      let allAssets = [...newAssetPlaceholder, ...currentDataClone];
      allAssets = _.uniqBy(allAssets, "asset.versionGroup");

      setAssets(allAssets);
    }
  };

  const setUploadUpdate = (versionGroup, updatedAssets) => {
    setUploadingType(versionGroup ? "version" : "assets");
    setUploadingAssets(updatedAssets);
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
    requestId = "",
  ) => {
    let folderUploadInfo;
    try {
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
        setUploadUpdate(versionGroup, updatedAssets);

        // Remove current asset from asset placeholder
        let newAssetPlaceholder = updatedAssets.filter((asset) => asset.status !== "fail");

        // At this point, file place holder will be removed
        updateAssetList(newAssetPlaceholder, currentDataClone, folderUploadInfo);

        // The final one
        if (i === assets.length - 1) {
          return folderGroup;
        } else {
          // Keep going
          await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag);
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

        let attachedQuery = {
          estimateTime: 1,
          size,
          totalSize,
          requireApproval: 1,
        };

        if (versionGroup) {
          attachedQuery["versionGroup"] = versionGroup;
        }

        // For duplicate asset upload
        if (assets[i].asset && assets[i].asset.versionGroup) {
          attachedQuery["versionGroup"] = assets[i].asset.versionGroup;
        }

        if (assets[i].asset && assets[i].asset.changedName) {
          attachedQuery["changedName"] = assets[i].asset.changedName;
        }

        if (requestId) {
          attachedQuery["approvalId"] = requestId;
        }

        // Call API to upload
        let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery));

        if (!requestId) {
          setApprovalId(data[0].requestId);
          requestId = data[0].requestId;
        }

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

        // At this point, file place holder will be removed
        updateAssetList(assets, currentDataClone, folderUploadInfo);

        setAddedIds(data.map((assetItem) => assetItem.asset.id));

        // Update total assets
        setTotalAssets(totalAssets + newAssets + 1);

        // Mark this asset as done
        const updatedAssets = assets.map((asset, index) => (index === i ? { ...asset, status: "done" } : asset));

        // Update uploading assets
        setUploadUpdate(versionGroup, updatedAssets);

        // The final one
        if (i === assets.length - 1) {
          return;
        } else {
          // Keep going
          await uploadAsset(
            i + 1,
            updatedAssets,
            currentDataClone,
            totalSize,
            folderId,
            folderGroup,
            subFolderAutoTag,
            requestId,
          );
        }
      }
    } catch (e) {
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) =>
        index === i ? { ...asset, index, status: "fail", error: "Processing file error" } : asset,
      );

      // Update uploading assets
      setUploadUpdate(versionGroup, updatedAssets);

      // Remove current asset from asset placeholder
      let newAssetPlaceholder = updatedAssets.filter((asset) => asset.status !== "fail");

      // At this point, file place holder will be removed
      updateAssetList(newAssetPlaceholder, currentDataClone, folderUploadInfo);

      // The final one
      if (i === assets.length - 1) {
        return folderGroup;
      } else {
        // Keep going
        await uploadAsset(
          i + 1,
          updatedAssets,
          currentDataClone,
          totalSize,
          folderId,
          folderGroup,
          subFolderAutoTag,
          requestId,
        );
      }
    }
  };

  const onDropboxFilesGet = async (files) => {
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
          isUploading: true,
        });
      });

      if (!versionGroup) {
        setAssets([...newPlaceholders, ...currentDataClone]);

        // Update uploading assets
        setUploadingAssets(newPlaceholders);
      }

      // Show uploading process
      showUploadProcess("uploading");

      // Show message
      setUploadingFileName("Importing files from Drop Box");

      setUploadSourceType("dropbox");

      // Check if there is 1 folder in upload links
      const containFolderUrl = files.filter((file) => file.isDir);

      setFolderImport(containFolderUrl.length > 0);

      let attachedQuery = { estimateTime: 1, totalSize, requireApproval: 1 };

      if (approvalId) {
        attachedQuery["approvalId"] = approvalId;
      }

      const { data } = await assetApi.importAssets(
        "dropbox",
        files.map((file) => ({
          link: file.link,
          isDir: file.isDir,
          name: file.name,
          size: file.bytes,
          versionGroup: file.versionGroup || versionGroup,
          changedName: file.changedName,
        })),
        getCreationParameters(attachedQuery),
      );

      // Save this approval id for saving name automatically
      if (data[0]?.requestId) {
        setApprovalId(data[0]?.requestId);
      }

      // clean old version for main grid
      if (versionGroup) {
        currentDataClone = currentDataClone.filter((item) => {
          return item.asset.versionGroup !== versionGroup;
        });
      }

      updateAssetList(data, currentDataClone, undefined);

      setAddedIds(data.id);

      // Mark done
      const updatedAssets = data.map((asset) => {
        return { ...asset, status: "done" };
      });

      // Update uploading assets
      setUploadUpdate(versionGroup, updatedAssets);

      // Mark process as done
      showUploadProcess("done");

      // Reset upload source type
      setUploadSourceType("");
      // toastUtils.success('Assets imported.')
    } catch (err) {
      // Finish uploading process
      showUploadProcess("done");

      setAssets(currentDataClone);

      setAssets(currentDataClone);
      console.log(err);
      if (err.response?.status === 402) toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not import assets, please try again later.");
    }
  };

  const onDropboxFilesSelection = async (files) => {
    if (files.length <= maxAssetsUpload) {
      if (advancedConfig.duplicateCheck) {
        const names = files.map((file) => file["name"]);
        const {
          data: { duplicateAssets },
        } = await assetApi.checkDuplicates(names);
        if (duplicateAssets.length) {
          setSelectedFiles(files);
          setDuplicateAssets(duplicateAssets);
          setDuplicateModalOpen(true);
          setUploadFrom("dropbox");
          if (fileBrowserRef.current.value) {
            fileBrowserRef.current.value = "";
          }
        } else {
          onDropboxFilesGet(files);
        }
      } else {
        onDropboxFilesGet(files);
      }
    } else {
      toastUtils.error(`Maximum assets to upload is ${maxAssetsUpload}`);
    }
  };

  const onDriveFilesSelection = async (files) => {
    if (files.length <= maxAssetsUpload) {
      if (advancedConfig.duplicateCheck) {
        const names = files.map((file) => file["name"]);
        const {
          data: { duplicateAssets },
        } = await assetApi.checkDuplicates(names);
        if (duplicateAssets.length) {
          setSelectedFiles(files);
          setDuplicateAssets(duplicateAssets);
          setDuplicateModalOpen(true);
          setUploadFrom("gdrive");
          if (fileBrowserRef.current.value) {
            fileBrowserRef.current.value = "";
          }
        } else {
          onGdriveFilesGet(files);
        }
      } else {
        onGdriveFilesGet(files);
      }
    } else {
      toastUtils.error(`Maximum assets to upload is ${maxAssetsUpload}`);
    }
  };

  const onGdriveFilesGet = async (files) => {
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
          isUploading: true,
        });
      });

      if (!versionGroup) {
        setAssets([...newPlaceholders, ...currentDataClone]);
        // Update uploading assets
        setUploadingAssets(newPlaceholders);
      }

      // Show uploading process
      showUploadProcess("uploading");

      // Show message
      setUploadingFileName("Importing files from Google Drive");

      setUploadSourceType("dropbox");

      // Check if there is 1 folder in upload links
      const containFolderUrl = files.filter((file) => file.type === "folder");

      setFolderImport(containFolderUrl.length > 0);

      let attachedQuery = { estimateTime: 1, totalSize, requireApproval: 1 };

      if (approvalId) {
        attachedQuery["approvalId"] = approvalId;
      }

      const { data } = await assetApi.importAssets(
        "drive",
        files.map((file) => ({
          googleAuthToken,
          id: file.id,
          name: file.name,
          size: file.sizeBytes,
          mimeType: file.mimeType,
          type: file.type,
          versionGroup: file.versionGroup || versionGroup,
          changedName: file.changedName,
        })),
        getCreationParameters(attachedQuery),
      );

      // Save this approval id for saving name automatically
      if (data[0]?.requestId) {
        setApprovalId(data[0]?.requestId);
      }

      // clean old version for main grid
      if (versionGroup) {
        currentDataClone = currentDataClone.filter((item) => {
          return item.asset.versionGroup !== versionGroup;
        });
      }

      updateAssetList(data, currentDataClone, undefined);

      setAddedIds(data.id);

      // Mark done
      const updatedAssets = data.map((asset) => {
        return { ...asset, status: "done" };
      });

      // Update uploading assets
      setUploadUpdate(versionGroup, updatedAssets);

      // Mark process as done
      showUploadProcess("done");

      // Reset upload source type
      setUploadSourceType("");

      // toastUtils.success('Assets imported.')
    } catch (err) {
      // Finish uploading process
      showUploadProcess("done");

      setAssets(currentDataClone);

      console.log(err);
      if (err.response?.status === 402) toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not import assets, please try again later.");
    }
  };

  const openDropboxSelector = (files) => {
    const options = {
      success: onDropboxFilesSelection,
      linkType: "preview",
      multiselect: versionGroup ? false : true,
      folderselect: versionGroup ? false : true,
      sizeLimit: 1000 * 1024 * 1024 * 2,
    };
    // Ignore this annoying warning
    Dropbox.choose(options);
  };

  const dropdownOptions = [
    {
      id: "file",
      label: "Upload",
      text: "png, jpg, mp4 and more",
      onClick: () => fileBrowserRef.current.click(),
      icon: Assets.upload,
    },
    {
      id: "dropbox",
      label: "Dropbox",
      text: "Import files",
      onClick: openDropboxSelector,
      icon: Assets.dropbox,
    },
    {
      id: "gdrive",
      label: "Google Drive",
      text: "Import files",
      onClick: () => {},
      icon: Assets.gdrive,
      CustomContent: ({ children }) => {
        return (
          <DriveSelector
            multiSelect={versionGroup ? false : true}
            folderSelect={versionGroup ? false : true}
            onFilesSelect={onDriveFilesSelection}
          >
            {children}
          </DriveSelector>
        );
      },
    },
  ];

  const DropDownOptions = () => {
    const Content = (option) => {
      return (
        <span className={styles.option} onClick={option.onClick}>
          <IconClickable SVGElement={option.icon} additionalClass={styles.icon} />
          <div className={styles["option-label"]}>{option.label}</div>
        </span>
      );
    };

    return (
      <ul className={`${styles["options-list"]} ${styles["dropdown"]}`}>
        {dropdownOptions.map((option, indx) => (
          <li key={indx.toString()}>
            {option.CustomContent ? (
              <option.CustomContent>
                <Content {...option} />
              </option.CustomContent>
            ) : (
              <Content {...option} />
            )}
          </li>
        ))}
      </ul>
    );
  };

  const onFilesDataGet = async (files) => {
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
          // from duplicate handle
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
        // formData.append('asset', file.path || file.originalFile)
      });

      // Store current uploading assets for calculation
      setUploadingAssets(newPlaceholders);

      // Showing assets = uploading assets + existing assets
      setAssets([...newPlaceholders, ...currentDataClone]);

      // Get team advance configurations first
      const { subFolderAutoTag } = advancedConfig;

      // Start to upload assets
      await uploadAsset(0, newPlaceholders, currentDataClone, totalSize, "", undefined, subFolderAutoTag, approvalId);

      // Finish uploading process
      showUploadProcess("done");

      // Do not need toast here because we have already process toast
      // toastUtils.success(`${data.length} Asset(s) uploaded.`)
    } catch (err) {
      // Finish uploading process
      showUploadProcess("done");

      setAssets(currentDataClone);
      console.log(err);
      if (err.response?.status === 402) toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not upload assets, please try again later.");
    }
  };

  const onFileChange = async (e) => {
    const files = Array.from(e.target.files).map((originalFile) => ({
      originalFile,
    }));
    if (files.length <= maxAssetsUpload) {
      onFilesDataGet(files);
    } else {
      toastUtils.error(`Maximum assets to upload is ${maxAssetsUpload}`);
    }
  };

  const toggleSelected = (id) => {
    const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
    const selectedValue = !assets[assetIndex].isSelected;
    // Toggle unselect when selected all will disable selected all
    if (!selectedValue && selectedAllAssets) {
      setSelectedAllAssets(false);
    }
    setAssets(
      update(assets, {
        [assetIndex]: {
          isSelected: { $set: !assets[assetIndex].isSelected },
        },
      }),
    );
  };

  // Select all assets
  const selectAllAssets = (value = true) => {
    setSelectedAllAssets(value);
    let assetList = [...assets];
    assetList.map((asset) => {
      asset.isSelected = value;
    });

    setAssets(assetList);
  };

  // Check if there is any asset is selected
  const hasSelectedAssets = () => {
    if (selectedAllAssets) {
      return true;
    }

    const selectedArr = assets.filter((asset) => asset.isSelected);

    return selectedArr.length > 0;
  };

  // Check if there is uploaded asset to submit
  const hasAssetToSubmit = () => {
    const selectedArr = assets.filter((asset) => asset.realUrl);

    return selectedArr.length > 0;
  };

  const getTagsInputData = async () => {
    try {
      const tagsResponse = await tagApi.getTags();
      setInputTags(tagsResponse.data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const saveBulkTag = async () => {
    setIsLoading(true);

    let currentAssetTags = [...assetTags];

    for (const { asset, isSelected, tags } of assets) {
      let tagPromises = [];
      let removeTagPromises = [];

      if (isSelected) {
        const newTags = _.differenceBy(currentAssetTags, tags || []);
        // Dont need to remove tags because it will override existing ones
        const removeTags = []; // _.differenceBy(tags || [], assetTags)

        for (const tag of removeTags) {
          removeTagPromises.push(assetApi.removeTag(asset.id, tag.id));
        }

        for (const tag of newTags) {
          // Old tag, dont need to create the new one
          if (tag.id) {
            tagPromises.push(assetApi.addTag(asset.id, tag));
          } else {
            // Have to insert immediately here to prevent duplicate tag created due to multi asset handling
            const rs = await assetApi.addTag(asset.id, tag);
            // Update back to asset tags array for the next asset usage
            currentAssetTags = currentAssetTags.map((assetTag) => {
              if (assetTag.name === tag.name) {
                assetTag = rs.data;
              }
              return assetTag;
            });
          }
        }
      }

      await Promise.all(tagPromises);
      await Promise.all(removeTagPromises);
    }

    // Save tags to asset
    let assetArr = [...assets];
    assetArr.map((asset) => {
      if (asset.isSelected) {
        asset.tags = (asset.tags || []).concat(currentAssetTags);
      }
    });

    toastUtils.success(`Save successfully`);

    // Reset tags
    setTags([]);

    setIsLoading(false);
  };

  const submit = async () => {
    setIsLoading(true);

    await approvalApi.submit(approvalId, { message, name: batchName });

    setSubmitted(true);

    toastUtils.success(`Save successfully`);

    setIsLoading(false);
  };

  const onViewAsset = (index) => {
    setSelectedAsset(index);
    setDetailModal(true);

    // @ts-ignore
    setTempTags(assets[index]?.tags || []);
    // @ts-ignore
    setTempComments(assets[index]?.comments || "");
  };

  const goNext = () => {
    if ((selectedAsset || 0) < assets.length - 1) {
      setTempTags([]);
      setTempComments("");

      const next = (selectedAsset || 0) + 1;
      // @ts-ignore
      setSelectedAsset(next);

      // @ts-ignore
      setTempTags(assets[next]?.tags || []);
      // @ts-ignore
      setTempComments(assets[next]?.comments || "");

      // @ts-ignore
      setSelectedAsset(next);
    }
  };

  const goPrev = () => {
    if ((selectedAsset || 0) > 0) {
      setTempTags([]);
      setTempComments("");

      const next = (selectedAsset || 0) - 1;
      // @ts-ignore
      setSelectedAsset(next);

      // @ts-ignore
      setTempTags(assets[next]?.tags || []);
      // @ts-ignore
      setTempComments(assets[next]?.comments || "");

      // @ts-ignore
      setSelectedAsset(next);
    }
  };

  const onSaveSingleAsset = async () => {
    if (selectedAsset !== undefined) {
      setIsLoading(true);

      // @ts-ignore
      const assetArr = [assets[selectedAsset]];
      const saveTag = async () => {
        let promises = [];
        let removeTagPromises = [];

        for (const { asset } of assetArr) {
          let tagPromises = [];

          // Find the new tags
          // @ts-ignore
          const newTags = _.differenceBy(tempTags, assets[selectedAsset]?.tags || []);
          const removeTags = _.differenceBy(assets[selectedAsset]?.tags || [], tempTags);

          for (const tag of newTags) {
            tagPromises.push(assetApi.addTag(asset.id, tag));
          }

          for (const tag of removeTags) {
            removeTagPromises.push(assetApi.removeTag(asset.id, tag.id));
          }

          await Promise.all(tagPromises);
        }

        return await Promise.all(promises);
      };

      const saveComment = async () => {
        let promises = [];

        for (const { asset } of assetArr) {
          promises.push(
            approvalApi.addComments(asset.id, {
              comments: tempComments,
              approvalId,
            }),
          );
        }

        return await Promise.all(promises);
      };

      await saveTag();
      await saveComment();

      // Update these tag and comments to asset
      let assetArrData = [...assets];
      // @ts-ignore
      assetArrData[selectedAsset].tags = tempTags;
      // @ts-ignore
      assetArrData[selectedAsset].comments = tempComments;

      toastUtils.success(`Save successfully`);

      setIsLoading(false);
    }
  };

  // Rename asset
  const confirmAssetRename = async (newValue) => {
    try {
      setIsLoading(true);

      // @ts-ignore
      const editedName = `${newValue}.${assets[selectedAsset]?.asset.extension}`;

      // Call API to upload asset
      // @ts-ignore
      await assetApi.updateAsset(assets[selectedAsset]?.asset.id, {
        updateData: { name: editedName },
      });

      // Update asset list
      let currentAssets = [...assets];
      // @ts-ignore
      currentAssets[selectedAsset].asset.name = newValue;
      setAssets(currentAssets);

      setIsLoading(false);

      toastUtils.success("Asset name updated");
    } catch (err) {
      toastUtils.error("Could not update asset name");
    }
  };

  const checkValidUser = () => {
    if (!hasPermission([ASSET_UPLOAD_APPROVAL])) {
      Router.replace("/");
    }
  };

  const hasBothTagAndComments = (asset) => {
    return asset.tags && asset.tags.length > 0 && asset.comments;
  };

  const hasTagOrComments = (asset) => {
    return (asset.tags && asset.tags.length > 0) || asset.comments;
  };

  const isAdmin = () => {
    return user.role.id === "admin" || user.role.id === "super_admin";
  };

  const updateAssetTagsState = (updatedTags) => {
    setIsLoading(false);

    // Update these tag and comments to asset
    let assetArrData = [...assets];
    // @ts-ignore
    assetArrData[selectedAsset].tags = updatedTags;

    setAssets(assetArrData);

    toastUtils.success("Update tag successfully");
  };

  useEffect(() => {
    checkValidUser();
    getTagsInputData();
    fetchPrevBatches();
  }, []);

  useEffect(() => {
    updateName(debouncedBatchName);
  }, [debouncedBatchName]);

  const fetchPrevBatches = async () => {
    setIsLoading(true);
    const { data } = await approvalApi.getUploadApprovals();
    setPrevBatches(data);
    setIsLoading(false);
  };

  const getBatchStatus = (status: number) => {
    switch (status) {
      case -1: {
        return <span>Rejected</span>;
      }
      case 0: {
        return <span>Pending</span>;
      }
      case 2: {
        return <span>Completed</span>;
      }
      default: {
        return <span>Draft</span>;
      }
    }
  };

  return (
    <>
      <AssetSubheader
        activeFolder={""}
        getFolders={() => {}}
        mode={"assets"}
        amountSelected={selectedAssets.length}
        activeFolderData={null}
        backToFolders={() => {}}
        setRenameModalOpen={() => {}}
        activeSortFilter={{}}
        titleText={"File Upload Page"}
        showAssetAddition={false}
      />
      <div className={`row ${styles["root-row"]}`}>
        <main className={`${styles.container} p-r-0`}>
          <p className={styles.title}>Create Upload Batch for Approval</p>
          <p className={styles.subtitle}>
            Upload a file or multiple files. You’ll then be able to suggest tags and submit to the admin(s){" "}
          </p>
          <input
            multiple={versionGroup ? false : true}
            id="file-input-id"
            ref={fileBrowserRef}
            style={{ display: "none" }}
            type="file"
            onChange={onFileChange}
          />

          <div className={styles["operation-wrapper"]}>
            <DropDownOptions />

            <div className={styles["button-wrapper"]}>
              {assets.length > 0 && hasSelectedAssets() && (
                <Button
                  type="button"
                  text="Deselect"
                  className="container secondary"
                  onClick={() => {
                    selectAllAssets(false);
                  }}
                />
              )}
              {assets.length > 0 && hasAssetToSubmit() && (
                <Button type="button" text="Select All" className="container secondary" onClick={selectAllAssets} />
              )}
              {assets.length > 0 && hasAssetToSubmit() && (
                <Button
                  type="button"
                  text="Submit Batch"
                  className="container primary"
                  onClick={() => {
                    if (!batchName) {
                      toastUtils.error("Please enter the batch name to submit");
                    } else {
                      setShowConfirmModal(true);
                    }
                  }}
                />
              )}
            </div>
          </div>
          {assets.length > 0 ? (
            <div className={styles["asset-list"]}>
              <div className={assetGridStyles["list-wrapper"]}>
                <ul className={`${assetGridStyles["grid-list"]} ${assetGridStyles["regular"]} ${styles["grid-list"]}`}>
                  {assets.map((assetItem, index) => {
                    if (assetItem.status !== "fail") {
                      return (
                        <li className={assetGridStyles["grid-item"]} key={assetItem.asset.id || index}>
                          <AssetThumbail
                            {...assetItem}
                            sharePath={""}
                            activeFolder={""}
                            isShare={false}
                            type={""}
                            showAssetOption={false}
                            toggleSelected={() => {
                              toggleSelected(assetItem.asset.id);
                            }}
                            openArchiveAsset={() => {}}
                            openDeleteAsset={() => {}}
                            openMoveAsset={() => {}}
                            openCopyAsset={() => {}}
                            openShareAsset={() => {}}
                            downloadAsset={() => {}}
                            openRemoveAsset={() => {}}
                            handleVersionChange={() => {}}
                            loadMore={() => {}}
                            onView={() => {
                              onViewAsset(index);
                            }}
                            infoWrapperClass={styles["asset-grid-info-wrapper"]}
                            textWrapperClass={
                              hasTagOrComments(assetItem)
                                ? hasBothTagAndComments(assetItem)
                                  ? styles["asset-grid-text-wrapper-2-icon"]
                                  : styles["asset-grid-text-wrapper"]
                                : "w-100"
                            }
                            customIconComponent={
                              <div className={`${styles["icon-wrapper"]} d-flex`}>
                                {assetItem.comments && (
                                  <IconClickable
                                    additionalClass={styles["edit-icon"]}
                                    SVGElement={Utilities.comment}
                                    onClick={() => {}}
                                  />
                                )}
                                {assetItem.tags && assetItem.tags.length > 0 && (
                                  <IconClickable
                                    additionalClass={styles["edit-icon"]}
                                    src={Utilities.greenTag}
                                    onClick={() => {}}
                                  />
                                )}
                              </div>
                            }
                            showViewButtonOnly={true}
                            showSelectedAsset={true}
                          />
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <DropzoneProvider>
              <AssetUpload
                onDragText={"Drop files here to upload"}
                preDragText={`Or Drag and Drop your file(s) here to upload`}
                onFilesDataGet={onFilesDataGet}
              />
            </DropzoneProvider>
          )}
        </main>
        {sideOpen && (
          <div className={`${styles["right-panel"]}`}>
            <div className={detailPanelStyles.container}>
              {assets.length > 0 && hasAssetToSubmit() ? (
                <>
                  <h2 className={styles["detail-title"]}>Batch Details</h2>
                  <div className={detailPanelStyles["first-section"]}>
                    <div className={`${detailPanelStyles["field-wrapper"]} ${styles["batchSidePanel"]}`}>
                      <div className={`${detailPanelStyles.field} ${styles["field-name"]}`}>Batch Name</div>
                      <Input
                        onChange={(e) => {
                          setBatchName(e.target.value);
                        }}
                        placeholder={"Batch Name"}
                        value={batchName}
                        styleType={"regular-height-short"}
                      />
                    </div>
                  </div>

                  {hasSelectedAssets() && (
                    <>
                      <div className={detailPanelStyles["field-wrapper"]}>
                        <CreatableSelect
                          title="Tags"
                          addText="Add Tags"
                          onAddClick={() => setActiveDropdown("tags")}
                          selectPlaceholder={"Enter a new tag or select an existing one"}
                          avilableItems={inputTags}
                          setAvailableItems={setInputTags}
                          selectedItems={assetTags}
                          setSelectedItems={setTags}
                          creatable={true}
                          onAddOperationFinished={(stateUpdate) => {
                            setActiveDropdown("");
                          }}
                          onRemoveOperationFinished={async (index, stateUpdate) => {}}
                          onOperationFailedSkipped={() => setActiveDropdown("")}
                          isShare={false}
                          asyncCreateFn={(newItem) => {
                            return { data: newItem };
                          }}
                          dropdownIsActive={activeDropdown === "tags"}
                          ignorePermission={true}
                        />
                      </div>

                      <Button
                        className={"container m-t-20 primary"}
                        type="button"
                        text="Save Changes"
                        onClick={saveBulkTag}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <h2 className={styles["detail-title"]}>Previous Batches</h2>
                  {prevBatches.length > 0 ? (
                    <ul>
                      {prevBatches.map((batch, i) => (
                        <li className={styles["previous-item"]} key={i}>
                          <div className={styles["previous-item-wrapper"]}>
                            <div className={styles["previous-thumbnail"]}>
                              {batch?.assets[0]?.thumbailUrl && (
                                <img src={batch?.assets[0]?.thumbailUrl || Assets.unknown} alt={batch?.name} />
                              )}
                              {!batch?.assets[0]?.thumbailUrl && (
                                <AssetIcon extension={batch?.assets[0]?.asset.extension} onList={true} />
                              )}
                            </div>
                            <div className={styles["info-wrapper"]}>
                              <div>
                                <div className={styles["previous-name"]}>{batch?.name ? batch?.name : "Untitled"}</div>
                                <div className={styles["previous-status"]}>{getBatchStatus(batch?.status)}</div>
                                <div className={styles["previous-date"]}>
                                  {moment(batch?.createdAt).format("MM/DD/YYYY")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No previous batches have been created</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <section className={styles.menu}>
          <IconClickable
            src={Utilities.closePanelLight}
            onClick={() => toggleSideMenu()}
            additionalClass={`${styles["menu-icon"]} ${!sideOpen && "mirror"} ${styles.expand}`}
          />
        </section>
      </div>

      <Base
        modalIsOpen={showDetailModal}
        closeModal={() => {
          setDetailModal(false);
        }}
        headText={""}
        confirmText={""}
        closeButtonOnly={true}
        disabledConfirm={false}
        additionalClasses={["visible-block", styles["approval-detail-modal"]]}
        showCancel={false}
        confirmAction={() => {}}
      >
        <div className={`row ${styles["modal-wrapper"]} height-100`}>
          <div className={`${styles["left-bar"]}`}>
            <div className={styles["file-name"]}>
              <span>{assets[selectedAsset]?.asset.name}</span>
              {isAdmin() && (
                <IconClickable
                  additionalClass={styles["edit-icon"]}
                  SVGElement={Utilities.edit}
                  onClick={() => {
                    setShowRenameModal(true);
                  }}
                />
              )}
            </div>
            <div className={styles["date"]}>
              {moment(assets[selectedAsset]?.asset?.createdAt).format("MMM DD, YYYY, hh:mm a")}
            </div>
            <div className={styles["batchImg"]}>
              {assets[selectedAsset]?.asset.type === "image" && (
                <AssetImg name={assets[selectedAsset]?.asset.name} assetImg={assets[selectedAsset]?.thumbailUrl} />
              )}
            </div>
            {assets[selectedAsset]?.asset.type !== "image" &&
              assets[selectedAsset]?.asset.type !== "video" &&
              assets[selectedAsset]?.thumbailUrl &&
              (assets[selectedAsset]?.asset.extension.toLowerCase() === "pdf" ? (
                <AssetPdf asset={assets[selectedAsset]?.asset} />
              ) : (
                <AssetImg name={assets[selectedAsset]?.asset.name} assetImg={assets[selectedAsset]?.thumbailUrl} />
              ))}
            {assets[selectedAsset]?.asset.type !== "image" &&
              assets[selectedAsset]?.asset.type !== "video" &&
              !assets[selectedAsset]?.thumbailUrl && <AssetIcon extension={assets[selectedAsset]?.asset.extension} />}
            {assets[selectedAsset]?.asset.type === "video" && (
              <video controls>
                <source
                  src={assets[selectedAsset]?.previewUrl ?? assets[selectedAsset]?.realUrl}
                  type={
                    assets[selectedAsset]?.previewUrl ? "video/mp4" : `video/${assets[selectedAsset]?.asset.extension}`
                  }
                />
                Sorry, your browser doesn't support video playback.
              </video>
            )}
            <div className={styles["navigation-wrapper"]}>
              <span>
                {(selectedAsset || 0) + 1} of {assets.length} in Batch
              </span>
              <IconClickable
                src={Utilities.arrowPrev}
                onClick={() => {
                  goPrev();
                }}
              />
              <IconClickable
                src={Utilities.arrowNext}
                onClick={() => {
                  goNext();
                }}
              />
            </div>
          </div>
          <div className={"height-100"}>
            <div className={`${detailPanelStyles.container} ${styles["right-form"]}`}>
              <h2 className={styles["detail-title"]}>Add Attributes to Selected Assets</h2>

              <div className={`${detailPanelStyles["field-wrapper"]}`}>
                <CreatableSelect
                  title="Tags"
                  addText="Add Tags"
                  onAddClick={() => setActiveDropdown("tags")}
                  selectPlaceholder={"Enter a new tag or select an existing one"}
                  avilableItems={inputTags}
                  setAvailableItems={setInputTags}
                  selectedItems={tempTags}
                  setSelectedItems={setTempTags}
                  onAddOperationFinished={(stateUpdate) => {
                    setActiveDropdown("");
                  }}
                  onRemoveOperationFinished={async (index, stateUpdate) => {}}
                  onOperationFailedSkipped={() => setActiveDropdown("")}
                  isShare={false}
                  asyncCreateFn={(newItem) => {
                    return { data: newItem };
                  }}
                  dropdownIsActive={activeDropdown === "tags"}
                  ignorePermission={true}
                  sortDisplayValue={true}
                />
              </div>

              <div className={detailPanelStyles["field-wrapper"]}>
                <div className={`secondary-text ${detailPanelStyles.field} ${styles["field-name"]}`}>Comments</div>
                <TextArea
                  type={"textarea"}
                  rows={8}
                  placeholder={"Add comments"}
                  value={tempComments}
                  onChange={(e) => {
                    setTempComments(e.target.value);
                  }}
                  styleType={"regular-short"}
                  maxLength={200}
                />
              </div>
            </div>

            <Button
              className={`container ${styles["add-tag-btn"]} m-t-20 m-b-40 primary`}
              type="button"
              text="Save changes"
              onClick={onSaveSingleAsset}
            />
          </div>
        </div>
      </Base>

      <Base
        modalIsOpen={showConfirmModal}
        closeModal={() => {}}
        confirmText={""}
        disabledConfirm={false}
        additionalClasses={["visible-block"]}
        showCancel={false}
        overlayAdditionalClass={styles["sendMsgModal"]}
        confirmAction={() => {}}
      >
        <div className={styles["confirm-modal-wrapper"]}>
          {!submitted && (
            <>
              <div className={styles["modal-field-title"]}>Send a Message to the Admin</div>

              <TextArea
                type={"textarea"}
                rows={8}
                placeholder={"Add message"}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                styleType={"regular-short"}
                maxLength={200}
              />

              <div className={styles["modal-field-subtitle"]}>
                Are you sure you want to submit your assets for approval?
              </div>
            </>
          )}
          {submitted && (
            <img
              src={Utilities.grayClose}
              alt={"close"}
              className={styles["modalClose"]}
              onClick={() => {
                setShowConfirmModal(false);
                Router.push("/main/upload-approvals");
              }}
            />
          )}
          {submitted && (
            <p className={`${styles["modal-field-title"]} ${styles["thanksSubmit"]}`}>
              Thanks for submitting your assets for approval.
              <br />
              The admin will be notified of your submission and will be able to review it.
            </p>
          )}

          <div className={styles["confirm-action"]}>
            {!submitted && (
              <>
                <Button
                  className={`${styles["keep-edit-btn"]} container secondary`}
                  type="button"
                  text="Keep editing"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setMessage("");
                  }}
                />
                <Button
                  className={`${styles["add-tag-btn"]} container primary`}
                  type="button"
                  text="Submit"
                  onClick={submit}
                />
              </>
            )}
            {submitted && (
              <Button
                className={`${styles["add-tag-btn"]} container primary`}
                type="button"
                text="Back to Sparkfive"
                onClick={() => {
                  setShowConfirmModal(false);
                  Router.push("/main/upload-approvals");
                }}
              />
            )}
          </div>
        </div>
      </Base>

      <RenameModal
        closeModal={() => setShowRenameModal(false)}
        modalIsOpen={showRenameModal}
        renameConfirm={confirmAssetRename}
        type={"Asset"}
        initialValue={assets[selectedAsset]?.asset?.name?.substring(
          0,
          assets[selectedAsset]?.asset?.name.lastIndexOf("."),
        )}
      />
    </>
  );
};

export default UploadApproval;
