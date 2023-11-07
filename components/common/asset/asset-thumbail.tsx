import { format } from "date-fns";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Utilities } from "../../../assets";
import gridStyles from "./asset-grid.module.css";
import styles from "./asset-thumbail.module.css";

// Components
import {
  ASSET_NAME_UPDATED,
  FAILED_TO_UPDATE_ASSET_NAME,
} from "../../../constants/messages";
import { AssetContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import { removeExtension } from "../../../utils/asset";
import toastUtils from "../../../utils/toast";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import AssetIcon from "./asset-icon";
import AssetImg from "./asset-img";
import AssetOptions from "./asset-options";
import DetailOverlay from "./detail-overlay";

import HoverVideoPlayer from "react-hover-video-player";
import Spinner from "../spinners/spinner";
import React from "react";

const DEFAULT_DETAIL_PROPS = { visible: false, side: "detail" };

const AssetThumbail = ({
  isShare,
  sharePath,
  type,
  asset,
  thumbailUrl,
  realUrl,
  previewUrl,
  isUploading,
  showAssetOption = true,
  showViewButtonOnly = false,
  showSelectedAsset = false,
  showAssetRelatedOption = false,
  isSelected = false,
  isLoading = false,
  activeFolder = "",
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
  onDisassociate = () => { },
  detailOverlay = true,
  onCloseDetailOverlay = (asset) => { },
  isThumbnailNameEditable = false,
  focusedItem,
  setFocusedItem,
  activeView
}) => {
  const [overlayProperties, setOverlayProperties] =
    useState(DEFAULT_DETAIL_PROPS);
  const { detailOverlayId, assets, setAssets } = useContext(AssetContext);

  const isAssetACopy = asset.name.endsWith(" - COPY");

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
          updateData: { name: isAssetACopy ? fileName + " - COPY" : fileName },
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
                    name: isAssetACopy ? fileName + " - COPY" : fileName,
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
      <div className={`${styles.container} ${ activeView === "list" && styles.listContainer} ${isLoading && "loadable"}`}>
           {/* select wrapper is for list view  */}
           {activeView==="list" ? (
               <div
               className={`${styles["list-select-icon"]} ${isSelected && styles["selected-wrapper"]}`}
             >
               <IconClickable
                 src={
                   isSelected
                     ? Utilities.radioButtonEnabled
                     : Utilities.radioButtonNormal
                 }
                 additionalClass={styles["select-icon"]}
                 onClick={toggleSelected}
               />
             </div>


           ):null}
   
        {/* list-image -wrapper is for list view */}
        <div className={`${styles['image-wrapper']} ${ activeView === "list" && styles['list-image-wrapper']}`}>
          {isUploading && (
            <>
              <p className={styles.uploading}>Uploading...</p>
            </>
          )}
          {asset.type !== "video" ? (
            thumbailUrl ? (
              <AssetImg
                assetImg={thumbailUrl}
                type={asset.type}
                name={asset.name}
                opaque={isUploading}
              />
            ) : (
              <AssetIcon extension={asset.extension} />
            )
          ) : (
            <HoverVideoPlayer
              controls
              className={styles["hover-video-player-wrapper"]}
              videoClassName={styles["video-style"]}
              videoSrc={previewUrl ?? realUrl}
              pausedOverlay={
                <AssetImg
                  assetImg={thumbailUrl}
                  type={asset.type}
                  name={asset.name}
                  opaque={isUploading}
                  imgClass={styles["video-thumbnail"]}
                />
              }
              loadingOverlay={
                <div className={styles["loading-overlay"]}>
                  <Spinner />
                </div>
              }
            />
          )}
          {!isUploading &&
            !isLoading &&
            (showAssetOption || showViewButtonOnly) && (
              <>
                {(!showViewButtonOnly ||
                  (showViewButtonOnly && showSelectedAsset)) && (
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
                  )}
                <div className={styles["image-button-wrapper"]}>
                  <Button
                    className={"container primary"}
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
        {/* list-info is for list view  */}
        <div className={`${styles.info} ${activeView === "list" &&  styles.listInfo}`}>
          <div className={`${infoWrapperClass} overflow--visible`}>
            <div
              className={`${textWrapperClass} overflow--visible ${styles.folderItemHeadingOuter}`}
            >
              {/* folderItemHeading is for list view */}
              <div className= {`${styles.folderItemHeading} ${ activeView === "list" &&  styles.listHeading}`}>
                {isThumbnailNameEditable &&
                  isEditing &&
                  focusedItem &&
                  focusedItem === asset.id ? (
                    // list-text is for list view
                  <input
                    autoFocus
                    className={`normal-text ${gridStyles["editable-input"]} ${styles["wrap-text"]}  ${ activeView === "list" &&   styles["list-text"]}`}
                    value={thumbnailName}
                    onChange={handleNameChange}
                    onBlur={updateNameOnBlur}
                  />
                 
                ) : (
                  // list-text is for list view 
                  <div className={`normal-text ${styles["wrap-text"]} ${activeView === "list" &&  styles["list-text"]}`}>
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
                      {isAssetACopy && ` - COPY`}
                    </span>
                  </div>
                )}
                {/* only for list view */}
                {/* size */}
               
                 <div  className={styles["size"]}>
                  <span> 13.37KB</span>
                 </div>
                <div className={styles["details-wrapper"]}>
                  <div className="secondary-text">
                    {format(new Date(asset.createdAt), "MMM d, yyyy, p")}
                  </div>
                </div>
                {/* only for list view  */}
                {/* date modified */}
                <div  className={`${styles['modified-date']}}`}>5/14/23</div>
                {/* extensions */}
                <div className={`${styles['extension']}}`}>jpej</div>
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
