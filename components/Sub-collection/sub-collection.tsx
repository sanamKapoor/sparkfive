import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./sub-collection.module.css";
import { Utilities } from "../../assets";
import Button from "../common/buttons/button";
import { AssetContext } from "../../context";
import FolderGridItem from "../common/folder/folder-grid-item";
import AssetThumbail from "../common/asset/asset-thumbail";
import { Waypoint } from "react-waypoint";

const SubCollection = (
  {
    activeView = "grid",
    isShare = false,
    toggleSelected,
    mode = "assets",
    deleteFolder = (id: string) => { },
    viewFolder = (id: string) => { },
    sharePath = "",
    openFilter,
    widthCard,
    ref,
    copyShareLink,
    getShareIsEnabled,
    beginAssetOperation,
    beginChangeThumbnailOperation,
    deleteThumbnail,
    isThumbnailNameEditable,
    setFocusedItem,
    focusedItem,
    handleFocusChange,
    loadMoreSubCollctions,
    openArchiveAsset,
    openDeleteAsset,
    downloadAsset,
    refreshVersion,
    loadMoreAssets,
    onCloseDetailOverlay,
  }: any) => {
  const [isChecked, setIsChecked] = useState(false);
  const [collectionHide, setCollectionHide] = useState(false);
  const [assetsHide, setAssetsHide] = useState(false);


  const handleCircleClick = () => {
    loadMoreAssets(true, !isChecked)
    setIsChecked(!isChecked);
  };
  const handleHideClick = () => {
    setCollectionHide(!collectionHide);
  };
  const handleAssetsHideClick = () => {
    setAssetsHide(!assetsHide);
  };

  const {
    setActiveSubFolders,
    subFoldersViewList: { results, next, total },
    setSubFoldersViewList,
    setSubFoldersAssetsViewList,
    subFoldersAssetsViewList: { results: assets, next: nextAsset, total: totalAssets },
    activeSubFolders,
  } = useContext(AssetContext);


  const loadingAssetsFolders =
    (assets.length > 0 && assets[assets.length - 1].isLoading)

  useEffect(() => {
    return () => {
      setActiveSubFolders("")
      setSubFoldersViewList({ results: [], next: 0, total: 0 })
      setSubFoldersAssetsViewList({ results: [], next: 0, total: 0 })
    }
  }, [])

  return (
    <>
      <div className={`${styles["sub-collection-heading"]}`}>
        <div className={styles.rightSide}>
          <span>Subcollection ({total})</span>
          <img onClick={() => { handleHideClick() }} src={collectionHide ? Utilities.arrowDownUp : Utilities.downIcon} />
        </div>
        <div className={styles.tagOuter}>
          <div className={styles.left}>
            <div className={styles.TagsInfo}>
              <div
                className={`${styles.circle} ${isChecked ? styles.checked : ""
                  }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span className={`${styles["sub-collection-content"]}`}>
                Show subcollection content
              </span>
            </div>
          </div>
        </div>
      </div>
      {!collectionHide &&
        <>
          <div className={styles.cardsWrapper}>
            {results.map((folder, index) => {
              return (
                <li
                  className={styles["grid-item"]}
                  key={folder.id || index}
                  onClick={(e) => handleFocusChange(e, folder.id)}
                  ref={ref}
                  style={{ width: `$${widthCard}px` }}
                >
                  <FolderGridItem
                    {...folder}
                    isShare={isShare}
                    sharePath={sharePath}
                    toggleSelected={() => toggleSelected(folder.id)}
                    viewFolder={() => viewFolder(folder.id)}
                    deleteFolder={() => deleteFolder(folder.id)}
                    copyShareLink={() => copyShareLink(folder)}
                    copyEnabled={getShareIsEnabled(folder)}
                    openFilter={openFilter}
                    shareAssets={() =>
                      beginAssetOperation({ folder }, "shareFolders")
                    }
                    changeThumbnail={beginChangeThumbnailOperation}
                    deleteThumbnail={() =>
                      deleteThumbnail({ folder }, "shareFolders")
                    }
                    activeView={activeView || mode}
                    isThumbnailNameEditable={isThumbnailNameEditable}
                    focusedItem={focusedItem}
                    setFocusedItem={setFocusedItem}
                    folderType="SubCollection"
                  />
                </li>
              );
            })
            }
          </div >
          {next > 0 &&
            <div className={styles.LoadMorebtn}>
              <Button text="Load More" onClick={() => { loadMoreSubCollctions(false) }} type="button" className="container primary" />
            </div>
          }
        </>
      }
      {!assetsHide && <>
        <div className={`${styles["sub-collection-heading"]}`}>
          <div className={styles.rightSide}>
            <span>Assets ({totalAssets})</span>
            <img onClick={() => { handleAssetsHideClick() }} src={assetsHide ? Utilities.arrowDownUp : Utilities.downIcon} />
          </div>
        </div>
        <div>
          {assets.map((assetItem, index) => {
            if (assetItem.status !== "fail") {
              return (
                <li
                  className={styles["grid-item"]}
                  key={assetItem.asset.id || index}
                  onClick={(e) => handleFocusChange(e, assetItem.asset.id)}
                  ref={ref}
                  style={{ width: `$${widthCard}px` }}
                >
                  <AssetThumbail
                    {...assetItem}
                    sharePath={sharePath}
                    activeFolder={activeSubFolders}
                    isShare={isShare}
                    type={""}
                    toggleSelected={() =>
                      toggleSelected(assetItem.asset.id)
                    }
                    openArchiveAsset={() =>
                      openArchiveAsset(assetItem.asset)
                    }
                    openDeleteAsset={() =>
                      openDeleteAsset(assetItem.asset.id)
                    }
                    openMoveAsset={() =>
                      beginAssetOperation({ asset: assetItem }, "move")
                    }
                    openCopyAsset={() =>
                      beginAssetOperation({ asset: assetItem }, "copy")
                    }
                    openShareAsset={() =>
                      beginAssetOperation({ asset: assetItem }, "share")
                    }
                    downloadAsset={() => downloadAsset(assetItem)}
                    openRemoveAsset={() =>
                      beginAssetOperation(
                        { asset: assetItem },
                        "remove_item"
                      )
                    }
                    handleVersionChange={refreshVersion}
                    // loadMore={loadMore}
                    onCloseDetailOverlay={onCloseDetailOverlay}
                    isThumbnailNameEditable={isThumbnailNameEditable}
                    focusedItem={focusedItem}
                    setFocusedItem={setFocusedItem}
                  />
                </li>
              );
            }
          })
          }
        </div>

        {nextAsset > 0 && (
          <>
            {nextAsset > 2 ? (
              <>
                {(!loadingAssetsFolders &&
                  <Waypoint onEnter={() => { loadMoreAssets(false, isChecked) }} fireOnRapidScroll={false} />
                )}
              </>
            ) : (
              <>
                {(
                  !loadingAssetsFolders &&
                  <div className={styles["button-wrapper"]}>
                    <Button
                      text="Load More"
                      type="button"
                      className="container primary"
                      onClick={() => {
                        loadMoreAssets(false, isChecked
                        )
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </>
      }
    </>
  );
};
export default SubCollection;
