import update from "immutability-helper";
import { useContext, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { AssetOps, Utilities } from "../../../assets";
import { AssetContext, UserContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import shareApi from "../../../server-api/share-collection";
import customFileSizeApi from "../../../server-api/size";
import toastUtils from "../../../utils/toast";
import urlUtils from "../../../utils/url";
import AssetAddition from "./asset-addition";
import styles from "./detail-overlay.module.css";
import VersionList from "./version-list";

import { isMobile } from "react-device-detect";

import { ASSET_DOWNLOAD } from "../../../constants/permissions";

// Components
import fileDownload from "js-file-download";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import ConversationList from "../conversation/conversation-list";
import RenameModal from "../modals/rename-modal";
import AssetCropImg from "./asset-crop-img";
import AssetIcon from "./asset-icon";
import AssetImg from "./asset-img";
import AssetPdf from "./asset-pdf";
import CdnPanel from "./cdn-panel";
import CropSidePanel from "./crop-side-panel";
import SidePanel from "./detail-side-panel";

import { isImageType } from "../../../utils/file";

import AssetNote from "./asset-note";
import AssetNotes from "./asset-notes";
import AssetTranscript from "./asset-transcript";

import Dropdown from "../inputs/dropdown";
import AssetRelatedFilesList from "./asset-related-files-list";

const getDefaultDownloadImageType = (extension) => {
  const defaultDownloadImageTypes = [
    {
      value: "png",
      label: "PNG",
    },
    {
      value: "jpg",
      label: "JPG",
    },
    {
      value: "tiff",
      label: "TIFF",
    },
  ];

  let foundExtension = extension || "";
  if (extension === "jpeg") {
    foundExtension = "jpg";
  }

  if (extension === "tif") {
    foundExtension = "tiff";
  }

  const existingExtension = defaultDownloadImageTypes.filter(
    (type) => type.value === foundExtension
  );

  // Already existed
  if (existingExtension.length > 0) {
    return defaultDownloadImageTypes.map((type) => {
      if (type.value === foundExtension) {
        type.label = `${foundExtension.toUpperCase()} (original)`;
      }

      return type;
    });
  } else {
    return defaultDownloadImageTypes.concat([
      {
        value: foundExtension,
        label: `${foundExtension.toUpperCase()} (original)`,
      },
    ]);
  }
};

const getResizeSize = (assetWidth, assetHeight): any => {
  const maximumWidth = 900;
  const maximumHeight = 900;
  if (assetWidth > maximumWidth) {
    return {
      width: maximumWidth,
      height: maximumHeight * (assetHeight / assetWidth),
    };
  }

  if (assetHeight > maximumHeight) {
    return {
      width: maximumWidth * (assetWidth / assetHeight),
      height: maximumHeight,
    };
  }

  return {
    width: assetWidth,
    height: assetHeight,
  };
};

const DetailOverlay = ({
  asset,
  realUrl,
  thumbailUrl,
  closeOverlay,
  openShareAsset = () => {},
  openDeleteAsset = () => {},
  loadMore = () => {},
  isShare = false,
  sharePath = "",
  activeFolder = "",
  initialParams,
  availableNext = true,
  outsideDetailOverlay = false,
}) => {
  const { hasPermission } = useContext(UserContext);
  const { user, cdnAccess, transcriptAccess } = useContext(UserContext);

  const [assetDetail, setAssetDetail] = useState(undefined);

  const [renameModalOpen, setRenameModalOpen] = useState(false);

  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  const [activeCollection, setActiveCollection] = useState({
    name: "",
    assets: [],
  });
  const [assetIndex, setAssetIndex] = useState(0);

  const [activeSideComponent, setActiveSidecomponent] = useState("detail");

  const {
    assets,
    setAssets,
    folders,
    needsFetch,
    updateDownloadingStatus,
    setDetailOverlayId,
    setOperationAssets,
  } = useContext(AssetContext);

  const [sideOpen, setSideOpen] = useState(true);

  const [versionCount, setVersionCount] = useState(0);
  const [versions, setVersions] = useState([]);
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [changedVersion, setChangedVersion] = useState(false); // to track version uploaded on overlay close
  const [versionRealUrl, setVersionRealUrl] = useState(realUrl);
  const [versionThumbnailUrl, setVersionThumbnailUrl] = useState(thumbailUrl);
  const [previewUrl, setPreviewUrl] = useState(null);

  const resizeSizes = getResizeSize(
    currentAsset.dimensionWidth,
    currentAsset.dimensionHeight
  );

  const [detailPosSize, setDetailPosSize] = useState({
    x: 0,
    y: 0,
    width: resizeSizes.width,
    height: resizeSizes.height,
  });
  const [defaultSize, setDefaultSize] = useState({
    width: currentAsset.dimensionWidth,
    height: currentAsset.dimensionHeight,
  });
  const [notes, setNotes] = useState([]);
  const [sizeOfCrop, setSizeOfCrop] = useState({
    width: defaultSize.width,
    height: defaultSize.height,
  });
  const [transcripts, setTranscript] = useState([]);

  const renameValue = useRef("");
  const setRenameValue = (value) => {
    renameValue.current = value;
  };

  // For resize and cropping
  const [downloadImageTypes, setDownloadImageTypes] = useState(
    getDefaultDownloadImageType(currentAsset.extension)
  );
  const [mode, setMode] = useState("detail"); // Available options: resize, crop, detail
  const [imageType, setImageType] = useState(currentAsset.extension);

  const [presetTypes, setPresetTypes] = useState([
    {
      label: "None",
      value: "none",
      width: currentAsset.dimensionWidth,
      height: currentAsset.dimensionHeight,
    },
  ]);
  const [preset, setPreset] = useState<any>(presetTypes[0]);

  const [sizes, setSizes] = useState([
    {
      label: "Original",
      value: "none",
      width: currentAsset.dimensionWidth,
      height: currentAsset.dimensionHeight,
    },
  ]);
  const [size, setSize] = useState<any>(sizes[0]);

  const [width, setWidth] = useState<number>(currentAsset.dimensionWidth);
  const [height, setHeight] = useState<number>(currentAsset.dimensionHeight);
  const [transcriptLoading, setTranscriptLoading] = useState(true);

  const resetValues = () => {
    const width = currentAsset.dimensionWidth;
    const height = currentAsset.dimensionHeight;
    // debugger
    setPreset({
      label: "None",
      value: "none",
      width: width,
      height: height,
    });
    setSize({
      label: "Original",
      value: "none",
      width: width,
      height: height,
    });
    setWidth(width);
    setHeight(height);
    setImageType(currentAsset.extension);
  };

  const getCropResizeOptions = async () => {
    try {
      if (isShare) {
        const { data } = await customFileSizeApi.getSharedSizePresetsByGroup();

        // @ts-ignore
        setPresetTypes(presetTypes.concat(data));
      } else {
        const { data } = await customFileSizeApi.getSizePresetsByGroup();
        if (data) {
          // @ts-ignore
          setPresetTypes(presetTypes.concat(data));
        }
      }
    } catch (e) {}
  };

  const _setActiveCollection = () => {
    // TODO: ? What is purpose of this ?
    if (activeFolder) {
      const folder = folders.find((folder) => folder.id === activeFolder);
      if (folder) {
        setActiveCollection(folder);
        const assetIndx =
          assets.findIndex((item) => item.asset && item.asset.id === asset.id) +
          1;
        setAssetIndex(assetIndx);
      }
    }
  };

  useEffect(() => {
    if (transcriptAccess) {
      getTranscript();
    }

    getCropResizeOptions();
    getDetail();
    checkInitialParams();
    _setActiveCollection();
  }, [currentAsset]);

  useEffect(() => {
    if (currentAsset.id !== asset.id) {
      setCurrentAsset(asset);
    }
  }, [asset]);

  const checkInitialParams = () => {
    if (initialParams?.side) {
      setActiveSidecomponent(initialParams.side);
    }
  };

  const getDetail = async (curAsset?) => {
    try {
      const asset = curAsset || currentAsset;
      if (isShare) {
        setAssetDetail(asset);
      } else {
        const { data } = await assetApi.getById(asset.id);

        if (data.asset.id !== assetDetail?.id) {
          setAssetDetail(data.asset);
          setPreviewUrl(data.previewUrl);
          setVersionRealUrl(data.realUrl);
          setVersionThumbnailUrl(data.thumbailUrl);
        }
      }
    } catch (err) {
      // console.log(err);
    }
  };

    const onChangeRelatedFiles = (fileAssociations) => {
    setAssetDetail({ ...assetDetail, fileAssociations });
  };


  const getTranscript = async (curAsset?) => {
    try {
      setTranscriptLoading(true);
      const asset = curAsset || currentAsset;
      const { data } = await assetApi.getTranscript(asset.id);
      setTranscript(data);
      setTranscriptLoading(false);
    } catch (err) {
      setTranscriptLoading(false);
      // console.log(err);
    }
  };

  const updateAsset = async (inputData) => {
    try {
      // Optimistic data set
      setAssetDetail({
        ...assetDetail,
        ...inputData.updateData,
      });
      const { data } = await assetApi.updateAsset(currentAsset.id, inputData);
      setAssetDetail(data);
    } catch (err) {
      // console.log(err);
    }
  };

  const confirmAssetRename = async (newValue) => {
    try {
      const editedName = `${newValue}.${assetDetail.extension}`;
      await assetApi.updateAsset(currentAsset.id, {
        updateData: { name: editedName },
      });
      const modAssetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === currentAsset.id
      );
      setAssets(
        update(assets, {
          [modAssetIndex]: {
            asset: {
              name: { $set: editedName },
            },
          },
        })
      );
      setAssetDetail(
        update(assetDetail, {
          name: { $set: editedName },
        })
      );
      toastUtils.success("Asset name updated");
    } catch (err) {
      toastUtils.error("Could not update asset name");
    }
  };

  const toggleSideMenu = (value = null) => {
    if (value === null) setSideOpen(!sideOpen);
    else setSideOpen(value);
  };

  const changeActiveSide = (side) => {
    setActiveSidecomponent(side);
    setSideOpen(true);
  };

  // On Crop/Resize select change
  const onSelectChange = (type, value) => {
    if (type === "preset") {
      setPreset(value);
      // Restore values
      if (value.value === "none") {
        // Set width, height as their original size
        setWidth(currentAsset.dimensionWidth);
        setHeight(currentAsset.dimensionHeight);

        // Set default size to none
        setSize({
          label: "Original",
          value: "none",
          width: currentAsset.dimensionWidth,
          height: currentAsset.dimensionHeight,
        });

        // Restore size back to temp size
        setSizes([
          {
            label: "Original",
            value: "none",
            width: currentAsset.dimensionWidth,
            height: currentAsset.dimensionHeight,
          },
        ]);

        if (mode === "crop") {
          setSizeOfCrop({
            width: width,
            height: height,
          });
        } else {
          setDetailPosSize({
            ...detailPosSize,
            width: defaultSize.width,
            height: defaultSize.height,
          });
        }
      } else {
        // Reset size value
        setSize(undefined);

        // Set size list by preset data
        setSizes(value.data);
      }
    }

    if (type === "size") {
      if (mode === "crop") {
        setSizeOfCrop({
          width:
            value.width > detailPosSize.width
              ? detailPosSize.width
              : value.width,
          height:
            value.height > detailPosSize.height
              ? detailPosSize.height
              : value.height,
        });
      } else {
        setWidth(value.width);
        setHeight(value.height);
        // set new rendering size in the <container></container>
        setDetailPosSize({
          ...detailPosSize,
          width:
            value.width > defaultSize.width ? defaultSize.width : value.width,
          height:
            value.height > defaultSize.height
              ? defaultSize.height
              : value.height,
        });
      }
      setSize(value);
    }
  };

  const calculateRenderSize = (newW, newH) => {
    // calculate renderable height width based on provided value(preset size)
    if (defaultSize.height > defaultSize.width) {
      if (newH > defaultSize.height) {
        newH = defaultSize.height;
        newW = defaultSize.width;
      } else {
        newW = Math.round((newH * defaultSize.width) / defaultSize.height);
      }
    } else {
      if (newW > defaultSize.width) {
        newH = defaultSize.height;
        newW = defaultSize.width;
      } else {
        newH = Math.round((newW * defaultSize.height) / defaultSize.width);
      }
    }
    return { newH, newW };
  };

  // On width, height input change
  const onSizeInputChange = (name, value, resizeOption) => {
    const originalRatio =
      currentAsset.dimensionWidth / currentAsset.dimensionHeight;
    let _width = width,
      _height = height;
    if (resizeOption === "%") {
      if (value > 100) {
        value = 100;
      }
      value =
        name === "width"
          ? Math.round((value * asset.dimensionWidth) / 100)
          : Math.round((value * asset.dimensionHeight) / 100);
    }

    if (name === "width") {
      if (value) {
        if (value <= currentAsset.dimensionWidth) {
          _width = value;

          if (mode === "resize") {
            _height = Math.round(value / originalRatio);
          }
        }
      } else {
        _width = value;
      }
    }

    if (name === "height") {
      if (value) {
        if (value <= currentAsset.dimensionHeight) {
          _height = value;

          if (mode === "resize") {
            _width = Math.round(value * originalRatio);
          }
        }
      } else {
        _height = value;
      }
    }

    const { newW, newH } = calculateRenderSize(_width, _height);

    setWidth(_width);
    setHeight(_height);

    const resizeSizes = getResizeSize(newW, newH);

    setDetailPosSize({
      ...detailPosSize,
      width: resizeSizes.width,
      height: resizeSizes.height,
    });
  };

  const lockCropping = () => {
    // Only lock if user is choose specific preset
    return (
      (preset && preset.value !== "none") || (size && size.value !== "none")
    );
  };

  // Subscribe mode change, if user back/enter to detail page, should reset all size value do default
  useEffect(() => {
    if (mode === "detail") {
      // Set default size to none
      setSizes([
        {
          label: "Original",
          value: "none",
          width: currentAsset.dimensionWidth,
          height: currentAsset.dimensionHeight,
        },
      ]);

      setSize({
        label: "Original",
        value: "none",
        width: currentAsset.dimensionWidth,
        height: currentAsset.dimensionHeight,
      });
      setPreset({
        label: "None",
        value: "none",
        width: currentAsset.dimensionWidth,
        height: currentAsset.dimensionHeight,
      });

      setWidth(currentAsset.dimensionWidth);
      setHeight(currentAsset.dimensionHeight);
    }
  }, [mode, currentAsset]);

  // useEffect(() => {
  //   setDetailPosSize(Object.assign({...detailPosSize}, {height, width}));
  // }, [width, height]);

  const downloadSelectedAssets = async (id) => {
    const { shareJWT, code } = urlUtils.getQueryParameters();

    try {
      let payload = {
        assetIds: [id],
      };

      let totalDownloadingAssets = 1;
      let filters = {
        estimateTime: 1,
      };

      // Download files in shared collection or normal download (not share)
      if ((isShare && sharePath && !code) || !isShare) {
        // Add sharePath property if user is at share collection page
        if (sharePath) {
          filters["sharePath"] = sharePath;
        }

        // Show processing bar
        updateDownloadingStatus("zipping", 0, totalDownloadingAssets);

        let api: any = assetApi;

        if (isShare) {
          api = shareApi;
        }

        const { data } = await api.downloadAll(payload, filters);

        // Download file to storage
        fileDownload(data, "assets.zip");

        updateDownloadingStatus("done", 0, 0);
      } else {
        // Download shared single asset
        if (isShare && !sharePath && code) {
          // Show processing bar
          updateDownloadingStatus("zipping", 0, totalDownloadingAssets);

          const { data } = await assetApi.shareDownload(payload, {
            shareJWT,
            code,
          });

          // Download file to storage
          fileDownload(data, "assets.zip");

          updateDownloadingStatus("done", 0, 0);
        }
      }
    } catch (e) {
      updateDownloadingStatus(
        "error",
        0,
        0,
        "Internal Server Error. Please try again."
      );
    }
  };

  const setDisplayVersions = (versionAssets) => {
    const versionCount = versionAssets.length;
    versionAssets = versionAssets.map((asset, indx) => {
      // For architectural reason versions are stored in database in
      // the order 1(current), 2, 3, 4 ( recent to oldest)
      // So need to display in reverse order
      asset.displayVersion = versionCount - indx + 1;
      return asset;
    });
    return versionAssets;
  };

  const updateList = (versionAssets, curAsset) => {
    versionAssets = setDisplayVersions(versionAssets);
    if (currentAsset.id !== curAsset.id) {
      setCurrentAsset(curAsset);
    }

    setVersions(versionAssets);
    setVersionCount(versionAssets.length);
  };

  const loadVersions = async () => {
    try {
      const { data } = await assetApi.getVersions(currentAsset.versionGroup);
      updateList(data.versions, data.currentAsset);

      if (data.currentAsset.id !== currentAsset.id) {
        getDetail(data.currentAsset);
      }
    } catch (err) {
      // console.log(err)
    }
  };

  const loadNotes = async () => {
    try {
      const assetId = currentAsset.id;
      const { data } = await assetApi.getNotes(assetId);
      setNotes(data || []);
    } catch (err) {
      // console.log(err)
    }
  };

  useEffect(() => {
    if ((!needsFetch || needsFetch === "versions") && !isShare) {
      loadVersions();
    }
    if (!needsFetch) {
      loadNotes();
    }
  }, [needsFetch]);

  const revertToCurrent = async (version) => {
    try {
      const { data: newOrderedAssts } = await assetApi.revertVersion({
        revertAssetId: version.id,
        versionGroup: version.versionGroup,
      });
      const curAsset = newOrderedAssts[0];
      const versionAssets = newOrderedAssts.splice(1);

      updateList(versionAssets, curAsset);
      toastUtils.success("Version successfully reverted to current");
    } catch (err) {
      // console.log(err)
    }
  };

  const shouldRenderCdnTabButton = () => {
    const checkValid = (stringsToCheck: string[], paramToCheck: string) => {
      let result = false;

      if (!paramToCheck) return false;

      stringsToCheck.forEach((str) => {
        const isValid = str.toLowerCase() === paramToCheck.toLowerCase();

        if (!result) result = isValid;
      });

      return result;
    };

    const isTypeValid = checkValid(
      ["image", "video", "pdf"],
      assetDetail?.type
    );
    const isExtensionValid = checkValid(
      [
        "png",
        "jpg",
        "gif",
        "tif",
        "tiff",
        "webp",
        "svg",
        "mp4",
        "mov",
        "avi",
        "pdf",
      ],
      assetDetail?.extension
    );
    const isUserValid =
      (user.roleId === "admin" || user.roleId === "super_admin") && cdnAccess;

    return isTypeValid && isExtensionValid && isUserValid;
  };

  const deleteVersion = async (version) => {
    try {
      await assetApi.deleteAsset(version.id);
      let clonedVersions = [...versions];
      clonedVersions = clonedVersions.filter(
        (asset) => asset.id !== version.id
      );
      clonedVersions = setDisplayVersions(clonedVersions);
      setVersions(clonedVersions);
      toastUtils.success("Version deleted successfully.");
    } catch (err) {
      // console.log(err)
    }
  };

  const onUserEvent = (eventName, currentVersion) => {
    if (eventName !== "delete") {
      setVersionRealUrl(currentVersion.realUrl);
      setVersionThumbnailUrl(currentVersion.thumbailUrl);
    }

    switch (eventName) {
      case "delete":
        deleteVersion(currentVersion);
        break;
      case "revert":
        revertToCurrent(currentVersion);
        setChangedVersion(true); // to track version uploaded on overlay close
        getDetail(currentVersion);
        break;
      case "upload":
        setChangedVersion(true); // to track version uploaded on overlay close
        loadVersions();
        break;
    }
  };

  const applyCrud = (action, note) => {
    switch (action) {
      case "add":
        setNotes([...notes, note]);
        break;

      case "edit":
        const _notes = notes.map((_note) => {
          if (_note.id === note.id) {
            _note.text = note.text;
          }
          return _note;
        });
        setNotes(_notes);
        break;

      case "delete":
        const restNotes = notes.filter((_note) => _note.id !== note.id);
        setNotes(restNotes);
        break;
    }
  };

  const navigateOverlay = (navBy) => {
    const currentIndx = assets.findIndex(
      (item) => asset && item.asset && item.asset.id === asset.id
    );
    const newIndx = currentIndx + navBy;
    setAssetIndex(newIndx);
    if (assets[newIndx]) {
      closeOverlay();
      setDetailOverlayId(assets[newIndx].asset.id);
      if (newIndx === assets.length - 1) {
        loadMore();
      }
    }
  };

  const _closeOverlay = () => {
    setOperationAssets([]);
    closeOverlay(changedVersion ? currentAsset : undefined);
    setDetailOverlayId(undefined);
  };

  const resetImageSettings = (newWidth, newHeight) => {
    const img = document.querySelector(
      ".app-overlay img.img-preview"
    ) as HTMLImageElement;
    // const draggable = document.querySelector('.app-overlay .react-draggable') as HTMLDivElement;
    // var positions = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
    // const pos = parseInt(positions[0]);
    const cWidth = newWidth || img.width;
    const cHeight = newHeight || img.height;
    let nw = img.naturalWidth;
    let nh = img.naturalHeight;
    var oRatio = nw / nh,
      cRatio = cWidth / cHeight;

    let width, height;
    if (oRatio > cRatio) {
      width = cWidth;
      height = cWidth / oRatio;
    } else {
      width = cHeight * oRatio;
      height = cHeight;
    }

    width =
      width > currentAsset.dimensionWidth
        ? currentAsset.dimensionWidth
        : Math.round(width);
    height =
      height > currentAsset.dimensionHeight
        ? currentAsset.dimensionHeight
        : Math.round(height);

    setDetailPosSize(Object.assign({ ...detailPosSize }, { height, width }));
    if (!newWidth && !newHeight) {
      setDefaultSize({ height, width });
    }
  };

  const onResizeStop = (w, h, position = {}) => {
    w = parseInt(w);
    h = parseInt(h);
    const resizeSizes = getResizeSize(w, h);
    setDetailPosSize(
      Object.assign(
        { ...detailPosSize },
        {
          width: resizeSizes.width,
          height: resizeSizes.height,
          ...position,
        }
      )
    );

    setWidth(w);
    setHeight(h);
  };

  const editThenDownload =
    currentAsset.extension !== "gif" &&
    currentAsset.extension !== "tiff" &&
    currentAsset.extension !== "tif" &&
    currentAsset.extension !== "svg" &&
    currentAsset.extension !== "svg+xml" &&
    currentAsset.type === "image" &&
    isImageType(assetDetail?.extension);

  const seekVideo = (secs) => {
    let myVideo = document.getElementById("video-element");
    if (myVideo) {
      // @ts-ignore
      if (myVideo.fastSeek) {
        // @ts-ignore
        myVideo.fastSeek(secs);
        // @ts-ignore
        myVideo.play();
      } else {
        // @ts-ignore
        myVideo.currentTime = secs;
        // @ts-ignore
        myVideo.play();
      }
    }
  };

  return (
    <div
      className={`app-overlay ${styles.container} ${
        isShare ? styles.share : ""
      }`}
    >
      {assetDetail && (
        <section id={"detail-overlay"} className={styles.content}>
          <div className={styles["top-wrapper"]}>
            <div className={styles["back-name"]}>
              <div className={styles.back} onClick={_closeOverlay}>
                <IconClickable src={Utilities.backWhite} />
                <span>Back</span>
              </div>
              <div>
                <div className={styles.name}>
                  <h3>{assetDetail.name}</h3>
                  {!isShare && (
                    <IconClickable
                      src={Utilities.editLight}
                      onClick={() => setRenameModalOpen(true)}
                    />
                  )}
                </div>
                {!isShare && (
                  <div className={styles["versions-related-wrapper"]}>
                    {hasPermission(["admin", "super_admin"]) &&
                      versionCount > 0 && (
                        <div
                          className={styles["versions-number"]}
                          onClick={() => {
                            setMode("detail");
                            resetValues();
                            changeActiveSide("versions");
                          }}
                        >
                          {versionCount + 1} versions
                        </div>
                      )}
                    {assetDetail?.fileAssociations?.length > 0 && (
                      <>
                        <img src={Utilities.ellipse} />
                        <div
                          className={styles["related-number"]}
                          onClick={() => {
                            setMode("detail");
                            resetValues();
                            changeActiveSide("related");
                          }}
                        >
                          {assetDetail?.fileAssociations?.length} Related files
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={styles["asset-actions"]}>
              {hasPermission(["admin", "super_admin"]) && (
                <div className={styles["only-desktop-button"]}>
                  <AssetAddition
                    folderAdd={false}
                    versionGroup={assetDetail.versionGroup}
                    triggerUploadComplete={onUserEvent}
                  />
                </div>
              )}
              {!isShare && (
                <>
                  <Button
                    text={"Share"}
                    type={"button"}
                    className={`container ${styles["only-desktop-button"]} primary`}
                    onClick={openShareAsset}
                  />

                  <div className={styles["only-mobile-button"]}>
                    <IconClickable
                      additionalClass={styles["only-mobile-button"]}
                      src={AssetOps.shareWhite}
                      onClick={openShareAsset}
                    />
                  </div>
                </>
              )}
              {mode === "detail" &&
                (isShare || hasPermission([ASSET_DOWNLOAD])) && (
                  <>
                    <Button
                      text={"Download"}
                      type={"button"}
                      className={`container ${styles["only-desktop-button"]} secondary`}
                      onClick={() => {
                        if (editThenDownload) {
                          setDownloadDropdownOpen(true);
                        } else {
                          downloadSelectedAssets(currentAsset.id);
                        }
                      }}
                    />
                    <div className={styles["only-mobile-button"]}>
                      <IconClickable
                        className={styles["only-mobile-button"]}
                        src={AssetOps.downloadWhite}
                        onClick={() => setDownloadDropdownOpen(true)}
                      />
                    </div>

                    {downloadDropdownOpen && (
                      <div className={styles["download-list-dropdown"]}>
                        <Dropdown
                          onClickOutside={() => setDownloadDropdownOpen(false)}
                          additionalClass={styles["more-dropdown"]}
                          options={[
                            {
                              id: "download",
                              label: "Download Original",
                              onClick: () =>
                                downloadSelectedAssets(currentAsset.id),
                            },
                            {
                              id: "edit",
                              label: "Edit then Download",
                              onClick: () => {
                                changeActiveSide("download");
                                setMode("resize");
                              },
                            },
                          ]}
                        />
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
          <div
            className={`${
              !isShare ? styles["img-wrapper"] : styles["share-img-wrapper"]
            }${activeFolder && ` ${styles["active-folderimg"]}`}`}
          >
            <div className={styles["notes-wrapper"]}>
              {notes.map(
                (note, indx) =>
                  ((isShare && !note.internal) || !isShare) && (
                    <AssetNote
                      key={indx.toString()}
                      title={`Note ${indx + 1}`}
                      note={note.text}
                    />
                  )
              )}
            </div>
            {assetDetail.type === "image" && (
              <>
                {mode === "detail" && (
                  <AssetImg
                    imgClass="img-preview"
                    name={assetDetail.name}
                    assetImg={
                      assetDetail.extension === "tiff" ||
                      assetDetail.extension === "tif" ||
                      assetDetail.extension === "svg" ||
                      assetDetail.extension === "svg+xml" ||
                      assetDetail.extension === "heif" ||
                      assetDetail.extension === "heic" ||
                      assetDetail.extension === "cr2"
                        ? versionThumbnailUrl
                        : versionRealUrl
                    }
                  />
                )}

                {mode === "resize" && (
                  <Rnd
                    position={{ x: detailPosSize.x, y: detailPosSize.y }}
                    size={{
                      width: detailPosSize.width,
                      height: detailPosSize.height,
                    }}
                    className={`${styles["react-draggable"]}`}
                    lockAspectRatio={true}
                    onResizeStop={(e, direction, ref, delta, position) =>
                      onResizeStop(ref.style.width, ref.style.height, position)
                    }
                  >
                    <AssetImg
                      name={assetDetail.name}
                      assetImg={versionRealUrl}
                      imgClass="img-preview"
                      isResize
                    />
                  </Rnd>
                )}

                {mode === "crop" && (
                  <AssetCropImg
                    imageType={imageType}
                    assetExtension={assetDetail.extension}
                    setWidth={setWidth}
                    setHeight={setHeight}
                    locked={lockCropping()}
                    name={assetDetail.name}
                    assetImg={realUrl}
                    width={width}
                    height={height}
                    sizeOfCrop={sizeOfCrop}
                    setSizeOfCrop={setSizeOfCrop}
                    detailPosSize={detailPosSize}
                    associateFileId={currentAsset.id}
                    onAddAssociate={(asset) => {
                      const detail = { ...assetDetail };
                      detail.fileAssociations.push(asset);

                      setAssetDetail(detail);
                    }}
                    renameValue={renameValue}
                  />
                )}
              </>
            )}
            {assetDetail.type !== "image" &&
              assetDetail.type !== "video" &&
              versionThumbnailUrl &&
              (assetDetail.extension.toLowerCase() === "pdf" ? (
                <AssetPdf asset={asset} />
              ) : (
                <AssetImg
                  name={assetDetail.name}
                  assetImg={versionThumbnailUrl}
                  imgClass="img-preview"
                />
              ))}
            {assetDetail.type !== "image" &&
              assetDetail.type !== "video" &&
              !versionThumbnailUrl && (
                <AssetIcon extension={currentAsset.extension} />
              )}
            {assetDetail.type === "video" && (
              <video controls id={"video-element"}>
                <source
                  src={previewUrl ?? versionRealUrl}
                  type={
                    previewUrl ? "video/mp4" : `video/${assetDetail.extension}`
                  }
                />
                Sorry, your browser doesn't support video playback.
              </video>
            )}
            {activeFolder && (
              <div className={styles.arrows}>
                <div>
                  {assets.length &&
                    assets[0].asset &&
                    assets[0].asset.id !== asset.id && (
                      <span className={styles["arrow-prev"]}>
                        <IconClickable
                          src={Utilities.arrowPrev}
                          onClick={() => navigateOverlay(-1)}
                        />
                      </span>
                    )}
                  {availableNext && (
                    <span className={styles["arrow-next"]}>
                      <IconClickable
                        src={Utilities.arrowNext}
                        onClick={() => navigateOverlay(1)}
                      />
                    </span>
                  )}
                </div>
                <span>
                  {(assetIndex % activeCollection?.assetsCount) + 1} of{" "}
                  {activeCollection?.assetsCount} in {activeCollection?.name}{" "}
                  collection
                </span>
              </div>
            )}
          </div>
        </section>
      )}
      {sideOpen && (
        <section className={styles.side}>
          {assetDetail && activeSideComponent === "detail" && (
            <>
              {mode === "detail" && (
                <SidePanel
                  asset={assetDetail}
                  updateAsset={updateAsset}
                  setAssetDetail={setAssetDetail}
                  isShare={isShare}
                />
              )}
            </>
          )}
          {activeSideComponent === "download" && (
            <CropSidePanel
              isShare={isShare}
              sharePath={sharePath}
              imageType={imageType}
              onImageTypeChange={(type) => {
                setImageType(type);
              }}
              downloadImageTypes={downloadImageTypes}
              presetTypes={presetTypes}
              presetTypeValue={preset}
              sizes={sizes}
              sizeValue={size}
              mode={mode}
              widthOriginal={width}
              heightOriginal={height}
              onModeChange={(mode) => {
                setMode(mode);
                if (mode === "crop") {
                  setSizeOfCrop({
                    width: Math.round(width / 2),
                    height: Math.round(height / 2),
                  });
                }
              }}
              onSelectChange={onSelectChange}
              onSizeInputChange={onSizeInputChange}
              asset={assetDetail}
              onResetImageSize={() => {
                resetValues();
                setDetailPosSize({
                  ...detailPosSize,
                  width: defaultSize.width,
                  height: defaultSize.height,
                });
              }}
              sizeOfCrop={sizeOfCrop}
              setSizeOfCrop={setSizeOfCrop}
              detailPosSize={detailPosSize}
              onAddAssociate={(asset) => {
                const detail = { ...assetDetail };
                detail.fileAssociations.push(asset);

                setAssetDetail(detail);
              }}
              setRenameData={setRenameValue}
            />
          )}
          {!isShare && activeSideComponent === "comments" && (
            <ConversationList itemId={asset?.id} itemType="assets" />
          )}
          {!isShare && activeSideComponent === "versions" && (
            <VersionList
              versions={versions}
              currentAsset={currentAsset}
              triggerUserEvent={onUserEvent}
            />
          )}
          {activeSideComponent === "cdn" && (
            <CdnPanel assetDetail={assetDetail} />
          )}

          {activeSideComponent === "notes" && notes && (
            <AssetNotes asset={asset} notes={notes} applyCrud={applyCrud} />
          )}

          {activeSideComponent === "related" && (
            <AssetRelatedFilesList
              currentAsset={assetDetail}
              relatedAssets={assetDetail?.fileAssociations || []}
              associateFileId={currentAsset.id}
              onChangeRelatedFiles={onChangeRelatedFiles}
              onAddRelatedFiles={(data) => {
                let updatedAssets = [...assetDetail.fileAssociations];
                updatedAssets = updatedAssets.concat(data);
                setAssetDetail({
                  ...assetDetail,
                  fileAssociations: updatedAssets,
                });
              }}
            />
          )}
          {activeSideComponent === "transcript" && transcripts && (
            <AssetTranscript
              title={"Transcript"}
              transcripts={transcripts}
              loading={transcriptLoading}
              navigateToTime={seekVideo}
            />
          )}
        </section>
      )}
      {/* Share page mobile right button */}
      {isShare && (
        <div className={styles["share-right-button"]}>
          {" "}
          <IconClickable
            src={Utilities.closePanelLight}
            onClick={() => toggleSideMenu()}
            additionalClass={`${styles["menu-icon"]} ${!sideOpen && "mirror"}`}
          />{" "}
          <IconClickable
            src={isMobile ? Utilities.infoGray : Utilities.info}
            additionalClass={styles["menu-icon"]}
            onClick={() => {
              setMode("detail");
              resetValues();
              changeActiveSide("detail");
            }}
          />
        </div>
      )}

      {!isShare && (
        <section className={styles.menu}>
          <IconClickable
            src={Utilities.closePanelLight}
            onClick={() => toggleSideMenu()}
            additionalClass={`${styles["menu-icon"]} ${!sideOpen && "mirror"} ${
              styles.expand
            }`}
          />
          {!isShare && (
            <>
              <div className={`${styles.separator} ${styles.expand}`}></div>
              <IconClickable
                src={Utilities.delete}
                additionalClass={
                  styles["menu-icon"] + " " + styles["only-desktop-button"]
                }
                onClick={openDeleteAsset}
              />
            </>
          )}
          <div
            className={styles.separator + " " + styles["only-desktop-button"]}
          ></div>
          <IconClickable
            src={isMobile ? Utilities.infoGray : Utilities.info}
            additionalClass={styles["menu-icon"]}
            onClick={() => {
              setMode("detail");
              resetValues();
              changeActiveSide("detail");
            }}
          />
          {!isShare && (
            <>
              <IconClickable
                src={Utilities.tagGray}
                additionalClass={
                  styles["menu-icon"] + " " + styles["only-mobile-button"]
                }
                onClick={() => {}}
              />
              <IconClickable
                src={isMobile ? Utilities.commentLight : Utilities.comment}
                additionalClass={styles["menu-icon"]}
                onClick={() => {
                  setMode("detail");
                  resetValues();
                  changeActiveSide("comments");
                }}
              />
              {hasPermission(["admin", "super_admin"]) && (
                <div className={styles["only-mobile-button"]}>
                  <AssetAddition
                    folderAdd={false}
                    // versionGroup={assetDetail.versionGroup}
                    triggerUploadComplete={onUserEvent}
                  />
                </div>
              )}
              {shouldRenderCdnTabButton() && (
                <IconClickable
                  // src={Utilities.embedCdn}
                  src={isMobile ? Utilities.embedCdnGrey : Utilities.embedCdn}
                  additionalClass={
                    styles["menu-icon"] + " " + styles["cdn-icon"]
                  }
                  onClick={() => {
                    setMode("detail");
                    resetValues();
                    changeActiveSide("cdn");
                  }}
                />
              )}

              {editThenDownload && hasPermission([ASSET_DOWNLOAD]) && (
                <IconClickable
                  src={AssetOps.download}
                  additionalClass={
                    styles["menu-icon"] + " " + styles["only-desktop-button"]
                  }
                  onClick={() => {
                    if (
                      currentAsset.type === "image" &&
                      isImageType(currentAsset.extension)
                    ) {
                      if (mode !== "resize" && mode !== "crop") {
                        setMode("resize");
                      }
                      changeActiveSide("download");
                      resetImageSettings(undefined, undefined);
                    } else {
                      downloadSelectedAssets(currentAsset.id);
                    }
                  }}
                />
              )}

              <IconClickable
                src={isMobile ? Utilities.relatedLight : Utilities.related}
                additionalClass={styles["menu-icon"]}
                onClick={() => {
                  setMode("detail");
                  resetValues();
                  changeActiveSide("related");
                }}
              />
              {hasPermission(["admin", "super_admin"]) && (
                <IconClickable
                  src={isMobile ? Utilities.notesLight : Utilities.notes}
                  additionalClass={styles["menu-icon"]}
                  onClick={() => {
                    setMode("detail");
                    resetValues();
                    changeActiveSide("notes");
                  }}
                />
              )}

              {hasPermission(["admin", "super_admin"]) && versionCount > 0 && (
                <IconClickable
                  src={isMobile ? Utilities.versionsLight : Utilities.versions}
                  additionalClass={styles["menu-icon"]}
                  onClick={() => {
                    setMode("detail");
                    resetValues();
                    changeActiveSide("versions");
                  }}
                />
              )}
            </>
          )}
          {transcriptAccess && assetDetail?.type === "video" && (
            <IconClickable
              src={Utilities.transcript}
              additionalClass={styles[""]}
              onClick={() => {
                setMode("detail");
                resetValues();
                changeActiveSide("transcript");
              }}
            />
          )}
        </section>
      )}
      <RenameModal
        closeModal={() => setRenameModalOpen(false)}
        modalIsOpen={renameModalOpen}
        renameConfirm={confirmAssetRename}
        type={"Asset"}
        initialValue={assetDetail?.name?.substring(
          0,
          assetDetail?.name.lastIndexOf(".")
        )}
      />
    </div>
  );
};

export default DetailOverlay;
