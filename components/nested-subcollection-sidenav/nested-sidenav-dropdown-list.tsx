import React, { useContext, useEffect, useState } from 'react';

import { Utilities } from '../../assets';
import NestedButton from './button';
import styles from './nested-sidenav-dropdown.module.css';
import Draggable from "react-draggable";
import { AssetContext, FilterContext } from '../../context';

import folderApi from '../../server-api/folder';


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
}

const NestedSidenavDropdown = () => {

  const {
    sidenavFolderList,
    sidenavFolderNextPage,
    setSidenavFolderList,
    sidenavFolderChildList,
    setSidenavFolderChildList
  } = useContext(AssetContext);

  const {
    term,
    activeSortFilter
  } = useContext(FilterContext) as { term: any, activeSortFilter: any };
  const [showDropdown, setShowDropdown] = useState(new Array(sidenavFolderList.length).fill(false));
  const [isFolderLoading, SetIsFolderLoading] = useState(false)
  const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map())
  const [firstLoaded, setFirstLoaded] = useState(false);

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

    setSidenavFolderChildList(data,
      id,
      replace
    )

    setSubFolderLoadingState((map) => new Map(map.set(id, false)))

    return sidenavFolderChildList;
  }

  const toggleDropdown = async (index: number, item: Item, replace: boolean) => {
    if (!showDropdown[index]) {
      await getSubFolders(item.id, 1, replace);
    }
    const updatedShowDropdown = [...showDropdown];
    updatedShowDropdown[index] = !updatedShowDropdown[index]; // Toggle dropdown on img click event
    setShowDropdown(updatedShowDropdown);
  };

  const keyExists = (key: string) => {
    return sidenavFolderChildList.has(key);
  };

  const keyResultsFetch = (key: string, type: string) => {
    const { results, next } = sidenavFolderChildList.get(key);
    if (type === 'record') {
      return results || []
    }
    return next
  };

  const getFolders = async (replace = true) => {
    try {
      SetIsFolderLoading(true);
      const { field, order } = activeSortFilter.sort;
      const queryParams: {
        page: number,
        sortField: string,
        sortOrder: string,
        folders?: string[]

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
      if (activeSortFilter.mainFilter === "folders") {
        getFolders(true);
      }
    }
    setFirstLoaded(true)
  }, [activeSortFilter]);

  return (
    <div>
      {sidenavFolderList.map((item: Item, index: number) => {
        return (
          <>
            <div key={index} className={`${styles["flex"]} ${styles.nestedbox}`}
              onClick={() => toggleDropdown(index, item, true)}
            >
              <img className={showDropdown[index] ? styles.iconClick : styles.rightIcon} src={Utilities.arrowBlue} onClick={() => toggleDropdown(index, item, true)} />
              <div className={styles.w100}>
                <div className={`${styles["dropdownMenu"]} ${showDropdown[index] ? styles.active : ""}`} >
                  <div className={styles.flex}>
                    <img src={Utilities.folder} />
                    <div className={styles["icon-descriptions"]}>
                      <span>{item.name}</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles["list1-right-contents"]}>
                      <span>{item.assetsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showDropdown[index] && (
              <div className={styles.folder}>
                <div className={styles.subfolderList}>
                  {keyExists(item.id) &&
                    <>
                      {keyResultsFetch(item.id, "record").map((record: Item, recordIndex: number) => (
                        <Draggable
                          key={recordIndex}
                          axis="both"
                          defaultPosition={{ x: 0, y: 0 }}
                          grid={[25, 25]}
                          scale={1}
                        >
                          <div className={styles.dropdownOptions}>
                            <div className={styles["folder-lists"]}>
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
                                <span>{record.assets.length}</span>
                              </div>
                            </div>
                          </div>
                        </Draggable>
                      ))}
                      {
                        keyResultsFetch(item.id, "next") >= 0 &&
                        <span className={styles.desc} onClick={() => { getSubFolders(item.id, keyResultsFetch(item.id, "next"), false); }}
                          style={{ cursor: "pointer" }}>
                          {
                            subFolderLoadingState.get(item.id)
                              ?
                              "Loading..."
                              :
                              "Load More"
                          }
                        </span>
                      }
                    </>
                  }
                  <NestedButton type={"subCollection"} parentId={item.id}>
                    Add Subcollection
                  </NestedButton>
                </div>
              </div>
            )}
          </>
        );
      })}
      {
        (sidenavFolderNextPage >= 0) &&
        <div className={styles.loadmore}>
          <button className={styles.loaderbuttons} onClick={() => getFolders(false)} disabled={isFolderLoading}>
            {isFolderLoading ?
              <div className={styles.loader}></div>
              :
              <span className={styles.buttontext}>Load More</span>
            }
          </button>
        </div>
      }
      <div className={styles.collection}>
        <NestedButton type={"collection"}>Add collection</NestedButton>
      </div>
    </div >
  );
};

export default NestedSidenavDropdown;