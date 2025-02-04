import update from 'immutability-helper';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';

import { validation } from '../constants/file-validation';
import { AssetContext, SocketContext } from '../context';
import assetApi from '../server-api/asset';
import { convertTimeFromSeconds, getFolderKeyAndNewNameByFileName } from '../utils/upload';

interface Asset {
  id: string;
  name: string;
  type: string;
  thumbailUrl: string;
  realUrl: string;
  extension: string;
  version: number;
}
interface Item {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sharePath: null;
  sharePassword: null;
  shareStatus: null;
  status: string;
  thumbnailPath: null;
  thumbnailExtension: null;
  thumbnails: null;
  thumbnailStorageId: null;
  thumbnailName: null;
  assetsCount: string;
  assets: Asset[];
  size: string;
  length: number;
  [key: string]: any;
}

const loadingDefaultAsset = {
  asset: {
    name: "placeholder",
    createdAt: new Date(),
    type: "image",
  },
  isLoading: true,
};

const loadingDefaultFolder = {
  name: "placeholder",
  length: 10,
  assets: [],
  isLoading: true,
  createdAt: new Date(),
};

export default ({ children }) => {
  const router = useRouter();
  const { socket, connected, globalListener } = useContext(SocketContext);

  const [assets, setAssets] = useState([]);
  const [lastUploadedFolder, setLastUploadedFolder] = useState();
  const [folders, setFolders] = useState([]);

  const [operationAsset, setOperationAsset] = useState(null);
  const [operationFolder, setOperationFolder] = useState("");
  const [operationAssets, setOperationAssets] = useState([]); // Hold assets to be operated without affecting to asset list in main grid

  const [activeOperation, setActiveOperation] = useState("");

  const [activeFolder, setActiveFolder] = useState("");
  const [activePageMode, setActivePageMode] = useState("");

  const [nextPage, setNextPage] = useState(1);
  const [totalAssets, setTotalAssets] = useState(0);

  const [needsFetch, setNeedsFetch] = useState("");

  const [loadingAssets, setLoadingAssets] = useState(false);

  const [addedIds, setAddedIds] = useState([]);

  const [selectedAllAssets, setSelectedAllAssets] = useState(false);
  const [selectedAllFolders, setSelectedAllFolders] = useState(false);
  const [completedAssets, setCompletedAssets] = useState([]);
  const [history, setHistory] = useState("");
  // Upload process
  const [uploadingAssets, setUploadingAssets] = useState([]);
  const [uploadingType, setUploadingType] = useState();
  const [uploadingStatus, setUploadingStatus] = useState("none"); // Allowed value: "none", "uploading", "done"
  const [uploadingPercent, setUploadingPercent] = useState(0); // Percent of uploading process: 0 - 100
  const [uploadingFile, setUploadingFile] = useState<number>(); // Current uploading file index
  const [uploadingFileName, setUploadingFileName] = useState<string>(); // Current uploading file name, import feature need this
  const [uploadRemainingTime, setUploadRemainingTime] = useState<string>(""); // Remaining time
  const [uploadDetailOverlay, setUploadDetailOverlay] = useState(false); // Detail overlay
  const [folderGroups, setFolderGroups] = useState(); // This groups contain all folder key which is need to identity which folder file need to be saved to
  const [retryListCount, setRetryListCount] = useState(0);

  // For dropbox upload process
  const [uploadSourceType, setUploadSourceType] = useState(); // This maybe local or dropbox or gdrive
  const [dropboxUploadingFile, setDropboxUploadingFile] = useState(); // Current dropbox uploading file index, this is received from server
  const [folderImport, setFolderImport] = useState(false); // If there is 1 folder imported, just hide number of imported assets due to complexity to count file number

  // Download process
  const [totalDownloadingAssets, setTotalDownloadingAssets] = useState(0);
  const [downloadingStatus, setDownloadingStatus] = useState("none"); // Allowed value: "none", "zipping", "preparing", "done", "error"
  const [downloadingPercent, setDownloadingPercent] = useState(0); // Percent of uploading process: 0 - 100
  const [downloadingError, setDownloadingError] = useState(""); // Percent of uploading process: 0 - 100
  const [downloadController, setDownloadController] = useState(); // Need to keep this controller when downloading to cancel process

  // Asset navigation
  const [detailOverlayId, setDetailOverlayId] = useState(undefined);

  // sidenamv list count states declared below
  const [sidenavFolderList, setSidenavFolderList] = useState([]);
  const [sidenavFolderNextPage, setSidenavFolderNextPage] = useState(1);
  const [sidenavTotalCollectionCount, setSidenavTotalCollectionCount] = useState(0);

  // Sidenav folders child Listing in particular collection collections area
  const [sidenavFolderChildList, setSidenavFolderChildList] = useState(new Map());

  // Folder id for sub Collection view
  const [activeSubFolders, setActiveSubFolders] = useState("");

  // Sidebar navigation
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // For viewing asset in file associations
  const [currentViewAsset, setCurrentViewAsset] = useState();

  // For subcollection page states for collection and asset associations
  const [subFoldersViewList, setSubFoldersViewList] = useState({ results: [], next: 0, total: 0 });
  const [subFoldersAssetsViewList, setSubFoldersAssetsViewList] = useState({ results: [], next: 0, total: 0 });
  const [headerName, setHeaderName] = useState("All Assets");

  const [selectedAllSubFoldersAndAssets, setSelectedAllSubFoldersAndAssets] = useState(false);

  const [selectedAllSubAssets, setSelectedAllSubAssets] = useState(false);
  const [listUpdateFlag, setListUpdateFlag] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);

  const [showSubCollectionContent, setShowSubCollectionContent] = useState(false);
  const [assetDragFlag, setAssetDragFlag] = useState(false);
  const [assetDragId, setAssetDragId] = useState(false);
  const [assetDragType, setAssetDragType] = useState("")

  const [droppableId, setDroppableId] = useState("");

  const [collectionDragFlag, setCollectionDragFlag] = useState(false);
  const [collectionDragId, setCollectionDragId] = useState("");
  const [collectionParentDragId, setCollectionParentDragId] = useState("");
  const [subCollectionMove, setSubCollectionMove] = useState(false);

  const [faceRecognitionScanning, setFaceRecognitionScanning] = useState(false);
  const [faceRecognitionScanningPercent, setFaceRecognitionScanningPercent] = useState(0);

  const setPlaceHolders = (type, replace = true) => {
    if (type === "asset") {
      if (replace) setAssets(Array(10).fill(loadingDefaultAsset));
      else setAssets([...assets, ...Array(10).fill(loadingDefaultAsset)]);
    } else {
      if (replace) setFolders(Array(10).fill(loadingDefaultFolder));
      else setFolders([...folders, ...Array(10).fill(loadingDefaultFolder)]);
    }
  };

  const setAssetItems = (inputAssets, replace = true) => {
    const { results, next, total } = inputAssets;
    if (results) inputAssets = results;
    if (next) setNextPage(next);
    if (total) setTotalAssets(total);

    if (replace) setAssets(inputAssets);
    else setAssets([...assets.filter((asset) => !asset.isLoading), ...inputAssets]);
  };

  const setCompletedAssetItems = (inputAssets, replace = true) => {
    const { results, next, total } = inputAssets;
    if (results) inputAssets = results;

    if (replace) setCompletedAssets(inputAssets);
    else setCompletedAssets([...completedAssets.filter((asset) => !asset.isLoading), ...inputAssets]);
  };

  const setFolderItems = (inputFolders, replace = true, ignoreTotalItem = false) => {
    const { results, next, total } = inputFolders;
    if (results) inputFolders = results;
    if (next) setNextPage(next);
    if (total && !ignoreTotalItem) setTotalAssets(total);
    if (replace) {
      setFolders((prev) => inputFolders);
    } else setFolders([...folders.filter((folder) => !folder.isLoading), ...inputFolders]);
  };

  const subFoldersList = (inputFolders: { results: Item[]; next: number; total: number }, replace = true) => {
    const { results, next, total } = inputFolders;
    setSubFoldersViewList((previousValue) => {
      return {
        ...previousValue,
        results: replace ? results : [...previousValue.results, ...results],
        next,
        total,
      };
    });
  };

  const subFoldersAssetList = (inputFolders: { results: Item[]; next: number; total: number }, replace = true) => {

    const { results, next, total } = inputFolders;

    setSubFoldersAssetsViewList((previousValue) => {
      return {
        ...previousValue,
        results: replace ? results : [...previousValue.results, ...results],
        next,
        total,
      };
    });

  };

  const setSidenavFolderChildListItems = (inputFolders: any, id: string, replace = true) => {
    const { results, next, total } = inputFolders;
    if (replace) {
      if (results.length > 0) {
        setSidenavFolderChildList((map) => {
          return new Map(map.set(id, { results, next, total }));
        });
      }
    } else {
      setSidenavFolderChildList((map) => {
        return new Map(map.set(id, { results: [...(map.get(id)?.results || {}), ...results], next, total }));
      });
    }
  };

  const appendNewSubSidenavFolders = (inputFolders: any, id: string, remove: boolean, removeId?: string) => {
    const data = sidenavFolderChildList.get(id);
    if (!data) return;

    const { results = [], next = -1, total = 0 } = sidenavFolderChildList.get(id);

    if (!remove) {
      setSidenavFolderChildList((map) => {
        return new Map(map.set(id, { results: [...inputFolders, ...results], next, total: total + 1 }));
      });
    } else {
      const folderIndex = results?.findIndex((folder) => folder.id === removeId);

      if (folderIndex !== -1) {
        setSidenavFolderChildList((map) => {
          return new Map(
            map.set(id, { results: update(results, { $splice: [[folderIndex, 1]] }), next, total: total - 1 }),
          );
        });
      }
    }
  };

  const setSidenavFolderItems = (
    inputFolders: { results: Item[]; next: number; total: number },
    replace = true,
    ignoreTotalItem = false,
  ) => {
    const { results, next, total } = inputFolders;
    let resultedArray: Item[] = [];
    if (results) resultedArray = results;
    if (next) setSidenavFolderNextPage(next);
    if (total && !ignoreTotalItem) setSidenavTotalCollectionCount(total);
    if (replace) setSidenavFolderList(resultedArray);
    else setSidenavFolderList([...sidenavFolderList.filter((folder) => !folder.isLoading), ...resultedArray]);
  };

  // Mark assets have been selected all even assets do not exist in pagination
  const selectAllAssets = (isSelectedAll = true) => {
    setSelectedAllAssets(isSelectedAll);
  };

  // Mark all folders have been selected all even folders do not exist in pagination
  const selectAllFolders = (isSelectedAll = true) => {
    setSelectedAllFolders(isSelectedAll);
  };

  // Select all folders in Sub Collections View
  const selectAllSubFoldersAndAssetsViewList = (value: boolean = true) => {
    setSelectedAllSubFoldersAndAssets(value);
  };

  // Show upload process toast
  const showUploadProcess = (value: string, fileIndex?: number) => {
    // Set uploading file index
    if (fileIndex !== undefined) {
      setUploadingFile(fileIndex);
    }

    // Update uploading status
    setUploadingStatus(value);

    // Reset dropbox uploading file
    if (value === "uploading") {
      setDropboxUploadingFile(undefined);
    }

    if (value === "none") {
      setFolderImport(false);
      setUploadingPercent(0);
    }

    // Reset all value
    if (fileIndex === 0) {
      setUploadingPercent(0);
    }
  };

  // Set upload assets
  const setUploadingAssetItems = (inputAssets) => {
    setUploadingAssets(inputAssets);
  };

  const openUploadDetailOverlay = (show: boolean) => {
    setUploadDetailOverlay(show);
  };

  // Get params
  const getCreationParameters = (attachQuery?: any) => {
    let queryData: any = {};

    // Attach extra query
    if (attachQuery) {
      queryData = { ...queryData, ...attachQuery };
    }
    return queryData;
  };

  // Upload asset
  const reUploadAsset = async (
    i: number,
    assets: any,
    currentDataClone: any,
    totalSize: number,
    retryList: any[],
    folderId,
    folderGroup = {},
    subFolderAutoTag = true,
  ) => {
    try {
      const formData = new FormData();
      let file = retryList[i].file.originalFile;
      let newAssets = 0;

      let currentUploadingFolderId = null;

      // Get file group info, this returns folderKey and newName of file
      let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.webkitRelativePath, subFolderAutoTag);

      // Do validation
      if (retryList[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE) {
        // Violate validation, mark failure
        const updatedAssets = assets.map((asset, index) =>
          index === retryList[i].index
            ? {
              ...asset,
              status: "fail",
              index,
              error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE,
            }
            : asset,
        );

        // Update uploading assets
        setUploadingAssets(updatedAssets);

        // The final one
        if (i === retryList.length - 1) {
          return;
        } else {
          // Keep going
          await reUploadAsset(
            i + 1,
            updatedAssets,
            currentDataClone,
            totalSize,
            retryList,
            folderId,
            folderGroup,
            subFolderAutoTag,
          );
        }
      }

      if (i === 0) {
        setRetryListCount(retryList.length);
      }

      // Show uploading toast
      showUploadProcess("re-uploading", i);

      // Set current upload file name
      setUploadingFileName(retryList[i].asset.name);

      // If user is uploading files in folder which is not saved from server yet
      if (fileGroupInfo.folderKey && !folderId) {
        // Current folder Group have the key
        if (folderGroup[fileGroupInfo.folderKey]) {
          currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey];
        }
      }

      // Append file to form data
      formData.append("asset", file);

      let size = totalSize;
      // Calculate the rest of size
      assets.map((asset) => {
        // Exclude done assets
        if (asset.status === "done" || asset.status === "fail") {
          size -= asset.asset.size;
          newAssets += 1;
        }
      });

      const attachedQuery = { estimateTime: 1, size, totalSize };

      if (folderId) {
        attachedQuery["folderId"] = folderId;
      }

      // Uploading the new folder
      if (currentUploadingFolderId) {
        attachedQuery["folderId"] = currentUploadingFolderId;
      }

      // Call API to upload
      let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery));

      // If user is uploading files in folder which is not saved from server yet
      if (fileGroupInfo.folderKey && !folderId) {
        /// If user is uploading new folder and this one still does not have folder Id, add it to folder group
        if (!folderGroup[fileGroupInfo.folderKey]) {
          folderGroup[fileGroupInfo.folderKey] = data[0].asset.folders[0];
        }
      }

      // Mark asset selected
      data = data.map((item) => {
        item.isSelected = true;
        return item;
      });

      assets[retryList[i].index] = data[0];

      // At this point, file place holder will be removed
      setAssets([...assets, ...currentDataClone]);
      setAddedIds(data.map((assetItem) => assetItem.asset.id));

      // Update total assets
      setTotalAssets(totalAssets + newAssets + 1);

      // Mark this asset as done
      const updatedAssets = assets.map((asset, index) =>
        index === retryList[i].index ? { ...asset, status: "done" } : asset,
      );

      setUploadingAssets(updatedAssets);

      // The final one
      if (i === retryList.length - 1) {
        // Finish uploading process
        showUploadProcess("done");
      } else {
        // Keep going
        await reUploadAsset(
          i + 1,
          updatedAssets,
          currentDataClone,
          totalSize,
          retryList,
          folderId,
          folderGroup,
          subFolderAutoTag,
        );
      }
    } catch (e) {
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) =>
        index === retryList[i]?.index ? { ...asset, index, status: "fail", error: "Processing file error" } : asset,
      );

      // Update uploading assets
      setUploadingAssets(updatedAssets);

      // The final one
      if (i === retryList.length - 1) {
        // Finish uploading process
        showUploadProcess("done");
      } else {
        // Keep going
        await reUploadAsset(
          i + 1,
          updatedAssets,
          currentDataClone,
          totalSize,
          retryList,
          folderId,
          folderGroup,
          subFolderAutoTag,
        );
      }
    }
  };

  const updateUploadingFileName = (name: string) => {
    setUploadingFileName(name);
  };

  const updateFolderGroups = (value) => {
    setFolderGroups(value);
  };

  const updateUploadSourceType = (value) => {
    setUploadSourceType(value);
  };

  const updateTotalAssets = (value: number) => {
    setTotalAssets(value);
  };

  const updateDownloadingStatus = (status, percent, totalDownloadingAssets, error) => {
    if (status) {
      setDownloadingStatus(status);
    }

    if (!isNaN(percent)) {
      setDownloadingPercent(percent);
    }

    if (!isNaN(totalDownloadingAssets)) {
      setTotalDownloadingAssets(totalDownloadingAssets);
    }

    if (error) {
      setDownloadingError(error);
    }
  };

  // Init socket listener
  useEffect(() => {
    // Socket is available and connected
    if (socket && connected && globalListener) {
      console.log(`Register socket listener...`);
      // Listen upload file process event
      socket.on("uploadFilesProgress", function (data) {
        setUploadingPercent(data.percent);
        setUploadRemainingTime(`${convertTimeFromSeconds(data.timeLeft)} remaining`);

        // setUploadingFileName("Test.png")
        if (data.fileName) {
          setUploadingFileName(data.fileName);
        }
        // setUploadingFile(0)
        if (!isNaN(data.uploadingAssets)) {
          setDropboxUploadingFile(data.uploadingAssets);
        }
      });

      socket.on("downloadFilesProgress", function (data: any) {
        setDownloadingPercent(data.percent);
      });

      socket.on("faceRecognitionScanningProgress", function (data: any) {
        if (data.status === "scanning") {
          setFaceRecognitionScanningPercent(data.percent);
        } else {
          setFaceRecognitionScanning(false);
        }
      });
    }
  }, [socket, connected]);

  // Reset active folders if user navigate to other pages
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      const parts = localStorage.getItem('history')?.split('/');
      const isMainAssets = parts && parts.length > 3 && parts[1] === 'main' && parts[2] === 'assets';
      const isCollectionsAssetDetail = parts && parts.length > 3 && parts[1] === 'collections' && parts[2] === 'assetDetail';
      (isMainAssets || isCollectionsAssetDetail) ? null : setActiveFolder("");
      localStorage.setItem("history", url);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const assetsValue = {
    assets,
    setAssets: setAssetItems,
    lastUploadedFolder,
    setLastUploadedFolder,
    completedAssets,
    setCompletedAssets: setCompletedAssetItems,
    nextPage,
    totalAssets,
    folders,
    setFolders: setFolderItems,
    setPlaceHolders,
    activeOperation,
    setActiveOperation,
    operationAsset,
    setOperationAsset,
    operationFolder,
    setOperationFolder,
    activeFolder,
    setActiveFolder,
    activePageMode,
    setActivePageMode,
    needsFetch,
    setNeedsFetch,
    addedIds,
    setAddedIds,
    loadingAssets,
    setLoadingAssets,
    selectedAllAssets,
    selectAllAssets,
    selectedAllFolders,
    selectAllFolders,
    uploadingStatus,
    showUploadProcess,
    uploadingFile,
    uploadRemainingTime,
    uploadingPercent,
    setUploadingPercent,
    uploadingAssets,
    setUploadingAssets: setUploadingAssetItems,
    uploadingType,
    setUploadingType,
    uploadDetailOverlay,
    setUploadDetailOverlay: openUploadDetailOverlay,
    reUploadAsset,
    uploadingFileName,
    setUploadingFileName: updateUploadingFileName,
    folderGroups,
    setFolderGroups: updateFolderGroups,
    setUploadSourceType: updateUploadSourceType,
    dropboxUploadingFile,
    uploadSourceType,
    setTotalAssets: updateTotalAssets,
    downloadingStatus,
    downloadingPercent,
    totalDownloadingAssets,
    downloadingError,
    updateDownloadingStatus,
    retryListCount,
    folderImport,
    setFolderImport,
    detailOverlayId,
    setDetailOverlayId,
    operationAssets,
    setOperationAssets,
    currentViewAsset,
    setCurrentViewAsset,
    // sidenav folders states
    sidenavFolderList,
    setSidenavFolderList: setSidenavFolderItems,
    sidenavFolderNextPage,
    setSidenavFolderNextPage,
    sidenavTotalCollectionCount,
    setSidenavTotalCollectionCount,
    sidenavFolderChildList,
    setSidenavFolderChildList: setSidenavFolderChildListItems,
    sidebarOpen,
    setSidebarOpen,
    // Sub collection page folders and assets states
    activeSubFolders,
    setActiveSubFolders,

    subFoldersViewList,
    setSubFoldersViewList: subFoldersList,

    subFoldersAssetsViewList,
    setSubFoldersAssetsViewList: subFoldersAssetList,

    headerName,
    setHeaderName,

    //select all feature for the selected subcollection page assets and folders
    selectedAllSubFoldersAndAssets,
    setSelectedAllSubFoldersAndAssets: selectAllSubFoldersAndAssetsViewList,
    selectedAllSubAssets,
    setSelectedAllSubAssets,
    appendNewSubSidenavFolders,
    setListUpdateFlag,
    listUpdateFlag,
    downloadController,
    setDownloadController,
    currentFolder,
    setCurrentFolder,
    showSubCollectionContent,
    setShowSubCollectionContent,
    history,
    setHistory,
    assetDragFlag,
    assetDragId,
    assetDragType,
    setAssetDragFlag,
    setAssetDragId,
    setAssetDragType,
    droppableId,
    setDroppableId,
    collectionDragFlag,
    setCollectionDragFlag,
    collectionDragId,
    setCollectionDragId,
    collectionParentDragId,
    setCollectionParentDragId,
    subCollectionMove,
    setSubCollectionMove,
    faceRecognitionScanningPercent,
    faceRecognitionScanning,
    setFaceRecognitionScanning,
  };
  return <AssetContext.Provider value={assetsValue}>{children}</AssetContext.Provider>;
};