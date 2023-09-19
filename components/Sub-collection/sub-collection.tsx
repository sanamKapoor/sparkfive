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
    handleFocusChange
  }: any) => {

  const [isChecked, setIsChecked] = useState(false);

  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };

  const {
    subFoldersViewList: { results, next, total },
  } = useContext(AssetContext);


  return (
    <>
      <div className={`${styles["sub-collection-heading"]}`}>
        <div className={styles.rightSide}>
          <span>Subcollection(4)</span>
          <img src={Utilities.downIcon} />
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
      <div className={styles.cardsWrapper}>


        {results.map((item) => {
          return (
            <div>
              <div className={styles.subcollectionCard}>
                <div className={styles.imageGrid}>
                  <div className={styles.image}>
                    <img src={AppImg.abstraction1} />
                  </div>
                  <div className={styles.image}>
                    <img src={AppImg.abstraction2} />
                  </div>
                  <div className={styles.image}>
                    <img src={AppImg.abstraction3} />
                  </div>
                  <div className={styles.image}>
                    <img src={AppImg.abstraction4} />
                  </div>
                </div>


                <div className={styles["image-button-wrapper"]}>
                  <Button
                    className="container primary"
                    text={"View Collection"}
                    type={"button"}
                  />
                </div>

              </div>

              <div className={styles.cardFooter}>
                <div>
                  <span className={styles.heading}>House</span>
                  <span className={styles.totalCount}>7 Assets</span>
                </div>
                <div>
                  <img src={Utilities.horizontalDots} />
                </div>
              </div>
            </div>
          )
        })}
        {/* {results.map((folder, index) => {
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
        } */}



      </div >
    </>
  );
};
export default SubCollection;
