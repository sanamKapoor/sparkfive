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

  let foldersList: any = [];
  if (
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
  }

  const collAssetsCount = folderInfo?.sharedFolder?.assetsCount ? folderInfo.sharedFolder.assetsCount : 0;

  return (
    <>
      <div className={`${styles["shared-sidenav-outer"]}`}>
        <ReusableHeading
          customStyle={{ padding: "0px 23px 0px 23px" }}
          text={`${folderInfo?.folderName || ""}.`}
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
        <ReusableHeading
          description="All Collections"
          text="Collections"
          headingClickType="folders"
          headingTrue={activeSortFilter.mainFilter === "folders"}
          headingClick={headingClick}
          totalCount={collAssetsCount}
          icon={undefined}
        />
        <div className={styles["sidenavScroll"]} >
          <div className={styles["sidenav-list1"]}>
            {foldersList.length > 0 && (<ul>
              {foldersList?.map((item: Item, index: number) => (
                <li
                  key={index}
                  className={`${styles["list1-description"]} ${styles["border-bottom"]} ${item?.sidenavShowSelected ? styles["collection-list-active"] : ""}`}
                >
                  <div className={styles["list1-left-contents"]} onClick={() => viewFolder(item.id, true)}>
                    <div className={styles.icon}>
                      <img src={Utilities.folder} alt="" />
                    </div>
                    <div className={styles["icon-description"]}>
                      <span>{item.name}</span>
                    </div>
                  </div>
                  <div className={styles["list1-right-contents"]}>
                    <span>{item.assetsCount}</span>
                  </div>
                </li>
              ))}
            </ul>)}

          </div>
        </div>
      </div>
      <div>


      </div>

      {/* portals */}
      {/* <div className={`${styles["shared-sidenav-outer"]}`}>
        <div
          className={`${styles["collection-heading"]} ${styles["collection-heading-active"]}`}
        >
          <span>New collection(4)</span>
        </div>
        <div className={styles["sidenavScroll"]}>
          <div>
             <div className={`${styles["flex"]} ${styles.nestedbox}`}>
            <div className={styles.clickable}>
              <img className={styles.rightIcon} src={Utilities.arrowBlue} />
            </div>

            <div className={`${styles["dropdownMenu"]} ${styles.active}`}>
              <div className={styles.w100}>
                <div className={styles.mainWrapper}>
                  <div className={styles.flex}>
                    <img src={Utilities.folder} />
                    <div className={styles["icon-descriptions"]}>
                      <span>name</span>
                    </div>
                  </div>
                  <div className={styles.totalCount}>
                    <div className={styles["list1-right-contents"]}>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div className={styles.folder}>
            <div className={styles.subfolderList}>
              <>
                <Draggable
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
                          <span>name</span>
                        </div>
                      </div>
                      <div className={styles["list1-right-contents"]}>
                        <span>content</span>
                      </div>
                    </div>
                    
                  </div>
                </Draggable>
              </>
            </div>
          </div>

          </div>
         
        </div>
      </div> */}
    </>
  );
}
