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
    setSidenavFolderList
  } = useContext(AssetContext);
  const [showDropdown, setShowDropdown] = useState(new Array(sidenavFolderList.length).fill(false));
  const {
    term,
  } = useContext(FilterContext);


  const toggleDropdown = (index: number) => {
    const updatedShowDropdown = [...showDropdown];
    updatedShowDropdown[index] = !updatedShowDropdown[index]; // Toggle dropdown on img click event
    setShowDropdown(updatedShowDropdown);
  };



  const getFolders = async (replace = true) => {
    try {

      const field = 'createdAt'
      const order = 'desc'

      const queryParams = {
        page: replace ? 1 : sidenavFolderNextPage,
        sortField: field,
        sortOrder: order,
      };
      const { data } = await folderApi.getFolders({
        ...queryParams,
        ...(term && { term }),
      });
      let collectionList = { ...data };
      setSidenavFolderList(collectionList, replace);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    }
  };

  useEffect(() => { getFolders(false) }, []);

  return (
    <div>
      {sidenavFolderList.map((item: Item, index: number) => {
        return (
          <>
            < div key={index} className={`${styles["flex"]} ${styles.nestedbox}`}>
            <img className={`${styles["rightIcon"]} ${styles.iconClick}`} src={Utilities.arrowBlue} onClick={() => toggleDropdown(index)} />
              <div className={styles.w100}>
                <div className={`${styles["dropdownMenu"]} ${styles.active}`}>
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
            </ div>
            {
              showDropdown[index] &&
              <div className={styles.folder}>
                <div className={styles.subfolderList}>
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
                            <span>City</span>
                          </div>
                        </div>
                        <div className={styles["list1-right-contents"]}>
                          <span>7</span>
                        </div>
                      </div>
                    </div>
                  </Draggable>
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
                            <span>Renaissance</span>
                          </div>
                        </div>
                        <div className={styles["list1-right-contents"]}>
                          <span>7</span>
                        </div>
                      </div>
                    </div>
                  </Draggable>
                  <div className={styles.dropdownOptions}>
                    <div className={styles["folder-lists"]}>
                      <div className={styles.dropdownIcons}>
                        <img className={styles.subfolder} src={Utilities.folder} />
                        <div className={styles["icon-descriptions"]}>
                          <span>Interior</span>
                        </div>
                      </div>
                      <div className={styles["list1-right-contents"]}>
                        <span>23</span>
                      </div>
                    </div>
                  </div>
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
                            <span>House</span>
                          </div>
                        </div>
                        <div className={styles["list1-right-contents"]}>
                          <span>29</span>
                        </div>
                      </div>
                    </div>
                  </Draggable>
                  <NestedButton>Add Subcollection</NestedButton>
                </div>
              </div>}
          </>
        )
      })}
      <span className={styles.loadbtn} onClick={() => { getFolders(false); }}>{"Load More"}</span>
      <div className={styles.loadmore}>
      <button className={styles.loaderbuttons}>
      <span className={styles.buttontext}>Load More</span>
      <div className={styles.loader}></div>
    </button>
    </div>

      <div className={styles.collection}>
      <NestedButton>Add collection</NestedButton>
      </div>
    </div >
  );
};

export default NestedSidenavDropdown;
