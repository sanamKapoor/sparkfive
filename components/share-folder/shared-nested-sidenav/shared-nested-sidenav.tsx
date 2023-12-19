import React, { useContext, useState } from "react";
import styles from "./shared-nested-sidenav.module.css";
import { Utilities } from "../../../assets";
import Draggable from "react-draggable";
import IconClickable from "../../common/buttons/icon-clickable";
import NestedButton from "../../nested-subcollection-sidenav/button";
import { AssetContext, ShareContext, FilterContext } from "../../../context";
import ReusableHeading from "../../nested-subcollection-sidenav/nested-heading";

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
  childFolders?: any
}
export default function SharedPageSidenav({ sidenavFolderList, viewFolder, headingClick, parentFolders }) {
  const { folderInfo } = useContext(ShareContext);
  const {
    folders,
    activeSubFolders,
    activeFolder,
    setSidebarOpen,
    sidebarOpen
  } = useContext(AssetContext);
  const { activeSortFilter } = useContext(FilterContext)

  const [showDropdown, setShowDropdown] = useState(
    new Array(parentFolders.length).fill(false)
  );
  let foldersList: any = [];
  if (parentFolders.length > 0) {
    foldersList = parentFolders
  } else if (
    activeSortFilter.mainFilter === "SubCollectionView" &&
    activeSubFolders !== ""
  ) {
    foldersList = sidenavFolderList
  } else if (!Boolean(folderInfo?.singleSharedCollectionId)) {
    foldersList = folders
  } else if (Boolean(folderInfo?.singleSharedCollectionId)) {
    foldersList = sidenavFolderList
  }
  if (activeFolder) {
    foldersList = foldersList.map((item) => {
      if (item.id === activeFolder) {
        return { ...item, sidenavShowSelected: true };
      }
      return item;
    });
    sidenavFolderList = sidenavFolderList.map((item) => {
      if (item.id === activeFolder) {
        return { ...item, sidenavShowSelected: true };
      }
      return item;
    });
  }

  // const collAssetsCount = folderInfo?.sharedFolder?.assetsCount ? folderInfo.sharedFolder.assetsCount : 0;

  const toggleDropdown = async (
    index: number,
  ) => {
    const updatedShowDropdown = [...showDropdown];
    updatedShowDropdown[index] = !updatedShowDropdown[index]; //Toggle dropdown on img click event
    setShowDropdown(updatedShowDropdown);
  };
  return (
    <>
      <div className={`${styles["shared-sidenav-outer"]}`}>
        <ReusableHeading
          customStyle={{ padding: "10px 23px 0px 23px" }}
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
        <div className={styles["sidenavScroll"]} >
          <div className={styles["sidenav-list1"]}>
            {foldersList.length > 0 && (<ul>
              {foldersList?.map((item: Item, index: number) => (
                <>
                  <div style={{ display: 'flex',marginBottom:'4px' }}>

                    {item?.childFolders?.length > 0 ?
                      (<div className={styles.clickable}
                        onClick={() => toggleDropdown(index, item, true)}
                      >
                        <img className={
                          showDropdown[index]
                            ? styles.iconClick : styles.rightIcon} src={Utilities.caretRightSolid} />

                      </div>)
                      :
                      <div className={styles.emptyBox}></div>
                    }

                    {/*                  
                  <li
                    key={index}
                    className={`${styles["list1-description"]} ${styles["border-bottom"]} ${item?.sidenavShowSelected ? styles["collection-list-active"] : ""}`}
                  > */}
                    <li
                      key={index}
                      className={`${styles["list1-description"]} ${styles["border-bottom"]} ${item?.sidenavShowSelected ? styles.activeDropdown : parentFolders.length > 0 ? styles.activeDropdown : ""
                        }`}
                    >
                      <div className={styles["list1-left-contents"]} onClick={() => {
                        if (!item?.parentId) {
                          viewFolder()
                        } else {
                          viewFolder(item.id, true)
                        }
                      }}>
                        <div className={styles.icon}>
                          <img src={Utilities.folder} alt="" />
                        </div>
                        <div className={styles["icon-description"]}>
                          <span title={item.name}>{item.name}</span>
                        </div>
                      </div>
                      <div className={styles["list1-right-contents"]}>
                        <span>{item.assetsCount}</span>
                      </div>
                    </li>
                  </div>

                  {showDropdown[index] && (
                    <div className={styles.folder}>
                      <div className={styles.subfolderList}>
                        {
                          (
                            <>
                              {sidenavFolderList.map(
                                (record: Item, recordIndex: number) => (
                                  <div
                                    key={recordIndex}
                                  >
                                    <div className={styles.dropdownOptions}>
                                      <div

                                        className={`${styles["folder-lists"]} ${record?.sidenavShowSelected ? styles.activeDropdown : ""}`}
                                        onClick={() => {
                                          viewFolder(record.id, true)
                                          if (window.innerWidth < 767) {
                                            setSidebarOpen(false)
                                          }
                                        }
                                        }
                                      >
                                        <div className={styles.dropdownIcons}>
                                          <img
                                            className={styles.subfolder}
                                            src={Utilities.folder}
                                          />
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
                                )
                              )}
                            </>
                          )}
                      </div>
                    </div >
                  )}
                </>
              ))}
            </ul>)}
          </div>
        </div>
      </div >
      <div>
      </div>
    </>
  );
}
