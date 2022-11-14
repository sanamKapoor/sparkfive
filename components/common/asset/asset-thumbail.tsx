import styles from "./asset-thumbail.module.css";
import { Utilities, Assets } from "../../../assets";
import { format } from "date-fns";
import { useState, useEffect, useContext } from "react";

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
  showAssetRelatedOption = false,
  isSelected = false,
  isLoading = false,
  activeFolder = '',
  toggleSelected = () => { },
  openDeleteAsset = () => { },
  openMoveAsset = () => { },
  openCopyAsset = () => { },
  openShareAsset = () => { },
  openArchiveAsset = () => { },
  downloadAsset = () => { },
  openRemoveAsset = () => { },
  loadMore = () => { },
  handleVersionChange,
  onView = null,
  customComponent = <></>,
  infoWrapperClass = "",
  textWrapperClass = "",
  customIconComponent = <></>,
  onDisassociate = () => {}
}) => {
  const [overlayProperties, setOverlayProperties] = useState(DEFAULT_DETAIL_PROPS);
  const { detailOverlayId } = useContext(AssetContext);

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

  const onCloseOverlay = (changedVersion) => {
    if (changedVersion) {
      handleVersionChange(changedVersion);
    }
    setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: false });
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
          {!isUploading && !isLoading && showAssetOption && (
            <>
              <div
                className={`${styles["selectable-wrapper"]} ${isSelected && styles["selected-wrapper"]
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
              <div className={styles["image-button-wrapper"]}>
                <Button
                  styleType={"primary"}
                  text={"View Details"}
                  type={"button"}
                  onClick={() => {
                    if (onView) {
                      onView()
                    } else {
                      setOverlayProperties({
                        ...DEFAULT_DETAIL_PROPS,
                        visible: !overlayProperties.visible,
                      })
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
              <div className={`normal-text ${styles['wrap-text']}`}>{asset.name}</div>
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
