import React, { useContext, useEffect, useState } from 'react';

import { Utilities } from '../../../assets';
import { AssetContext, FilterContext } from '../../../context';
import shareCollectionApi from '../../../server-api/share-collection';
import ReusableHeading from '../../nested-subcollection-sidenav/nested-heading';
import styles from './shared-nested-sidenav.module.css';

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
  childFolders?: any;
}
export default function SharedPageSidenav({ viewFolder, headingClick, sharePath }) {

  const {
    sidebarOpen,
    activeFolder,
    setSidebarOpen,
    activeSubFolders,
    sidenavFolderList,
    setSidenavFolderList,
    sidenavFolderNextPage,
    setSidenavFolderChildList,
    sidenavFolderChildList
  } = useContext(AssetContext);

  const { activeSortFilter, term
  } = useContext(FilterContext);

  const [firstLoaded, setFirstLoaded] = useState(false);
  const [isFolderLoading, SetIsFolderLoading] = useState(false);

  const [showDropdown, setShowDropdown] = useState(new Array(sidenavFolderList.length).fill(false));
  const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map());


  const getSubFolders = async (id: string, page: number, replace: boolean) => {
    setSubFolderLoadingState((map) => new Map(map.set(id, true)));
    const { field, order } = activeSortFilter.sort;
    const queryParams = {
      page: replace ? 1 : page,
      pageSize: 10,
      sortField: field,
      sortOrder: order,
      sharePath,
    };

    if (activeSortFilter.filterFolders?.length > 0) {
      // @ts-ignore
      queryParams.folders = activeSortFilter.filterFolders.map((item) => item.value).join(",");
    }

    const { data } = await shareCollectionApi.getSubFolders(
      {
        ...queryParams,
        ...(term && { term }),
      },
      id
    );
    setSidenavFolderChildList(data, id, replace);
    setSubFolderLoadingState((map) => new Map(map.set(id, false)));
    return sidenavFolderChildList;
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


  const toggleDropdown = async (index: number, item: Item, replace: boolean) => {
    const isDropdownOpen = showDropdown[index];
    if (!isDropdownOpen) {
      await getSubFolders(item.id, 1, replace);
    }
    setShowDropdown((prevShowDropdown) => {
      const updatedShowDropdown = [...prevShowDropdown];
      updatedShowDropdown[index] = !isDropdownOpen;
      return updatedShowDropdown;
    });
  };

  const getFolders = async (replace = true) => {
    try {
      SetIsFolderLoading(true);
      const { field, order } = activeSortFilter.sort;

      const queryParams = {
        page: replace ? 1 : sidenavFolderNextPage,
        sortField: field,
        sortOrder: order,
        sharePath,
      };

      if (activeSortFilter?.filterFolders?.length > 0) {
        queryParams.folders = activeSortFilter.filterFolders.map((item: any) => item.value).join(",");
      }
      const { data } = await shareCollectionApi.getFolders({
        ...queryParams,
        ...(term && { term }),
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

  // useEffect(() => {
  //   if (firstLoaded && activeSortFilter.mainFilter === "folders") {
  //     getFolders(true);
  //   }
  //   setFirstLoaded(true);
  // }, [activeSortFilter]);


  return (
    <>
      <div className={`${styles["shared-sidenav-outer"]}`}>
        <ReusableHeading
          customStyle={{ padding: "10px 23px 0px 23px", cursor: "pointer" }}
          text={`Collections`}
          headingClick={headingClick}
          icon={
            <img
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
              src={Utilities.toggleLight}
            />
          }
        />
        <div className={styles["sidenavScroll"]}>
          <div className={styles["sidenav-list1"]}>
            <ul>
              {sidenavFolderList.map((item: Item, index: number) => (
                <>
                  <div style={{ display: "flex", marginBottom: "4px" }}>
                    {item?.childFolders?.length > 0 ? (
                      <div className={styles.clickable} onClick={() => toggleDropdown(index, item, true)}>
                        <img
                          className={showDropdown[index] ? styles.iconClick : styles.rightIcon}
                          src={Utilities.caretRightSolid}
                        />
                      </div>
                    ) : (
                      <div className={styles.emptyBox}></div>
                    )}
                    <li
                      key={index}
                      className={`${styles["list1-description"]} ${styles["border-bottom"]} 
                      ${((item.id === activeSubFolders)) ? styles.active : ""}`}
                    >
                      <div
                        className={styles["list1-left-contents"]}
                        onClick={() => {
                          viewFolder(item?.id, true, "", item.name);
                        }}
                      >
                        <div className={styles.icon}>
                          <img src={Utilities.folder} alt="" />
                        </div>
                        <div className={styles["icon-description"]}>
                          <span title={item?.name}>{item?.name}</span>
                        </div>
                      </div>
                      <div className={styles["list1-right-contents"]}>
                        <span data-drag="false">{Number(item?.assetsCount || 0) + Number(item.totalchildassests || 0)}</span>
                      </div>
                    </li>
                  </div >
                  {/* {
                    showDropdown[index] && (
                      <div className={styles.folder}>
                        <div className={styles.subfolderList}>
                          {
                            <>
                              {sidenavFolderList.map((record: Item, recordIndex: number) => (
                                <div key={recordIndex}>
                                  <div className={styles.dropdownOptions}>
                                    <div
                                      className={`${styles["folder-lists"]} ${activeFolder === record.id ? styles.active : ""}`}
                                      onClick={() => {
                                        viewFolder(record.id, true);
                                        if (window.innerWidth < 767) {
                                          setSidebarOpen(false);
                                        }
                                      }}
                                    >
                                      <div className={styles.dropdownIcons}>
                                        <img className={styles.subfolder} src={Utilities.folder} />
                                        <div className={styles["icon-descriptions"]}>
                                          <span title={item.name}>{record.name}</span>
                                        </div>
                                      </div>
                                      <div className={styles["list1-right-contents"]}>
                                        <span>{record.assetsCount ?? 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          }
                        </div>
                      </div>
                    )
                  } */}


                  {showDropdown[index] && (
                    <div data-drag="false" className={`${styles["folder"]} `}>
                      <div data-drag="false" className={styles.subfolderList}>
                        {keyExists(item.id) && (
                          <>
                            {keyResultsFetch(item.id, "record").map((record: Item, recordIndex: number) => (
                              <div
                                key={recordIndex}
                                id={record.id}
                              >
                                <div
                                  data-drag="false"
                                  className={`${styles["dropdownOptions"]} ${activeFolder === record.id ? styles.active : ""
                                    }`}
                                >
                                  <div data-drag="false" className={`${styles["dropdownOptions"]} ${activeFolder === record.id ? styles.active : ""} `}>
                                    <div
                                      data-drag="false"
                                      className={styles["folder-lists"]}
                                      onClick={() => {
                                        viewFolder(record.id, false, item.id, record.name);
                                        if (window.innerWidth < 767) {
                                          setSidebarOpen(false);
                                        }
                                      }}
                                    // onClick={() => {
                                    //   vewFolderSidenavStateActive(record.id,
                                    //     false,
                                    //     item.id,
                                    //     record.name, record)
                                    // }}
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


                </>
              ))}
              {sidenavFolderNextPage >= 0 && (
                <div onClick={() => getFolders(false)}>
                  {isFolderLoading ? (
                    <div className={styles.loader}></div>
                  ) : (
                    <div className={`${styles["load-wrapper"]} `} style={{ marginLeft: "10px" }}>
                      <button className={styles.loadMore}>Load More</button>
                    </div>
                  )}
                </div>
              )
              }
            </ul >
          </div >
        </div >
      </div >
    </>
  );
}
