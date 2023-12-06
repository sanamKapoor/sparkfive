import React, { useContext, useEffect, useState } from "react";

import Draggable from "react-draggable";
import { Utilities } from "../../assets";
import { AssetContext, FilterContext } from "../../context";
import NestedButton from "./button";
import styles from "./nested-sidenav-dropdown.module.css";

import folderApi from "../../server-api/folder";
import IconClickable from "../common/buttons/icon-clickable";
import ReusableHeading from "./nested-heading";

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
  totalchildassests?: string
}

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
  } = useContext(AssetContext);

  const { term, activeSortFilter } = useContext(FilterContext) as {
    term: any;
    activeSortFilter: any;
  };

  const [showDropdown, setShowDropdown] = useState(
    new Array(sidenavFolderList.length).fill(false)
  );
  const [isFolderLoading, SetIsFolderLoading] = useState(false);
  const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map());
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [subFoldersParentId, setSubFoldersParentId] = useState(new Map())


  const getSubFolders = async (id: string, page: number, replace: boolean) => {
    setSubFolderLoadingState((map) => new Map(map.set(id, true)))
    const { field, order } = activeSortFilter.sort;
    const queryParams = {
      page: replace ? 1 : page,
      pageSize: 10,
      sortField: field,
      sortOrder: order,
    };
    const { data } = await folderApi.getSubFolders({
      ...queryParams,
    }, id);
    setSubFoldersParentId((prev) => {
      data?.results.forEach((item) => {
        prev.set(item.id, id);
      })
      return prev
    })

    setSidenavFolderChildList(data,
      id,
      replace
    )
    setSubFolderLoadingState((map) => new Map(map.set(id, false)))
    return sidenavFolderChildList;
  };

  const toggleDropdown = async (
    index: number,
    item: Item,
    replace: boolean
  ) => {
    if (!showDropdown[index]) {
      await getSubFolders(item.id, 1, replace);
    }
    const updatedShowDropdown = [...showDropdown];
    updatedShowDropdown[index] = !updatedShowDropdown[index]; //Toggle dropdown on img click event
    setShowDropdown(updatedShowDropdown);
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
        queryParams.folders = activeSortFilter.filterFolders
          .map((item: any) => item.value)
          .join(",");
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
      await getFolders(true);
      if (activeSortFilter.mainFilter !== "SubCollectionView" && activeSortFilter.mainFilter !== "folders" && activeFolder !== "") {
        if (subFoldersParentId.has(activeFolder)) {
          const data = subFoldersParentId.get(activeFolder)
          getSubFolders(data, 1, true);
        }
      }
    }
  }

  useEffect(() => {
    getFoldersOnUpdate()
  }, [listUpdateFlag]);


  const vewFolderSidenavStateActive = (recordId: string, isParentCollection: boolean, parentId: string, parentName: string) => {
    viewFolder(
      recordId,
      isParentCollection,
      parentId,
      parentName
    );
    if (window.innerWidth < 767) {
      setSidebarOpen(false)
    }
    // if (!parentId) {
    //   setSidenavFolderList({
    //     results: [
    //       ...sidenavFolderList.map((folder: any) => {
    //         if (folder.id === recordId) {
    //           folder['currentSelected'] = true
    //         }
    //         return folder
    //       }),
    //     ],
    //   });
    // }

  }

  return (
    <div>
      <ReusableHeading
        description="All Collections"
        text="All Collections"
        headingClickType="folders"
        headingTrue={activeSortFilter.mainFilter === "folders"}
        headingClick={headingClick}
        totalCount={sidenavTotalCollectionCount}
        icon={undefined}
        customStyle={{ cursor: 'pointer' }}
        fontSize='13px'

      />
      {sidenavFolderList.map((item: Item, index: number) => {
        return (
          <>
            <div key={index} className={`${styles["flex"]} ${styles.nestedbox}`}>
              {item?.childFolders?.length > 0 ?
                (<div className={styles.clickable} onClick={() => toggleDropdown(index, item, true)}>
                  <img className={showDropdown[index] ? styles.iconClick : styles.rightIcon} src={Utilities.caretRightSolid} />

                </div>)
                :
                <div className={styles.emptyBox}></div>
              }
              <div
                className={`${styles["dropdownMenu"]} ${(showDropdown[index] || (item.id === activeSubFolders)) ? styles.active : ""
                  }`}
              >
                <div
                  className={styles.w100}
                  onClick={() => {
                    vewFolderSidenavStateActive(item.id, true, "", item.name)
                  }}
                >
                  <div className={styles.mainWrapper}>
                    <div className={styles.flex}>
                      <img src={Utilities.foldernew} />
                      <div className={styles["icon-descriptions"]}>
                        <span title={JSON.stringify(item.name)}>
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className={styles.totalCount}>
                      <div className={styles["list1-right-contents"]}>
                        <span>{Number(item.assetsCount) + Number(item.totalchildassests)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.abc}>
                  {showDropdown[index] && <NestedButton type={"subCollection"} parentId={item.id} />}
                </div>
              </div>
            </div>
            {showDropdown[index] && (
              <div className={styles.folder}>
                <div className={styles.subfolderList}>
                  {keyExists(item.id) && (
                    <>
                      {keyResultsFetch(item.id, "record").map(
                        (record: Item, recordIndex: number) => (
                          <Draggable
                            key={recordIndex}
                            axis="both"
                            defaultPosition={{ x: 0, y: 0 }}
                            grid={[25, 25]}
                            scale={1}
                          >
                            <div className={`${styles["dropdownOptions"]} ${activeFolder === record.id ? styles.active : ""}`}>
                              <div
                                className={styles["folder-lists"]}
                                onClick={() => {
                                  vewFolderSidenavStateActive(record.id,
                                    false,
                                    item.id,
                                    record.name)
                                }
                                }
                              >
                                <div className={styles.dropdownIcons}>
                                  <img
                                    className={styles.subfolder}
                                    src={Utilities.folder}
                                  />
                                  <div className={styles["icon-descriptions"]}>
                                    <span>{record.name}</span>
                                  </div>
                                </div>
                                <div className={styles["list1-right-contents"]}>
                                  <span>{record.assetsCount ?? 0}</span>
                                </div>
                              </div>
                            </div>
                          </Draggable>
                        )
                      )}
                      {keyResultsFetch(item.id, "next") >= 0 && (
                        <div
                          className={`${styles["load-wrapper"]}`}
                          onClick={() => {
                            getSubFolders(
                              item.id,
                              keyResultsFetch(item.id, "next"),
                              false
                            );
                          }}
                        >
                          {subFolderLoadingState.get(item.id) ? (
                            <span style={{ color: "#10BDA5" }}>Loading...</span>
                          ) : (
                            <>
                              <IconClickable
                                additionalClass={styles.loadIcon}
                                src={Utilities.load}
                              />
                              <button className={`${styles["loadMore"]}`}>
                                Load More
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div >
            )}
          </>
        );
      })}
      {
        sidenavFolderNextPage >= 0 && (
          <div onClick={() => getFolders(false)}>
            {isFolderLoading ? (
              <div className={styles.loader}></div>
            ) : (
              <div className={`${styles["load-wrapper"]}`}>
                <IconClickable
                  additionalClass={styles.loadIcon}
                  src={Utilities.load}
                />
                <button className={styles.loadMore}>Load More</button>
              </div>
            )}
          </div>
        )
      }
    </div >
  );
};

export default NestedSidenavDropdown;
