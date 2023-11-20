import React, { useContext, useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import { Utilities } from "../../assets";
import { AssetContext } from "../../context";
import AssetThumbail from "../common/asset/asset-thumbail";
import Button from "../common/buttons/button";
import FolderGridItem from "../common/folder/folder-grid-item";
import styles from "../new-subcollection-design/Sub-collection/sub-collection.module.css";

import useSortedAssets from "../../hooks/use-sorted-assets";
import AssetTableHeader from "../common/asset/Asset-table-header/asset-table-header";
import FolderTableHeader from "../common/asset/Folder-table-header/folder-table-header";
import FilterView from "../common/filter-view";

const SubCollection = ({
  activeView = "grid",
  isShare = false,
  toggleSelected,
  mode = "assets",
  deleteFolder = (id: string) => {},
  viewFolder = (id: string) => {},
  sharePath = "",
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
    loadMoreAssets(true, !isChecked);
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
    subFoldersAssetsViewList: {
      results: assets,
      next: nextAsset,
      total: totalAssets,
    },
    activeSubFolders,
  } = useContext(AssetContext);

  // Sorting in SubcollectionView
  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] =
    useSortedAssets(assets);
  const [
    sortedFolders,
    currentSortFolderAttribute,
    setCurrentSortFolderAttribute,
  ] = useSortedAssets(results, "", true);

  const setSortAssetAttribute = (attribute) => {
    if (attribute === currentSortAttribute) {
      setCurrentSortAttribute("-" + attribute);
    } else {
      setCurrentSortAttribute(
        currentSortAttribute.startsWith("-") ? "" : attribute
      );
    }
  };

  const setSortFolderAttribute = (attribute) => {
    if (attribute === currentSortFolderAttribute) {
      setCurrentSortFolderAttribute("-" + attribute);
    } else {
      setCurrentSortFolderAttribute(
        currentSortFolderAttribute.startsWith("-") ? attribute : "-" + attribute
      );
    }
  };
  //End of logic for Sorting in subCollection view

  const loadingAssetsFolders =
    assets.length > 0 && assets[assets.length - 1].isLoading;

  useEffect(() => {
    return () => {
      setActiveSubFolders("");
      setSubFoldersViewList({ results: [], next: 0, total: 0 });
      setSubFoldersAssetsViewList({ results: [], next: 0, total: 0 });
    };
  }, []);

  return (
    <>
      <div className={`${styles["sub-collection-heading"]}`}>
        <div className={styles.rightSide}>
          <span>Subcollection ({total})</span>
          <img
            className={styles.ExpandIcons}
            onClick={() => {
              handleHideClick();
            }}
            src={collectionHide ? Utilities.up : Utilities.downIcon}
          />
        </div>
        <div className={styles.tagOuter}>
          <div className={styles.left}>
            <div className={styles.TagsInfo}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
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
      {!collectionHide && (
        <>
          {/* list wrapper for list view */}
          <div
            className={`${styles["cardsWrapper"]} ${
              activeView === "list" && styles["list-wrapper"]
            }`}
          >
            {sortedFolders.map((folder, index) => {
              return (
                <>
                  <FolderTableHeader
                    index={index}
                    activeView={activeView}
                    setSortAttribute={setSortFolderAttribute}
                  />
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
                      shareAssets={() =>
                        beginAssetOperation({ folder }, "shareFolders")
                      }
                      changeThumbnail={beginChangeThumbnailOperation}
                      deleteThumbnail={() =>
                        deleteThumbnail({ folder }, "shareFolders")
                      }
                      activeView={activeView}
                      isThumbnailNameEditable={isThumbnailNameEditable}
                      focusedItem={focusedItem}
                      setFocusedItem={setFocusedItem}
                      folderType="SubCollection"
                      mode={mode}
                    />
                  </li>
                </>
              );
            })}
          </div>
          {next > 0 && (
            <div className={styles.LoadMorebtn}>
              <Button
                text="Load More"
                onClick={() => {
                  loadMoreSubCollctions(false, 5);
                }}
                type="button"
                className="container primary"
              />
            </div>
          )}
        </>
      )}
      {
        <>
          <div className={`${styles["sub-collection-heading"]}`}>
            <div className={styles.rightSide}>
              <span>Assets ({totalAssets})</span>
              <img
                className={styles.ExpandIcons}
                onClick={() => {
                  handleAssetsHideClick();
                }}
                src={assetsHide ? Utilities.up : Utilities.downIcon}
              />
            </div>
          </div>
          {sortedAssets.length > 0 && <FilterView />}

          <div
            className={`${styles["assetWrapper"]} ${
              activeView === "list" && styles["list-wrapper"]
            }`}
          >
            {!assetsHide &&
              sortedAssets.map((assetItem, index) => {
                if (assetItem.status !== "fail") {
                  return (
                    <div>
                      <AssetTableHeader
                        index={index}
                        activeView={activeView}
                        setSortAttribute={setSortAssetAttribute}
                      />
                      <li
                        className={styles["grid-item"]}
                        key={assetItem.asset.id || index}
                        onClick={(e) =>
                          handleFocusChange(e, assetItem.asset.id)
                        }
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
                          activeView={activeView}
                          mode={mode}
                        />
                      </li>
                    </div>
                  );
                }
              })}
          </div>
          {nextAsset > 0 && (
            <>
              {nextAsset > 2 ? (
                <>
                  {!loadingAssetsFolders && (
                    <Waypoint
                      onEnter={() => {
                        loadMoreAssets(false, isChecked);
                      }}
                      fireOnRapidScroll={false}
                    />
                  )}
                </>
              ) : (
                <>
                  {!loadingAssetsFolders && (
                    <div className={styles.LoadMorebtn}>
                      <Button
                        text="Load More"
                        type="button"
                        className="container primary"
                        onClick={() => {
                          loadMoreAssets(false, isChecked);
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
