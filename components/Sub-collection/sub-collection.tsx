import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./sub-collection.module.css";
import { AppImg, Utilities } from "../../assets";
import Button from "../common/buttons/button";
import { AssetContext } from "../../context";
import FolderGridItem from "../common/folder/folder-grid-item";

const SubCollection = (
  {
    activeView = "grid",
    isShare = false,
    toggleSelected,
    mode = "assets",
    deleteFolder = (id: string) => { },
    viewFolder = (id: string) => { },
    sharePath = "",
    openFilter,
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
    LoadMore
  }: any) => {

  const [isChecked, setIsChecked] = useState(false);
  const [collectionHide, setCollectionHide] = useState(false);

  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };
  const handleHideClick = () => {
    setCollectionHide(!collectionHide);
  };

  const {
    setActiveSubFolders,
    subFoldersViewList: { results, next, total },
    setSubFoldersViewList
  } = useContext(AssetContext);


  const loadMoreCollection = () => {
    LoadMore(false)
  }
  useEffect(() => {
    return () => {
      setActiveSubFolders("")
      setSubFoldersViewList({ results: [], next: 0, total: 0 })
    }
  }, [])
  return (
    <>
      <div className={`${styles["sub-collection-heading"]}`}>
        <div className={styles.rightSide}>
          <span>Subcollection(4)</span>
          <img onClick={() => { handleHideClick() }} src={collectionHide ? Utilities.arrowDownUp : Utilities.downIcon} />
        </div>
        <div className={styles.tagOuter}>
          <div className={styles.left}>
            <div className={styles.TagsInfo}>
              <div
                className={`${styles.circle} ${isChecked ? styles.checked : ""
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
      {!collectionHide &&
        <>
          <div className={styles.cardsWrapper}>
            {results.map((folder, index) => {
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
                    openFilter={openFilter}
                    shareAssets={() =>
                      beginAssetOperation({ folder }, "shareFolders")
                    }
                    changeThumbnail={beginChangeThumbnailOperation}
                    deleteThumbnail={() =>
                      deleteThumbnail({ folder }, "shareFolders")
                    }
                    activeView={activeView || mode}
                    isThumbnailNameEditable={isThumbnailNameEditable}
                    focusedItem={focusedItem}
                    setFocusedItem={setFocusedItem}
                    folderType="SubCollection"
                  />
                </li>
              );
            })
            }
          </div >
          {next > 0 &&
            <div className={styles.LoadMorebtn}>
              <Button text="Load More" onClick={loadMoreCollection} type="button" className="container primary" />
            </div>
          }

        </>
      }
    </>
  );
};
export default SubCollection;
