import React, { useContext, useEffect, useRef, useState } from 'react';

import { Utilities } from '../../assets';
import { AssetContext, FilterContext, UserContext } from '../../context';
import assetApi from '../../server-api/asset';
import folderApi from '../../server-api/folder';
import toastUtils from '../../utils/toast';
import ConfirmModal from '../common/modals/confirm-modal';
import SpinnerOverlay from '../common/spinners/spinner-overlay';
import NestedButton from './button';
import ReusableHeading from './nested-heading';
import styles from './nested-sidenav-dropdown.module.css';

// import Draggable from 'react-draggable';

interface Asset {
  id: string;
  name: string;
  type: string;
  thumbailUrl: string;
  realUrl: string;
  extension: string;
  version: number;
}
interface Item {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sharePath: null;
  sharePassword: null;
  shareStatus: null;
  status: string;
  thumbnailPath: null;
  thumbnailExtension: null;
  thumbnails: null;
  thumbnailStorageId: null;
  thumbnailName: null;
  assetsCount: string;
  assets: Asset[];
  size: string;
  length: number;
  childFolders: Item[];
  totalchildassests?: string;
}
const AssetMoveCopyModal = ({
  modalIsOpen,
  closeModal,
  confirmAction,
  confirmText,
  subText,
  actionType,
  folderName
}) => {
  return (
    <ConfirmModal
      message={actionType === 'move' ? `Move 1 asset to ${folderName}` : `Copy 1 asset to ${folderName}`}
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      confirmAction={confirmAction}
      confirmText={confirmText}
      subText={subText}
    />
  );
};

const NestedSidenavDropdown = ({ headingClick, viewFolder }) => {

  const {
    sidenavTotalCollectionCount,
    sidenavFolderList,
    sidenavFolderNextPage,
    setSidenavFolderList,
    sidenavFolderChildList,
    setSidenavFolderChildList,
    listUpdateFlag,
    setListUpdateFlag,
    activeFolder,
    setSidebarOpen,
    activeSubFolders,
    setCurrentFolder,
    setSidenavTotalCollectionCount,
    assetDragFlag,
    assetDragId,
    assetDragType,
    setAssetDragFlag,
    setAssetDragId,
    setAssetDragType,
    droppableId,
    setDroppableId,
    setSubFoldersAssetsViewList,
    subFoldersAssetsViewList: { results: assets, next: nextAsset, total: totalAssets },
  } = useContext(AssetContext);

  const { activeSortFilter } = useContext(FilterContext) as {
    term: any;
    activeSortFilter: any;
  };

  const { user } = useContext(UserContext);

  const [showDropdownIds, setShowDropdownIds] = useState(new Array);
  const [showDropdown, setShowDropdown] = useState(new Array(sidenavFolderList.length).fill(false));

  const [firstLoaded, setFirstLoaded] = useState(false);
  const [isFolderLoading, SetIsFolderLoading] = useState(false);
  const [subFoldersParentId, setSubFoldersParentId] = useState(new Map());
  const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map());
  const [moveModalFlag, setMoveModalFlag] = useState(false);
  const [assetModalFlag, setAssetModalFlag] = useState(false);
  const [actionType, setActionType] = useState("")
  const [loader, setLoader] = useState(false);
  const [droppableFolderName, setDroppableFolderName] = useState("")
  const childFolderId = useRef("");
  const draggable = useRef(false);
  const selectedParentId = useRef("")

  const getSubFolders = async (id: string, page: number, replace: boolean) => {
    setSubFolderLoadingState((map) => new Map(map.set(id, true)));
    const { field, order } = activeSortFilter.sort;
    const queryParams = {
      page: replace ? 1 : page,
      pageSize: 10,
      sortField: field,
      sortOrder: order,
    };
    const { data } = await folderApi.getSubFolders(
      {
        ...queryParams,
      },
      id,
    );
    setSubFoldersParentId((prev) => {
      data?.results.forEach((item) => {
        prev.set(item.id, id);
      });
      return prev;
    });
    setSidenavFolderChildList(data, id, replace);
    setSubFolderLoadingState((map) => new Map(map.set(id, false)));
    return sidenavFolderChildList;
  };

  const toggleDropdown = async (index: number, item: Item, replace: boolean) => {
    const isDropdownOpen = showDropdown[index];

    if (!isDropdownOpen) {
      await getSubFolders(item.id, 1, replace);
      setShowDropdownIds((prevIds) => [...prevIds, item.id]);
    } else {
      setShowDropdownIds((prevIds) => prevIds.filter((id) => id !== item.id));
    }

    setShowDropdown((prevShowDropdown) => {
      const updatedShowDropdown = [...prevShowDropdown];
      updatedShowDropdown[index] = !isDropdownOpen;
      return updatedShowDropdown;
    });
  };

  const keyExists = (key: string) => {
    return sidenavFolderChildList.has(key);
  };

  const keyResultsFetch = (key: string, type: string) => {
    const { results, next } = sidenavFolderChildList.get(key);
    if (type === "record") {
      return results || [];
    }
    return next;
  };

  const getFolders = async (replace = true) => {
    try {
      SetIsFolderLoading(true);
      const { field, order } = activeSortFilter.sort;
      const queryParams: {
        page: number;
        sortField: string;
        sortOrder: string;
        folders?: string[];
      } = {
        page: replace ? 1 : sidenavFolderNextPage,
        sortField: field,
        sortOrder: order,
      };
      if (activeSortFilter?.filterFolders?.length > 0) {
        queryParams.folders = activeSortFilter.filterFolders.map((item: any) => item.value).join(",");
      }
      const { data } = await folderApi.getFolders({
        ...queryParams,
      });
      let collectionList = { ...data };
      setSidenavFolderList(collectionList, replace);
      SetIsFolderLoading(false);
    } catch (err) {
      //TODO: Handle error
      SetIsFolderLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    setSidenavTotalCollectionCount(0)
  }, []);

  useEffect(() => {
    if (firstLoaded) {
      getFolders(true);
    }
    setFirstLoaded(true);
  }, [firstLoaded]);

  useEffect(() => {
    if (firstLoaded && activeSortFilter.mainFilter === "folders") {
      getFolders(true);
    }
    setFirstLoaded(true);
  }, [activeSortFilter]);

  const getFoldersOnUpdate = async () => {
    if (listUpdateFlag) {
      setListUpdateFlag(false);
      setShowDropdown(new Array(sidenavFolderList.length).fill(false))
      await getFolders(true);
      Promise.all(showDropdownIds.map(async (item) => {
        await getSubFolders(item, 1, true);
      }))
      if (
        activeSortFilter.mainFilter !== "SubCollectionView" &&
        activeSortFilter.mainFilter !== "folders" &&
        activeFolder !== ""
      ) {
        if (subFoldersParentId.has(activeFolder)) {
          const data = subFoldersParentId.get(activeFolder);
          getSubFolders(data, 1, true);
        }
      } else if (activeSortFilter.mainFilter === "SubCollectionView" && activeSubFolders !== "") {
        if (Array.from(subFoldersParentId.values()).includes(activeSubFolders)) {
          await getSubFolders(activeSubFolders, 1, true);

        }
      }
    }
  };

  useEffect(() => {
    getFoldersOnUpdate();
  }, [listUpdateFlag]);

  const vewFolderSidenavStateActive = (recordId: string, isParentCollection: boolean, parentId: string, parentName: string, folder?: any) => {
    viewFolder(
      recordId,
      isParentCollection,
      parentId,
      parentName
    );
    setCurrentFolder(folder)
    if (window.innerWidth < 767) {
      setSidebarOpen(false);
    }
  };

  const isAdmin = () => {
    return user?.role?.id === "admin" || user?.role?.id === "super_admin";
  };

  const isMouseWithinDroppableArea = (id: string, e: React.DragEvent<HTMLDivElement>) => {
    const droppableArea = document.getElementById(id);
    if (droppableArea) {
      const rect = droppableArea.getBoundingClientRect();
      const boundingArea = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      return boundingArea;
    }
    return false;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, parentId: string, shouldDrag: boolean) => {
    draggable.current = shouldDrag;
    selectedParentId.current = parentId;
    childFolderId.current = e.currentTarget.id;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (assetDragFlag && droppableId !== e.currentTarget.id) {// asset drop from sub-collection page and asset page drop handling state from main page
      setDroppableId(e.currentTarget.id)
      setDroppableFolderName(e?.currentTarget?.dataset?.name || "...")
    } else {
      if (droppableId !== e.currentTarget.id  // Checking the Id droppable Is not same 
        && childFolderId.current !== e.currentTarget.id // Checking the selected folder is not same as droppable identifier
        && draggable.current // Check if the droppable is active or not if its parent with no child folder or is child folder
        && !e?.currentTarget?.dataset?.parentid // Check if the droppable folder is  parent or not
        && e.currentTarget.id !== selectedParentId.current // Check if the droppable folder is not same as selected folder parentId 
      ) {
        if (isMouseWithinDroppableArea(e.currentTarget.id, e)) {
          setDroppableId(e.currentTarget.id as string);
        }
      } else if ((e?.currentTarget?.dataset?.parentid && droppableId !== e.currentTarget.id) || (childFolderId.current === e.currentTarget.id)) {
        setDroppableId("")
      }
    }
  }

  const resetMoveModalState = () => {
    childFolderId.current = "";
    selectedParentId.current = "";
    setDroppableId("");
    setMoveModalFlag(false);
    setLoader(false);
  };

  const resetAssetModalState = () => {
    setLoader(false);
    setAssetModalFlag(false);// for move asset modal state
    setAssetDragFlag(false);// Global state for start the dragging in side nav
    setAssetDragId("");// Global state for saving the asset Id 
    setAssetDragType(""); // For drag type either for move or copy
    setDroppableId("");
    setActionType("")
    setDroppableFolderName("")
  };

  const moveCollectionSuccess = () => {
    resetMoveModalState();
    setListUpdateFlag(true);
    toastUtils.success("Collection successfully moved");
  };

  const moveCollectionError = (errorMessage) => {
    resetMoveModalState();
    resetAssetModalState()
    toastUtils.error(errorMessage);
  };

  const handleDragEnd = () => {
    if (isAdmin()) {
      if (droppableId && childFolderId.current && droppableId !== childFolderId.current) {
        setMoveModalFlag(true);
      } else if (!droppableId && draggable.current) {
        moveCollectionError("You can't move collection into a subcollection");
      } else if (!draggable.current) {
        moveCollectionError("You can't move collection with a sub-collection");
      }
    }
  };

  const moveCollection = async () => {
    try {
      setLoader(true);
      await folderApi.updateParent({
        parentId: droppableId,
        folderId: childFolderId.current,
      });
      moveCollectionSuccess();
    } catch (err) {
      moveCollectionError("You can't move collection. Please try again later");
    }
  };

  const closeMoveModal = () => {
    resetMoveModalState();
    resetAssetModalState();
    setActionType("");
  };
  //--------------Asset drop ------ handling--------------------------------//

  // For assets drop only
  const handleDrop = (e) => {
    if (isAdmin() && assetDragFlag) {
      if (assetDragId && droppableId) {
        setAssetModalFlag(true);
        setActionType((assetDragType === 'move' || activeFolder !== "") ? 'move' : 'copy');
      } else {
        moveCollectionError('Could not move/copy assets, please try again later.');
      }
    }
  };

  const moveReplaceAssets = async () => {
    const dragType = (assetDragType === 'move' || activeFolder !== "") ? 'move' : 'copy'
    try {
      const moveAssetIds = [assetDragId];
      const parentFolderIds = [droppableId];
      const apiFunction = (assetDragType === 'move' || activeFolder !== "") ? assetApi.moveAssets : assetApi.copyAssets;
      await apiFunction({ idList: moveAssetIds, folderId: parentFolderIds }, {});
      setListUpdateFlag(true);
      if (assetDragType === 'move') {
        removeSelectedFromList(); // Resetting all state here
      }
      resetAssetModalState();
      toastUtils.success(`Assets ${dragType} successfully`);
    } catch (err) {
      handleMoveError(
        err,
        `Could not ${dragType} assets, please try again later.`
      );
    }
  };

  const removeSelectedFromList = () => {
    const newAssets = assets.filter((existingAsset) => {
      return existingAsset?.asset?.id !== assetDragId
    });
    setSubFoldersAssetsViewList({
      next: nextAsset,
      total: totalAssets,
      results: [...newAssets],
    });

  };

  const handleMoveError = (err: Error, errorMessage: string) => {
    resetAssetModalState();
    if (err.response?.status === 402) {
      toastUtils.error(err.response.data.message);
    } else {
      toastUtils.error(errorMessage);
    }
  };
  //--------------------------------- Drag Asset End --------------------------------//

  return (
    <div data-drag="false">
      {loader && <SpinnerOverlay />}
      <AssetMoveCopyModal
        modalIsOpen={assetModalFlag}
        closeModal={closeMoveModal}
        confirmAction={moveReplaceAssets}
        confirmText={(assetDragType === 'move' || activeFolder !== "") ? 'Move' : 'Copy'}
        subText={
          (assetDragType === 'move' || activeFolder !== "")
            ? 'The assets will be moved into the new collection(s) and will be removed from their current collection(s)'
            : 'The assets will be duplicated and added into the new collection'
        }
        actionType={actionType}
        folderName={droppableFolderName}
      />
      <ConfirmModal
        message={"Make Collection a Subcollection"}
        modalIsOpen={moveModalFlag}
        closeModal={() => closeMoveModal()}
        confirmAction={moveCollection}
        confirmText={"Make Subcollection"}
        subText="The selected collection will be moved from its current location and made a subcollection of the selected parent collection"
      />
      <ReusableHeading
        description="All Collections"
        text="All Collections"
        headingClickType="folders"
        headingTrue={activeSortFilter.mainFilter === "folders"}
        headingClick={headingClick}
        totalCount={sidenavTotalCollectionCount}
        icon={undefined}
        customStyle={{ cursor: "pointer" }}
        fontSize="13px"
      />

      {sidenavFolderList.map((item: Item, index: number) => {
        return (
          <>
            <div>
              <div data-drag="false" key={index} className={`${styles["flex"]} ${item.id === droppableId ? styles.dropBox : ""}  ${styles.nestedbox} `}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, "", item?.childFolders?.length > 0 ? false : true)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e)}
                id={item.id}
                onDrop={(e) => { handleDrop(e) }}
                data-name={item.name}
              >
                {item?.childFolders?.length > 0 ? (
                  <div data-drag="false" className={styles.clickable} onClick={() => toggleDropdown(index, item, true)}>
                    <img
                      data-drag="false"
                      className={showDropdown[index] ? styles.iconClick : styles.rightIcon}
                      src={Utilities.caretRightSolid}
                    />
                  </div>
                ) : (
                  <div data-drag="false" className={styles.emptyBox}></div>
                )}
                <div
                  className={`${styles["dropdownMenu"]} ${((item.id === activeSubFolders)) ? styles.active : ""} ${item?.childFolders?.length === 0 ? styles.noIconMargin : ""
                    } `} data-drag="false"
                >
                  <div
                    className={styles.w100}
                    onClick={() => {
                      vewFolderSidenavStateActive(item.id, true, "", item.name, item)
                    }} data-drag="false"
                  >
                    <div className={styles.mainWrapper} data-drag="false">
                      <div className={styles.flex} data-drag="false">
                        <img src={Utilities.foldernew} data-drag="false" />
                        <div className={styles["icon-descriptions"]}>
                          <span data-drag="false" title={JSON.stringify(item.name)}>{item.name}</span>
                        </div>
                      </div>
                      <div data-drag="false" className={styles.totalCount}>
                        <div data-drag="false" className={styles["list1-right-contents"]}>
                          <span data-drag="false">{Number(item?.assetsCount || 0) + Number(item.totalchildassests || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-drag="false" className={styles.abc}>{<NestedButton type={"subCollection"} parentId={item.id} />}</div>
                </div>
              </div>
              {showDropdown[index] && (
                <div data-drag="false" className={`${styles["folder"]} `}>
                  <div data-drag="false" className={styles.subfolderList}>
                    {keyExists(item.id) && (
                      <>
                        {keyResultsFetch(item.id, "record").map((record: Item, recordIndex: number) => (
                          <div
                            key={recordIndex}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id, true)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e)}
                            id={record.id}
                            data-parentId={item.id}
                            onDrop={(e) => { handleDrop(e) }}
                            data-name={record.name}
                          >
                            <div
                              data-drag="false"
                              className={`${styles["dropdownOptions"]} ${activeFolder === record.id ? styles.active : ""
                                } ${record.id === droppableId ? styles.dropBox : ""} `}
                            >
                              <div data-drag="false" className={`${styles["dropdownOptions"]} ${activeFolder === record.id ? styles.active : ""} `}>
                                <div
                                  data-drag="false"
                                  className={styles["folder-lists"]}
                                  onClick={() => {
                                    vewFolderSidenavStateActive(record.id,
                                      false,
                                      item.id,
                                      record.name, record)
                                  }}
                                >
                                  <div data-drag="false" className={styles.dropdownIcons}>
                                    <img
                                      data-drag="false"
                                      className={styles.subfolder}
                                      src={Utilities.folder}
                                    />
                                    <div data-drag="false" className={styles["icon-descriptions"]}>
                                      <span data-drag="false">{record.name}</span>
                                    </div>
                                  </div>
                                  <div data-drag="false" className={styles["list1-right-contents"]}>
                                    <span data-drag="false">{record.assetsCount ?? 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {keyResultsFetch(item.id, "next") >= 0 && (
                          <div
                            className={`${styles["load-wrapper"]} `}
                            onClick={() => {
                              getSubFolders(item.id, keyResultsFetch(item.id, "next"), false);
                            }}
                          >
                            {subFolderLoadingState.get(item.id) ? (
                              <span style={{ color: "#10BDA5" }}>Loading...</span>
                            ) : (
                              <>
                                {/* <IconClickable additionalClass={styles.loadIcon} src={Utilities.load} /> */}
                                <button className={`${styles["loadMore"]} `}>Load More</button>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div >
                </div >
              )}
            </div>
          </>
        );
      })}

      {sidenavFolderNextPage >= 0 && (
        <div onClick={() => getFolders(false)}>
          {isFolderLoading ? (
            <div className={styles.loader}></div>
          ) : (
            <div className={`${styles["load-wrapper"]} `} style={{ marginLeft: "10px" }}>
              {/* <IconClickable additionalClass={styles.loadIcon} SVGElement={Utilities.load}  /> */}
              <button className={styles.loadMore}>Load More</button>
            </div>
          )}
        </div>
      )}
    </div >
  );
};

export default NestedSidenavDropdown;