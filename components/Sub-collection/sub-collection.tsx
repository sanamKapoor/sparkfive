import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';

import { Utilities } from '../../assets';
import { AssetContext } from '../../context';
import useSortedAssets from '../../hooks/use-sorted-assets';
import AssetTableHeader from '../common/asset/Asset-table-header/asset-table-header';
import AssetThumbail from '../common/asset/asset-thumbail';
import FolderTableHeader from '../common/asset/Folder-table-header/folder-table-header';
import Button from '../common/buttons/button';
import FilterView from '../common/filter-view';
import FolderGridItem from '../common/folder/folder-grid-item';
import styles from '../new-subcollection-design/Sub-collection/sub-collection.module.css';

const SubCollection = ({
  activeView = "grid",
  isShare = false,
  toggleSelected,
  mode = "assets",
  deleteFolder = (id: string) => { },
  viewFolder = (id: string) => { },
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
  const [isSticky, setIsSticky] = useState(false);
  const [bottom1, setBottom1] = useState(0); // Assuming a default value, adjust as needed

  const handleCircleClick = () => {
    loadMoreAssets(true, !showSubCollectionContent);
    setShowSubCollectionContent(!showSubCollectionContent);
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
    showSubCollectionContent,
    setShowSubCollectionContent,
    activeSubFolders,
  } = useContext(AssetContext);

  // Sorting in SubcollectionView
  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] = useSortedAssets(assets);

  const [sortedFolders, currentSortFolderAttribute, setCurrentSortFolderAttribute] = useSortedAssets(results, "", true);

  const setSortAssetAttribute = (attribute) => {
    if (attribute === currentSortAttribute) {
      setCurrentSortAttribute("-" + attribute);
    } else {
      setCurrentSortAttribute(currentSortAttribute.startsWith("-") ? "" : attribute);
    }
  };

  const setSortFolderAttribute = (attribute) => {
    if (attribute === currentSortFolderAttribute) {
      setCurrentSortFolderAttribute("-" + attribute);
    } else {
      setCurrentSortFolderAttribute(currentSortFolderAttribute.startsWith("-") ? attribute : "-" + attribute);
    }
  };
  //End of logic for Sorting in subCollection view

  const loadingAssetsFolders = assets.length > 0 && assets[assets.length - 1].isLoading;

  useEffect(() => {
    return () => {
      setActiveSubFolders("");
      // setSubFoldersViewList({ results: [], next: 0, total: 0 });
      setSubFoldersAssetsViewList({ results: [], next: 0, total: 0 });
      setShowSubCollectionContent(false);
    };
  }, []);

  //For handling the show subcollection checkbox button for collection change
  useEffect(() => {
    setShowSubCollectionContent(false);
  }, [activeSubFolders])


  const handleScroll = (e: any) => {
    const element = document.getElementById('filter-view') as HTMLElement;
    const { top, height } = element.getBoundingClientRect();
    const element2 = document.getElementById('asset-view') as HTMLElement;
    const { top: top2 } = element2.getBoundingClientRect();
    const element3 = document.getElementById('top-bar') as HTMLElement;
    const { bottom } = element3.getBoundingClientRect();
    if (top < bottom) {
      setBottom1((prev) => { return bottom })
      setIsSticky(true);
    } else if (top2 > bottom + height) {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getStyling = (): CSSProperties => {
    return isSticky ? { position: "fixed", width: "calc(100% - 350px)", top: bottom1, zIndex: 10 } : {};
  }

  return (
    <>
      {sortedFolders.length > 0 && (
        <div className={`${styles["sub-collection-heading"]}`}>
          <div className={styles.rightSide}>
            <div className={`${styles["sub-collection-heading-outer"]}`}>
              <span>{sortedFolders.length == 1 ? "Subcollection" : "Subcollections"} ({total})</span>
              <img
                className={`${collectionHide ? styles.iconClick : styles.rightIcon} ${styles.ExpandIcons}`}
                onClick={() => {
                  handleHideClick();
                }}
                src={Utilities.caretDownLight}
              />
            </div>
          </div>
        </div>
      )}
      {!collectionHide && (
        <>
          {/* list wrapper for list view */}
          {sortedFolders.length > 0 && (
            <div className={`${styles["cardsWrapper"]} ${activeView === "list" && styles["list-wrapper"]}`}>
              {activeView === "list" && (
                <FolderTableHeader activeView={activeView} setSortAttribute={setSortFolderAttribute} />
              )}
              {sortedFolders.map((folder, index) => {
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
                      shareAssets={() => beginAssetOperation({ folder }, "shareFolders")}
                      changeThumbnail={beginChangeThumbnailOperation}
                      deleteThumbnail={() => deleteThumbnail({ folder }, "shareFolders")}
                      activeView={activeView}
                      isThumbnailNameEditable={isThumbnailNameEditable}
                      focusedItem={focusedItem}
                      setFocusedItem={setFocusedItem}
                      folderType="SubCollection"
                      mode={mode}
                    />
                  </li>
                );
              })}
            </div>
          )}
          {next > 0 && (
            <div className={styles.LoadMorebtn}>
              <Button
                text="Load More"
                onClick={() => {
                  loadMoreSubCollctions(false, 10);
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
          <>
            <div className={`${styles["heading-wrapper"]}`}>
              <div className={`${styles["sub-collection-heading"]}`}>
                {sortedAssets.length > 0 && sortedFolders.length > 0 && (
                  <div className={styles.rightSide}>
                    <span>Assets ({totalAssets})</span>
                    <img
                      className={`${assetsHide ? styles.iconClick : styles.rightIcon} ${styles.ExpandIcons}`}
                      onClick={() => {
                        handleAssetsHideClick();
                      }}
                      src={Utilities.caretDownLight}
                    />
                  </div>
                )}
                {sortedFolders.length > 0 && sortedAssets.length > 0 && (
                  <div className={styles.tagOuter}>
                    <div className={styles.left}>
                      <div className={styles.TagsInfo}>
                        <div
                          className={`${styles.circle} ${showSubCollectionContent ? styles.checked : ""
                            }`}
                          onClick={handleCircleClick}
                        >
                          {showSubCollectionContent && <img src={Utilities.checkIcon} />}
                        </div>
                        <span className={`${styles["sub-collection-content"]}`}>
                          Show all assets in parent collection
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div id="filter-view" className={`${styles["collection-filter-wrap"]} ${isSticky ? styles["sticky"] : ""}  ${assetsHide ? styles.hidden : ""}`} style={getStyling()}>
              {!assetsHide && <FilterView />}
            </div>
          </>
          <div
            id='asset-view'
            className={`${styles["assetWrapper"]} ${activeView === "list" && styles["list-wrapper"]
              }`}
          >
            {!assetsHide && (
              <>
                {activeView === "list" && (
                  <AssetTableHeader activeView={activeView} type={true} setSortAttribute={setSortAssetAttribute} />
                )}
                {sortedAssets.map((assetItem, index) => {
                  if (assetItem.status !== "fail") {
                    return (
                      <li
                        className={`${styles["grid-item"]} ${activeView === "grid" ? styles["grid-item-new"] : ""}`}
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
                          toggleSelected={() => toggleSelected(assetItem.asset.id)}
                          openArchiveAsset={() => openArchiveAsset(assetItem.asset)}
                          openDeleteAsset={() => openDeleteAsset(assetItem.asset.id)}
                          openMoveAsset={() => beginAssetOperation({ asset: assetItem }, "move")}
                          openCopyAsset={() => beginAssetOperation({ asset: assetItem }, "copy")}
                          openShareAsset={() => beginAssetOperation({ asset: assetItem }, "share")}
                          downloadAsset={() => downloadAsset(assetItem)}
                          openRemoveAsset={() => beginAssetOperation({ asset: assetItem }, "remove_item")}
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
                    );
                  }
                })}
              </>
            )}
          </div>
          {nextAsset > 0 && (
            <>
              {nextAsset > 2 ? (
                <>
                  {!loadingAssetsFolders && (
                    <Waypoint
                      onEnter={() => {
                        loadMoreAssets(false, showSubCollectionContent);
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
                          loadMoreAssets(false, showSubCollectionContent);
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
