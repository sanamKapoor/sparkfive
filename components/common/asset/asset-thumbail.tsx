import { format } from 'date-fns';
import filesize from 'filesize';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import HoverVideoPlayer from 'react-hover-video-player';

import { Utilities } from '../../../assets';
import { events, shareLinkEvents } from '../../../constants/analytics';
import { AssetContext, UserContext } from '../../../context';
import useAnalytics from '../../../hooks/useAnalytics';
import assetApi from '../../../server-api/asset';
import { removeExtension } from '../../../utils/asset';
import cookiesApi from '../../../utils/cookies';
import toastUtils from '../../../utils/toast';
import RenameModal from '../../common/modals/rename-modal';
import Button from '../buttons/button';
import IconClickable from '../buttons/icon-clickable';
import Spinner from '../spinners/spinner';
import gridStyles from './asset-grid.module.css';
import AssetIcon from './asset-icon';
import AssetImg from './asset-img';
import AssetOptions from './asset-options';
import styles from './asset-thumbail.module.css';

// Components
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
  handleVersionChange,
  onView = null,
  customComponent = <></>,
  customIconComponent = <></>,
  onDisassociate = () => { },
  onCloseDetailOverlay = (asset) => { },
  isThumbnailNameEditable = false,
  activeView,
  mode,
  availableNext = true
}) => {
 

  const [overlayProperties, setOverlayProperties] = useState(DEFAULT_DETAIL_PROPS);
  const router = useRouter();

  const {
    detailOverlayId,
    assets,
    setAssets,
    subFoldersAssetsViewList: { results: subAssets, next: nextAsset, total: totalAssets },
    setListUpdateFlag,
    setSubFoldersAssetsViewList,
    activeSubFolders,
    headerName
  } = useContext(AssetContext);
  const { user } = useContext(UserContext);

  const isAssetACopy = asset.name.endsWith(" - COPY");

  const assetName = removeExtension(asset.name);

  const [thumbnailName, setThumbnailName] = useState(assetName);

  const [isEditing, setIsEditing] = useState(false);
  const dateFormat = "MMM do, yyyy";
  const [assetRenameModalOpen, setAssetRenameModalOpen] = useState(false);

  const { trackEvent, trackLinkEvent } = useAnalytics();

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

  // HAndle the New action Button Change name for assets
  const renameAsset = () => {
    setAssetRenameModalOpen(true);
  };

  const confirmAssetRename = async (newValue) => {
    try {
      if (mode === "SubCollectionView") {
        const activeAsset = subAssets.find((asst) => asst?.asset?.id === asset?.id);

        const editedName = `${newValue}.${activeAsset?.asset?.extension}`;
        const data = await assetApi.updateAsset(asset.id, {
          updateData: { name: isAssetACopy ? editedName + " - COPY" : editedName },
          associations: {},
        });
        if (data && removeExtension(data?.data?.name) !== assetName) {
          const updatedAssets = [
            ...subAssets.map((item) => {
              if (item.asset.id === data?.data?.id) {
                return {
                  ...item,
                  asset: {
                    ...item.asset,
                    name: isAssetACopy ? editedName + " - COPY" : editedName,
                  },
                };
              } else {
                return item;
              }
            }),
          ];
          setSubFoldersAssetsViewList({
            results: updatedAssets,
            next: nextAsset,
            total: totalAssets
          });
          setListUpdateFlag(true);
        }
        setThumbnailName(editedName);
        toastUtils.success("Asset name updated");
      } else {
        const activeAsset = assets.find((asst) => asst?.asset?.id === asset?.id);
        const editedName = `${newValue}.${activeAsset?.asset?.extension}`;
        const data = await assetApi.updateAsset(asset.id, {
          updateData: { name: isAssetACopy ? editedName + " - COPY" : editedName },
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
                    name: isAssetACopy ? editedName + " - COPY" : editedName,
                  },
                };
              } else {
                return item;
              }
            }),
          ];
          setAssets(updatedAssets);
          setListUpdateFlag(true);
        }
        setThumbnailName(editedName);
        toastUtils.success("Asset name updated");
      }
    } catch (err) {
      toastUtils.error("Could not update asset name");
    }
  };

  const handleViewDetails = (type: string) => {
    if (type === "button" || (type === "wrapper" && activeView === "list")) {
      if (!overlayProperties.visible) {
        if (isShare) {
          trackLinkEvent(shareLinkEvents.VIEW_SHARED_ASSET, {
            assetId: asset.id,
            email: cookiesApi.get('shared_email') || null,
            teamId: cookiesApi.get('teamId') || null,
          })
          router.push({
            pathname: `/collections/assetDetail/${asset.id}`,
            query: { isShare, sharePath, sharedCode: "", headerName, activeFolder, availableNext, activeSubFolders }
          });
        } else {
          trackEvent(events.VIEW_ASSET, {
            assetId: asset.id,
          });
          router.push({
            pathname: `/main/assets/${asset.id}`,
            query: { isShare, sharePath, sharedCode: "", headerName, activeFolder, availableNext, activeSubFolders }
          });
        }
      }
    }
  }


  return (
    <>
      <div>
        <div
          className={`${styles.uploadUproval} ${styles.container} ${activeView === "list" && styles.listContainer} ${isLoading && "loadable"
            }`}
        >
          <div className={activeView === "list" && styles["list-item-wrapper"]}>
            {activeView === "list" ? (
              <div className={`${styles["list-select-icon"]} ${isSelected && styles["selected-wrapper"]}`}>
                <IconClickable
                  src={isSelected ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                  additionalClass={styles["select-icon"]}
                  onClick={toggleSelected}
                />
              </div>
            ) : null}
            <div
              className={`${styles["image-wrapper"]} ${activeView === "list" && styles["list-image-wrapper"]}`}
              onClick={() => handleViewDetails("wrapper")}
            >
              {isUploading && (
                <>
                  <p className={styles.uploading}>Uploading...</p>
                </>
              )}
              {asset.type !== "video" ? (
                thumbailUrl ? (
                  <AssetImg imgClass="userEvents" assetImg={thumbailUrl} type={asset.type} name={asset.name} opaque={isUploading} />
                ) : (
                  <AssetIcon imgClass="userEvents" extension={asset.extension} />
                )
              ) : activeView === "list" ? (
                <AssetImg
                  imgClass="userEvents"
                  assetImg={thumbailUrl}
                  type={asset.type}
                  name={asset.name}
                  opaque={isUploading}
                  imgClass={styles["video-thumbnail"]}
                />
              ) : (
                <HoverVideoPlayer
                  data-drag="false"
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
                      imgClass={styles["video-thumbnail userEvents"]}
                      data-drag="false"
                    />
                  }
                  loadingOverlay={
                    <div data-drag="false" className={styles["loading-overlay"]}>
                      <Spinner />
                    </div>
                  }
                />
              )}
              {activeView !== "list" && !isUploading && !isLoading && (showAssetOption || showViewButtonOnly) && (
                <>
                  {(!showViewButtonOnly || (showViewButtonOnly && showSelectedAsset)) && (
                    <div className={`${styles["selectable-wrapper"]} ${isSelected && styles["selected-wrapper"]}`}>
                      {isSelected ? (
                        <IconClickable
                          src={Utilities.radioButtonEnabled}
                          additionalClass={styles["select-icon"]}
                          onClick={toggleSelected}
                          data-drag="false"
                        />
                      ) : (
                        <IconClickable
                          src={Utilities.radioButtonNormal}
                          additionalClass={styles["select-icon"]}
                          onClick={toggleSelected}
                          data-drag="false"
                        />
                      )}
                    </div>
                  )}
                  <div className={styles["image-button-wrapper"]}>
                    <Button
                      className={"container primary"}
                      text={"View Details"}
                      type={"button"}
                      onClick={() => handleViewDetails("button")}
                      data-drag="false"
                    />
                  </div>
                </>
              )}
            </div>
            <div data-drag="false" className={`normal-text ${styles["wrap-text"]} ${activeView === "list" && styles["list-text"]}`}>
              <span
                data-drag="false"
                id="editable-preview"
                onClick={() => {
                  setOverlayProperties({
                    ...DEFAULT_DETAIL_PROPS,
                    visible: !overlayProperties.visible,
                  });
                }}
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
          </div>
          {activeView === "list" && (
            <div data-drag="false" className={styles["size"]}>{parseInt(asset.size) !== 0 && asset.size && filesize(asset.size)}</div>
          )}
          {/* <div data-drag="false" className={activeView === "grid" && styles.sizeMargin}> */}
          <div data-drag="false" className={`${activeView === "list" ? styles["extra-class"] : ''} ${activeView === "grid" ? styles.sizeMargin : ''}`}>
           <div
            data-drag="false"
              className={`${activeView !== "list"
                ? `secondary-text ${styles["modified-date"]} ${styles["uploadModified"]}`
                : ""
                }`}
              style={{ color: "#AEB0C2" }}
            >
              {format(new Date(asset.createdAt), dateFormat)}
            </div>
          </div>
          {activeView === "list" && (
            <div data-drag="false" className={`${styles["modified-date"]} ${activeView === "list" && styles["modified-date-list"]}`}>
              {" "}
              {format(new Date(asset.createdAt), dateFormat)}
            </div>
          )}
          {activeView === "list" && (
            <div data-drag="false" className={styles.extension}>
              <span className={styles.format}>{asset.extension}</span>
            </div>
          )}
          {!isUploading && showAssetOption && (
            <AssetOptions
              itemType={type}
              asset={asset}
              thumbailUrl={thumbailUrl}
              realUrl={realUrl}
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
              renameAsset={renameAsset}
              activeView={activeView}
            />
          )}
          {showAssetRelatedOption && (
            <AssetOptions
              itemType={type}
              asset={asset}
              thumbailUrl={thumbailUrl}
              realUrl={realUrl}
              openDeleteAsset={openDeleteAsset}
              downloadAsset={downloadAsset}
              isAssetRelated
              dissociateAsset={onDisassociate}
            />
          )}
        </div>
      </div>

      {customIconComponent}

      <div>{customComponent}</div>

      <RenameModal
        closeModal={() => setAssetRenameModalOpen(false)}
        modalIsOpen={assetRenameModalOpen}
        renameConfirm={confirmAssetRename}
        type={"Asset"}
        initialValue={assetName}
      />
    </>
  );
};

export default AssetThumbail;