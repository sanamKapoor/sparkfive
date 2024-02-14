import React, { CSSProperties, HtmlHTMLAttributes, useContext, useEffect, useRef, useState } from 'react';
import { Waypoint } from 'react-waypoint';

import { Utilities } from '../../assets';
import { AssetContext, UserContext } from '../../context';
import useSortedAssets from '../../hooks/use-sorted-assets';
import assetApi from '../../server-api/asset';
import toastUtils from '../../utils/toast';
import AssetTableHeader from '../common/asset/Asset-table-header/asset-table-header';
import AssetThumbail from '../common/asset/asset-thumbail';
import FolderTableHeader from '../common/asset/Folder-table-header/folder-table-header';
import Button from '../common/buttons/button';
import FilterView from '../common/filter-view';
import FolderGridItem from '../common/folder/folder-grid-item';
import ConfirmModal from '../common/modals/confirm-modal';
import SpinnerOverlay from '../common/spinners/spinner-overlay';
import styles from '../new-subcollection-design/Sub-collection/sub-collection.module.css';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

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
  selectableItemsRef,
  elementsAssetContainerRef,
  elementsFolderContainerRef
}: any) => {

  const {
    setActiveSubFolders,
    subFoldersViewList: { results, next, total },
    setSubFoldersAssetsViewList,
    subFoldersAssetsViewList: { results: assets, next: nextAsset, total: totalAssets },
    showSubCollectionContent,
    setShowSubCollectionContent,
    activeSubFolders,
    setListUpdateFlag,
    setAssetDragFlag,
    setAssetDragId,
    setAssetDragType,
    setDroppableId,
    collectionDragFlag,
    setCollectionDragFlag,
    setCollectionDragId,
    setCollectionParentDragId
  } = useContext(AssetContext);

  const { user } = useContext(UserContext);

  const [droppableFolderName, setDroppableFolderName] = useState("")
  const [collectionHide, setCollectionHide] = useState(false);
  const [assetsHide, setAssetsHide] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [bottom1, setBottom1] = useState(0); // Assuming a default value, adjust as needed

  // Sorting in SubcollectionView
  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] = useSortedAssets(assets);
  const [sortedFolders, currentSortFolderAttribute, setCurrentSortFolderAttribute] = useSortedAssets(results, "", true);

  //End of logic for Sorting in subCollection view
  const loadingAssetsFolders = assets.length > 0 && assets[assets.length - 1].isLoading;
  // State for Dropping assets
  const childAsset = useRef("");
  const parentFolder = useRef("");
  const [moveModalFlag, setMoveModalFlag] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    return () => {
      setActiveSubFolders("");
      // setSubFoldersAssetsViewList({ results: [], next: 0, total: 0 });
      setShowSubCollectionContent(false);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  })

  //For handling the show subcollection checkbox button for collection change
  useEffect(() => {
    setShowSubCollectionContent(false);
  }, [activeSubFolders])

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

  //Handle the dynamically stopage of filters at top of page position on scroll down  
  const getStyling = (): CSSProperties => {
    return isSticky ? { position: "fixed", width: "calc(100% - 350px)", top: bottom1, zIndex: 1200 } : {};
  }
  //Handle the selctable Item for the drag selct area at initial load and load more functionality 
  useEffect(() => {
    if (elementsFolderContainerRef.current && sortedFolders?.length && sortedAssets?.length === 0) {
      const containerRect = elementsFolderContainerRef.current.getBoundingClientRect();
      const liElements = elementsFolderContainerRef.current.querySelectorAll('li');
      selectableItemsRef.current = new Array();
      Array.from(liElements).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const adjustedTop = top - containerRect.top;
        const adjustedLeft = left - containerRect.left;
        if (item.id !== "") selectableItemsRef.current.push({
          left: adjustedLeft,
          top: adjustedTop,
          width,
          height,
          id: item.id,
        })
      })
    } else if (sortedAssets?.length && elementsAssetContainerRef.current) {
      const containerRect = elementsAssetContainerRef.current.getBoundingClientRect();
      const liElements = elementsAssetContainerRef.current.querySelectorAll('li');
      selectableItemsRef.current = new Array();
      Array.from(liElements).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const adjustedTop = top - containerRect.top;
        const adjustedLeft = left - containerRect.left;
        if (item.id !== "") selectableItemsRef.current.push({
          left: adjustedLeft,
          top: adjustedTop,
          width,
          height,
          id: item.id,
        })
      });
    }
  }, [sortedFolders?.length, activeView, sortedAssets?.length]);
  //------Drag-Select-area-------End======//

  const isAdmin = () => {
    return user?.role?.id === "admin" || user?.role?.id === "super_admin";
  };

  const isDraggable = () => {
    return isAdmin();
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    onDragStart(e);
  };

  const onDragStart = (evt: React.DragEvent<HTMLLIElement>) => {
    const element = evt.currentTarget;
    childAsset.current = element.id;
    setAssetDragFlag(true);
    setAssetDragId(element.id);
    setAssetDragType("move")
  };

  const handleDrop = (e) => {
    if (isAdmin() && !collectionDragFlag) { // Check for checking for admin and collection drag flag false in case we try to move sub-collection in collection only asset will be moving
      onDragDrop(e);
    } else if (collectionDragFlag) {
      resetMoveState();
      toastUtils.error("Could not move sub-collection into another sub-collection.")
    }
  };

  const onDragDrop = async (evt) => {
    const element = evt.currentTarget
    parentFolder.current = element.id
    setDroppableFolderName(element.dataset.name)
    if (childAsset.current !== "" && childAsset.current !== parentFolder.current) {
      setMoveModalFlag(true)
    } else if (childAsset.current === "") {
      resetMoveState();
      toastUtils.error("Could not move assets, please try again later.");
    } else {
      setAssetDragFlag(false);
      setAssetDragId("");
      setAssetDragType("")
      setDroppableId("")
      setDroppableFolderName("");
    }
  };

  const resetMoveState = () => {
    childAsset.current = "";
    parentFolder.current = "";
    setMoveModalFlag(false);
    setLoader(false);
    setAssetDragId("");// Global state for saving the asset Id 
    setAssetDragFlag(false);// Global state for start the dragging in side nav
    setAssetDragType("");// Global state in for asset if move or copy 
    setDroppableId("") //Global state in sidenav for droppbale 
    setCollectionDragFlag(false);// Global state in for collection drag when
    setCollectionDragId("");// Global state in for collection drag
    setCollectionParentDragId("")
    setDroppableFolderName("");// local state in for drag when
  };

  const removeSelectedFromList = () => {
    const newAssets = assets.filter((existingAsset) => {
      return existingAsset?.asset?.id !== childAsset.current
    });
    setSubFoldersAssetsViewList({
      next: nextAsset,
      total: totalAssets,
      results: [...newAssets],
    });
    resetMoveState();
  };

  const handleMoveError = (err) => {
    resetMoveState();

    if (err.response?.status === 402) {
      toastUtils.error(err.response.data.message);
    } else {
      toastUtils.error("Could not move assets, please try again later.");
    }
  };

  const moveReplaceAssets = async () => {
    try {
      setLoader(true);
      const moveAssetIds = [childAsset.current];
      const parentFolderIds = [parentFolder.current];
      await assetApi.moveAssets({ idList: moveAssetIds, folderId: parentFolderIds }, {});
      setListUpdateFlag(true);
      removeSelectedFromList();
      toastUtils.success("Assets moved successfully");
    } catch (err) {
      handleMoveError(err);
    }
  };

  const closeMoveModal = () => {
    resetMoveState();
  }

  const handleCollectionDragStart = (e: React.DragEvent<HTMLLIElement>, parentId: string) => {
    setCollectionDragFlag(true);
    setCollectionDragId(e.currentTarget.id)
    setCollectionParentDragId(parentId)
  };

  return (
    <>
      {loader && <SpinnerOverlay />}
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
            <div className={`${styles["cardsWrapper"]} ${activeView === "list" && styles["list-wrapper"]}`} ref={elementsFolderContainerRef} >
              {activeView === "list" && (
                <FolderTableHeader activeView={activeView} setSortAttribute={setSortFolderAttribute} />
              )}
              {sortedFolders.map((folder, index) => {
                return (
                  <li
                    id={folder.id}
                    className={styles["grid-item"]}
                    key={folder.id || index}
                    onClick={(e) => handleFocusChange(e, folder.id)}
                    ref={ref}
                    style={{ width: `$${widthCard}px` }}
                    onDrop={(e) => handleDrop(e)}
                    onDragStart={(e) => { handleCollectionDragStart(e, folder?.parentId || "") }}
                    draggable={isDraggable()}
                    data-name={folder?.name || ""}
                  >
                    <FolderGridItem
                      {...folder}
                      isShare={isShare}
                      sharePath={sharePath}
                      toggleSelected={() => toggleSelected(folder.id)}
                      viewFolder={() => viewFolder(folder.id)}
                      deleteFolder={() => deleteFolder(folder.id)}
                      copySideLink={() => copyShareLink(folder)}
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
          <div
            id='asset-view'
            className={`${styles["assetWrapper"]} ${activeView === "list" && styles["list-wrapper"]
              }`}
            ref={elementsAssetContainerRef}
          >
            {!assetsHide && sortedAssets.length > 0 && (
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
                        id={assetItem.asset.id}
                        draggable={isDraggable()}
                        onDragStart={(e) => handleDragStart(e)}
                        onDragOver={(ev) => ev.preventDefault()}
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
      <ConfirmModal
        message={`Move 1 asset to ${droppableFolderName}`}
        modalIsOpen={moveModalFlag}
        closeModal={() => closeMoveModal()}
        confirmAction={moveReplaceAssets}
        confirmText={"Move"}
        subText="The assets will be moved into the new collection and will be removed from their current collection"
      />
    </>
  )
};
export default SubCollection;
