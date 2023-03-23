import styles from "./asset-thumbail.module.css";
import gridStyles from "./asset-grid.module.css";
import { Utilities, Assets } from "../../../assets";
import { format } from "date-fns";
import {
  useState,
  useEffect,
  useContext,
  FocusEventHandler,
  ChangeEvent,
} from "react";

// Components
import AssetImg from "./asset-img";
import AssetIcon from "./asset-icon";
import AssetVideo from "./asset-video";
import AssetApplication from "./asset-application";
import AssetText from "./asset-text";
import IconClickable from "../buttons/icon-clickable";
import Button from "../buttons/button";
import DetailOverlay from "./detail-overlay";
import AssetOptions from "./asset-options";
import { AssetContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import { removeExtension } from "../../../utils/asset";
import toastUtils from "../../../utils/toast";
import {
  FAILED_TO_UPDATE_ASSET_NAME,
  ASSET_NAME_UPDATED,
} from "../../../constants/messages";

const DEFAULT_DETAIL_PROPS = { visible: false, side: "detail" };

const AssetThumbail = ({
  isShare,
  sharePath,
  type,
  asset,
  thumbailUrl,
  realUrl,
  isUploading,
  showAssetOption = true,
  showViewButtonOnly = false,
  showSelectedAsset = false,
  showAssetRelatedOption = false,
  isSelected = false,
  isLoading = false,
  activeFolder = "",
  toggleSelected = () => {},
  openDeleteAsset = () => {},
  openMoveAsset = () => {},
  openCopyAsset = () => {},
  openShareAsset = () => {},
  openArchiveAsset = () => {},
  downloadAsset = () => {},
  openRemoveAsset = () => {},
  loadMore = () => {},
  handleVersionChange,
  onView = null,
  customComponent = <></>,
  infoWrapperClass = "",
  textWrapperClass = "",
  customIconComponent = <></>,
  onDisassociate = () => { },
  detailOverlay = true,
  onCloseDetailOverlay = (asset) => {},
  isThumbnailNameEditable = false,
  focusedItem,
  setFocusedItem,
}) => {
  const [overlayProperties, setOverlayProperties] =
    useState(DEFAULT_DETAIL_PROPS);
  const { detailOverlayId, assets, setAssets } = useContext(AssetContext);

  const assetName = removeExtension(asset.name);

  const [thumbnailName, setThumbnailName] = useState(assetName);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setThumbnailName(assetName);
  }, [assetName]);

  useEffect(() => {
    if (overlayProperties.visible) {
      document.body.classList.add("no-overflow");
    } else {
      document.body.classList.remove("no-overflow");
    }
    return () => document.body.classList.remove("no-overflow");
  }, [overlayProperties.visible]);

  useEffect(() => {
    if (asset && detailOverlayId && detailOverlayId === asset.id) {
      setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: true });
    }
  }, [detailOverlayId]);

  const openComments = () => {
    setOverlayProperties({ visible: true, side: "comments" });
  };

  const onCloseOverlay = (changedVersion, outsideDetailOverlayAsset) => {
    if (outsideDetailOverlayAsset) {
      setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: false });
      onCloseDetailOverlay(outsideDetailOverlayAsset);
    } else {
      if (changedVersion) {
        handleVersionChange(changedVersion);
      }
      setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: false });
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThumbnailName(e.target.value);
  };

  const updateNameOnBlur = async (e) => {
    setIsEditing(false);
    setFocusedItem(null);

    if (thumbnailName && assetName !== thumbnailName) {
      try {
        const fileName = thumbnailName + "." + asset.extension;
        const data = await assetApi.updateAsset(asset.id, {
          updateData: { name: fileName },
          associations: {},
        });

        if (data && removeExtension(data?.data?.name) !== assetName) {
          const updatedAssets = [
            ...assets.map((item) => {
              if (item.asset.id === data?.data?.id) {
                return {
                  ...item,
                  asset: {
                    ...item.asset,
                    name: fileName,
                  },
                };
              } else {
                return item;
              }
            }),
          ];
          setAssets(updatedAssets);
        }
        toastUtils.success(ASSET_NAME_UPDATED);
      } catch (e) {
        toastUtils.error(FAILED_TO_UPDATE_ASSET_NAME);
      }
    } else {
      setThumbnailName(assetName);
    }
  };

  const handleOnFocus = () => {
    setIsEditing(true);
  };

  return (
    <>
      <div className={`${styles.container} ${isLoading && "loadable"}`}>
        <div className={styles["image-wrapper"]}>
          {isUploading && (
            <>
              <p className={styles.uploading}>Uploading...</p>
            </>
          )}
          {thumbailUrl ? (
            <AssetImg
              assetImg={thumbailUrl}
              type={asset.type}
              name={asset.name}
              opaque={isUploading}
            />
          ) : (
            <AssetIcon extension={asset.extension} />
          )}
          {/* {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} opaque={isUploading} />}
          {asset.type === 'video' && <AssetVideo assetImg={thumbailUrl} asset={asset} realUrl={realUrl} additionalClass={styles['video-wrapper']} />}
          {asset.type === 'application' && <AssetApplication assetImg={thumbailUrl} extension={asset.extension} />}
          {asset.type === 'text' && <AssetText assetImg={thumbailUrl} extension={asset.extension} />} */}
          {!isUploading &&
            !isLoading &&
            (showAssetOption || showViewButtonOnly) && (
              <>
                {(!showViewButtonOnly ||
                  (showViewButtonOnly && showSelectedAsset)) && (
                  <div
                    className={`${styles["selectable-wrapper"]} ${
                      isSelected && styles["selected-wrapper"]
                    }`}
                  >
                    {isSelected ? (
                      <IconClickable
                        src={Utilities.radioButtonEnabled}
                        additionalClass={styles["select-icon"]}
                        onClick={toggleSelected}
                      />
                    ) : (
                      <IconClickable
                        src={Utilities.radioButtonNormal}
                        additionalClass={styles["select-icon"]}
                        onClick={toggleSelected}
                      />
                    )}
                  </div>
                )}
                <div className={styles["image-button-wrapper"]}>
                  <Button
                    styleType={"primary"}
                    text={"View Details"}
                    type={"button"}
                    onClick={() => {
                      if (onView) {
                        onView(asset.id);
                      } else {
                        setOverlayProperties({
                          ...DEFAULT_DETAIL_PROPS,
                          visible: !overlayProperties.visible,
                        });
                      }
                    }}
                  />
                </div>
              </>
            )}
        </div>
        <div className={styles.info}>
          <div className={`${infoWrapperClass} overflow--visible`}>
            <div className={`${textWrapperClass} overflow--visible`}>
              {isThumbnailNameEditable &&
              isEditing &&
              focusedItem &&
              focusedItem === asset.id ? (
                <input
                  autoFocus
                  className={`normal-text ${gridStyles["editable-input"]} ${styles["wrap-text"]}`}
                  value={thumbnailName}
                  onChange={handleNameChange}
                  onBlur={updateNameOnBlur}
                />
              ) : (
                <div className={`normal-text ${styles["wrap-text"]}`}>
                  <span
                    id="editable-preview"
                    onClick={handleOnFocus}
                    className={
                      isThumbnailNameEditable
                        ? gridStyles["editable-preview"]
                        : `${gridStyles["editable-preview"]} ${gridStyles["non-editable-preview"]}`
                    }
                  >
                    {thumbnailName}.{asset.extension}
                  </span>
                </div>
              )}
              <div className={styles["details-wrapper"]}>
                <div className="secondary-text">
                  {format(new Date(asset.createdAt), "MMM d, yyyy, p")}
                </div>
                {!isUploading && showAssetOption && (
                  <AssetOptions
                    itemType={type}
                    asset={asset}
                    openArchiveAsset={openArchiveAsset}
                    openDeleteAsset={openDeleteAsset}
                    openMoveAsset={openMoveAsset}
                    openCopyAsset={openCopyAsset}
                    downloadAsset={downloadAsset}
                    openShareAsset={openShareAsset}
                    openComments={openComments}
                    openRemoveAsset={openRemoveAsset}
                    isShare={isShare}
                    dissociateAsset={onDisassociate}
                  />
                )}
                {showAssetRelatedOption && (
                  <AssetOptions
                    itemType={type}
                    asset={asset}
                    openDeleteAsset={openDeleteAsset}
                    downloadAsset={downloadAsset}
                    isAssetRelated
                    dissociateAsset={onDisassociate}
                  />
                )}
              </div>
              {/* </div> */}
            </div>

            {customIconComponent}
          </div>

          <div>{customComponent}</div>
        </div>
      </div>
      {overlayProperties.visible && (
        <DetailOverlay
          sharePath={sharePath}
          isShare={isShare}
          asset={asset}
          realUrl={
            asset.extension === "tiff" || asset.extension === "tif"
              ? thumbailUrl
              : realUrl
          }
          activeFolder={activeFolder}
          thumbailUrl={thumbailUrl}
          initialParams={overlayProperties}
          openShareAsset={openShareAsset}
          openDeleteAsset={openDeleteAsset}
          closeOverlay={onCloseOverlay}
          loadMore={loadMore}
        />
      )}
    </>
  );
};

export default AssetThumbail;
