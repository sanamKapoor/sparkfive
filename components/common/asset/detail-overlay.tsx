import styles from "./detail-overlay.module.css";
import { Utilities, AssetOps } from "../../../assets";
import { saveAs } from "file-saver";
import { useState, useEffect, useContext } from "react";
import assetApi from "../../../server-api/asset";
import shareApi from "../../../server-api/share-collection";
import customFileSizeApi from "../../../server-api/size";
import { AssetContext, UserContext } from "../../../context";
import toastUtils from "../../../utils/toast";
import update from "immutability-helper";
import downloadUtils from "../../../utils/download";
import VersionList from "./version-list";
import AssetAddition from "./asset-addition";

import { isMobile } from "react-device-detect";

// Components
import SidePanel from "./detail-side-panel";
import ConversationList from "../conversation/conversation-list";
import IconClickable from "../buttons/icon-clickable";
import Button from "../buttons/button";
import AssetImg from "./asset-img";
import AssetApplication from "./asset-application";
import AssetText from "./asset-text";
import RenameModal from "../modals/rename-modal";
import CropSidePanel from "./crop-side-panel";
import AssetCropImg from "./asset-crop-img";
import fileDownload from "js-file-download";
import AssetIcon from "./asset-icon";
import CdnPanel from "./cdn-panel";

import { isImageType } from "../../../utils/file";

import { ASSET_ACCESS } from "../../../constants/permissions";
import AssetNotes from './asset-notes';
import AssetNote from './asset-note';

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

  let foundExtension = extension;
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

const DetailOverlay = ({
  asset,
  realUrl,
  thumbailUrl,
  closeOverlay,
  openShareAsset = () => { },
  openDeleteAsset = () => { },
  isShare = false,
  sharePath = "",
  initialParams,
}) => {
  const { hasPermission } = useContext(UserContext);
  const { user, cdnAccess } = useContext(UserContext);

  const [assetDetail, setAssetDetail] = useState(undefined);

  const [renameModalOpen, setRenameModalOpen] = useState(false);

  const [activeSideComponent, setActiveSidecomponent] = useState("detail");

  const { assets, setAssets, needsFetch, updateDownloadingStatus } =
    useContext(AssetContext);

  const [sideOpen, setSideOpen] = useState(true);

  const [versionCount, setVersionCount] = useState(0);
  const [versions, setVersions] = useState([]);
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [changedVersion, setChangedVersion] = useState(false); // to track version uploaded on overlay close
  const [versionRealUrl, setVersionRealUrl] = useState(realUrl);
  const [versionThumbnailUrl, setVersionThumbnailUrl] = useState(thumbailUrl);

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

  const resetValues = () => {
    setPreset({
      label: "None",
      value: "none",
      width: currentAsset.dimensionWidth,
      height: currentAsset.dimensionHeight,
    });
    setSize({
      label: "Original",
      value: "none",
      width: currentAsset.dimensionWidth,
      height: currentAsset.dimensionHeight,
    });
    setWidth(currentAsset.dimensionWidth);
    setHeight(currentAsset.dimensionHeight);
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

        // @ts-ignore
        setPresetTypes(presetTypes.concat(data));
      }
    } catch (e) { }
  };

  useEffect(() => {
    getCropResizeOptions();
    getDetail();
    checkInitialParams();
    if (isMobile) {
      toggleSideMenu();
    }
  }, []);

  // useEffect(() => {
  //   const modAssetIndex = assets.findIndex(assetItem => assetItem.asset.id === assetDetail?.id)
  //   if (modAssetIndex !== -1)
  //     setAssetDetail(assets[modAssetIndex].asset)
  // }, [assets])

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
        setAssetDetail(data.asset);

        setVersionRealUrl(data.realUrl);
        setVersionThumbnailUrl(data.thumbailUrl);
      }
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      } else {
        // Reset size value
        setSize(undefined);

        // Set size list by preset data
        setSizes(value.data);
      }
    }

    if (type === "size") {
      setWidth(value.width);
      setHeight(value.height);

      setSize(value);
    }
  };

  // On width, height input change
  const onSizeInputChange = (name, value) => {
    const originalRatio =
      currentAsset.dimensionWidth / currentAsset.dimensionHeight;

    if (name === "width") {
      if (value) {
        if (value <= currentAsset.dimensionWidth) {
          setWidth(value);

          if (mode === "resize") {
            setHeight(Math.round(value / originalRatio));
          }
        }
      } else {
        setWidth(value);
      }
    }

    if (name === "height") {
      if (value) {
        if (value <= currentAsset.dimensionHeight) {
          setHeight(value);

          if (mode === "resize") {
            setWidth(Math.round(value * originalRatio));
          }
        }
      } else {
        setHeight(value);
      }
    }
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
      // setPresetTypes([{ label: 'None', value: 'none', width: currentAsset.dimensionWidth, height: currentAsset.dimensionHeight}])

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

  const downloadSelectedAssets = async (id) => {
    try {
      let payload = {
        assetIds: [id],
      };

      let totalDownloadingAssets = 1;
      let filters = {
        estimateTime: 1,
      };

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
    } catch (e) {
      updateDownloadingStatus(
        "error",
        0,
        0,
        "Internal Server Error. Please try again."
      );
    }

    // downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
  };

  const manualDownloadAsset = (asset) => {
    downloadUtils.downloadFile(versionRealUrl, asset.name);
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
    setCurrentAsset(curAsset);
    setVersions(versionAssets);
    setVersionCount(versionAssets.length);
  };

  const loadVersions = async () => {
    const { data } = await assetApi.getVersions(currentAsset.versionGroup);
    updateList(data.versions, data.currentAsset);
    getDetail(data.currentAsset);
  };

  useEffect(() => {
    if ((!needsFetch || needsFetch === "versions") && !isShare) {
      loadVersions();
    }
  }, [needsFetch]);

  const revertToCurrent = async (version) => {
    const { data: newOrderedAssts } = await assetApi.revertVersion({
      revertAssetId: version.id,
      versionGroup: version.versionGroup,
    });
    const curAsset = newOrderedAssts[0];
    const versionAssets = newOrderedAssts.splice(1);

    updateList(versionAssets, curAsset);
    toastUtils.success("Version successfully reverted to current");
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

    const isTypeValid = checkValid(["image", "video"], assetDetail?.type);
    const isExtensionValid = checkValid(
      ["png", "jpg", "gif", "tif", "tiff", "webp", "svg", "mp4", "mov", "avi"],
      assetDetail?.extension
    );
    const isUserValid =
      (user.roleId === "admin" || user.roleId === "super_admin") && cdnAccess;

    return isTypeValid && isExtensionValid && isUserValid;
  };

  const deleteVersion = async (version) => {
    await assetApi.deleteAsset(version.id);
    let clonedVersions = [...versions];
    clonedVersions = clonedVersions.filter((asset) => asset.id !== version.id);
    clonedVersions = setDisplayVersions(clonedVersions);
    setVersions(clonedVersions);
    toastUtils.success("Version deleted successfully.");
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

  return (
    <div className={`app-overlay ${styles.container}`}>
      {assetDetail && (
        <section id={"detail-overlay"} className={styles.content}>
          <div className={styles["top-wrapper"]}>
            <div
              className={styles.back}
              onClick={() =>
                closeOverlay(changedVersion ? currentAsset : undefined)
              }
            >
              <IconClickable src={Utilities.back} />
              <span>Back</span>
            </div>
            <div className={styles.name}>
              <h3>{assetDetail.name}</h3>
              {!isShare && (
                <IconClickable
                  src={Utilities.edit}
                  onClick={() => setRenameModalOpen(true)}
                />
              )}

              {hasPermission(['admin', 'super_admin']) && versionCount > 0 && (
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
            </div>
            <div className={styles["asset-actions"]}>
              {hasPermission(['admin', 'super_admin']) && (
                <div className={styles["add-version-override"]}>
                  <AssetAddition
                    folderAdd={false}
                    versionGroup={assetDetail.versionGroup}
                    triggerUploadComplete={onUserEvent}
                  />
                </div>
              )}
              {!isShare && (
                <Button
                  text={"Share"}
                  type={"button"}
                  styleType={"primary"}
                  onClick={openShareAsset}
                />
              )}
              {mode === "detail" && (
                <Button
                  text={"Download"}
                  type={"button"}
                  className={styles["only-desktop-button"]}
                  styleType={"secondary"}
                  onClick={() => {
                    if (
                      currentAsset.type === "image" &&
                      isImageType(assetDetail.extension)
                    ) {
                      setMode("resize");
                      changeActiveSide("detail");
                    } else {
                      // downloadSelectedAssets(currentAsset.id)
                      manualDownloadAsset(currentAsset);
                    }
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles["img-wrapper"]}>
            <div className={styles["notes-wrapper"]}>
              <AssetNote
                title="Note 1"
                note="A simple text to give an example of a how note would look after they have been saved."
              />
              <AssetNote
                title="Note 2"
                note="A simple text to give an example of a how note would look after they have been saved."
              />
            </div>
            {assetDetail.type === "image" && (
              <>
                {(mode === "detail" || mode === "resize") && (
                  <AssetImg name={assetDetail.name} assetImg={versionRealUrl} />
                )}
                {mode === "crop" && (
                  <AssetCropImg
                    imageType={imageType}
                    setWidth={setWidth}
                    setHeight={setHeight}
                    locked={lockCropping()}
                    name={assetDetail.name}
                    assetImg={realUrl}
                    width={width}
                    height={height}
                    originalHeight={currentAsset.dimensionHeight}
                  />
                )}
              </>
            )}
            {assetDetail.type !== "image" &&
              assetDetail.type !== "video" &&
              versionThumbnailUrl && (
                <AssetImg
                  name={assetDetail.name}
                  assetImg={versionThumbnailUrl}
                />
              )}
            {assetDetail.type !== "image" &&
              assetDetail.type !== "video" &&
              !versionThumbnailUrl && (
                <AssetIcon extension={currentAsset.extension} />
              )}
            {assetDetail.type === "video" && (
              <video controls>
                <source
                  src={versionRealUrl}
                  type={`video/${assetDetail.extension}`}
                />
                Sorry, your browser doesn't support video playback.
              </video>
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
              {mode !== "detail" && (
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
                  width={width}
                  height={height}
                  onModeChange={(mode) => {
                    resetValues();
                    setMode(mode);
                  }}
                  onSelectChange={onSelectChange}
                  onSizeInputChange={onSizeInputChange}
                  asset={assetDetail}
                />
              )}
            </>
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

          {activeSideComponent === "notes" && (
            <AssetNotes />
          )}

        </section>
      )}
      {!isShare && (
        <section className={styles.menu}>
          <IconClickable
            src={Utilities.closePanelLight}
            onClick={() => toggleSideMenu()}
            additionalClass={`${styles["menu-icon"]} ${!sideOpen && "mirror"} ${styles.expand
              }`}
          />
          <div className={`${styles.separator} ${styles.expand}`}></div>
          <IconClickable
            src={Utilities.delete}
            additionalClass={styles["menu-icon"]}
            onClick={openDeleteAsset}
          />
          <div className={styles.separator}></div>
          <IconClickable
            src={Utilities.info}
            additionalClass={styles["menu-icon"]}
            onClick={() => {
              setMode("detail");
              resetValues();
              changeActiveSide("detail");
            }}
          />
          <IconClickable
            src={Utilities.comment}
            additionalClass={styles["menu-icon"]}
            onClick={() => {
              setMode("detail");
              resetValues();
              changeActiveSide("comments");
            }}
          />
          {shouldRenderCdnTabButton() && (
            <IconClickable
              src={Utilities.embedCdn}
              additionalClass={styles["menu-icon"]}
              onClick={() => {
                setMode("detail");
                resetValues();
                changeActiveSide("cdn");
              }}
            />
          )}
          {hasPermission(['admin', 'super_admin']) && versionCount > 0 && (
            <IconClickable
              src={Utilities.versions}
              additionalClass={styles["menu-icon"]}
              onClick={() => {
                setMode("detail");
                resetValues();
                changeActiveSide("versions");
              }}
            />
          )}
          <IconClickable
            src={AssetOps.download}
            additionalClass={styles["menu-icon"]}
            onClick={() => {
              if (
                currentAsset.type === "image" &&
                isImageType(currentAsset.extension)
              ) {
                if (mode !== "resize" && mode !== "crop") {
                  setMode("resize");
                }
                changeActiveSide("detail");
              } else {
                downloadSelectedAssets(currentAsset.id);
              }
            }}
          />
          {hasPermission(['admin', 'super_admin']) && versionCount > 0 && (
            <IconClickable
              src={Utilities.notes}
              additionalClass={styles["menu-icon"]}
              onClick={() => {
                setMode("detail");
                resetValues();
                changeActiveSide("notes");
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
