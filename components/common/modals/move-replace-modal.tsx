import { FormEvent, useEffect, useState } from "react";
import { Assets, Utilities } from "../../../assets";
import folderApi from "../../../server-api/folder";
import styles from "./move-modal.module.css";

// Components
import Button from "../../common/buttons/button";
import IconClickable from "../../common/buttons/icon-clickable";
import Input from "../../common/inputs/input";
import Base from "../../common/modals/base";
import { useMoveModal } from "../../../hooks/Use-Modal";
import SearchModal from "../../SearchModal/Search-modal";
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
  parentId: string | null
}
const MoveReplaceModal = ({
  modalIsOpen,
  closeModal,
  itemsAmount,
  moveAssets,
  createFolder,
  confirmText = "Move",
}) => {
  const {
    folders,
    selectedFolder,
    newFolderName,
    folderInputActive,
    subFolderLoadingState,
    folderChildList,
    showDropdown,
    selectAllFolders,
    input,
    setInput,
    filteredData,
    getFolders,
    getSubFolders,
    toggleSelected,
    toggleDropdown,
    toggleSelectAllChildList,
    setNewFolderName,
    setFolderInputActive,
    setSelectedFolder,
    setShowDropdown,
    setSubFolderLoadingState,
    setFolderChildList,
    setSelectAllFolders,
  } = useMoveModal();

  useEffect(() => {
    if (modalIsOpen) {
      getFolders();
    }
    return () => {
      setSelectedFolder([]);
      setShowDropdown([]);
      setSubFolderLoadingState(new Map());
      setFolderChildList(new Map())
      setSelectAllFolders({})
      setInput("")
    };
  }, [modalIsOpen]);

  const closemoveModal = () => {
    setSelectedFolder("");
    closeModal();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createFolder(newFolderName);
    getFolders();
    setNewFolderName("");
    setFolderInputActive(false);
  };

  const keyExists = (key: string) => {
    return folderChildList.has(key);
  };

  const keyResultsFetch = (key: string, type: string): Item[] | number => {
    const { results, next } = folderChildList.get(key);
    if (type === 'record') {
      return results || []
    }
    return next
  };

  return (
    <Base
      modalIsOpen={modalIsOpen}
      additionalClasses={[styles.moveModal]}
      overlayAdditionalClass={styles["move-modal-outer"]}
      closeModal={closemoveModal}
      confirmText={confirmText}
      headText={`${confirmText} ${itemsAmount} asset(s) to...`}
      disabledConfirm={!selectedFolder}
      subText="The assets will be moved into the new collection(s) and will be removed from their current collection(s)"
      confirmAction={() => {
        moveAssets(selectedFolder);
        closemoveModal();
      }}
    >
      <div className={`${styles["search-btn"]}`}>
        <SearchModal filteredData={filteredData} input={input} setInput={setInput} />
      </div>
      <div className={`${styles["modal-heading"]}`}>
        <span>Collection({folders.length ?? ""})</span>
      </div>
      <div className={`${styles["outer-wrapper"]}`}>
        {folders.map((folder, index) => (
          <div key={index}>
            <div className={`${styles["flex"]} ${styles.nestedbox}`}>
              <div className={`${styles["height"]}`}
                onClick={() => { toggleDropdown(folder.id, true) }}
              >
                <img
                  className={showDropdown.includes(folder.id) ? styles.iconClick : styles.rightIcon}
                  src={Utilities.arrowBlue}
                  alt="Right Arrow Icon"
                  onClick={() => { toggleDropdown(folder.id, true) }}
                />
              </div>

              <div className={styles.w100}>
                <div
                  className={`${styles["dropdownMenu"]} ${selectedFolder.includes(folder.id) ?
                    styles["active"]
                    : ""
                    }`}
                >
                  <div className={styles.flex}>
                    <div
                      className={`${styles.circle} ${selectedFolder.includes(folder.id) ?
                        styles.checked
                        : ""
                        }`}
                      onClick={() => toggleSelected(folder.id, !selectedFolder.includes(folder.id))}
                    >
                      {
                        selectedFolder.includes(folder.id) &&
                        <img src={Utilities.checkIcon} />
                      }
                    </div>
                    <div className={styles["icon-descriptions"]}>
                      <span>{folder.name}</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles["list1-right-contents"]}>
                      {
                        selectAllFolders[folder.id] ?
                          <div style={{ cursor: "pointer" }} onClick={() => toggleSelectAllChildList(folder.id)} className={`${styles['deselect-all']}`}>
                            <img
                              src={Utilities.redCheck} alt="Check Icon" />
                            <span className={styles.deselectText}>Deselect All</span>
                          </div>
                          :
                          <div style={{ cursor: "pointer" }} onClick={() => toggleSelectAllChildList(folder.id)} className={`${styles['select-all']}`}>
                            <img src={Utilities.doubleCheck} alt="Check Icon" />
                            <span className={styles.selectText}>Select All</span>
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showDropdown.includes(folder.id) && <div className={styles.folder}>
              <div className={styles.subfolderList}>
                {
                  keyExists(folder.id) && (keyResultsFetch(folder.id, "record") as Item[]).map((subfolder, subIndex) => (
                    <>
                      <div
                        key={subfolder.id}
                        className={styles.dropdownOptions}
                        onClick={() => toggleSelected(subfolder.id, !selectedFolder.includes(subfolder.id), true, folder.id)}>
                        <div className={styles["folder-lists"]}>
                          <div className={styles.dropdownIcons}>
                            <div
                              className={`${styles.circle} ${selectedFolder.includes(subfolder.id) ? styles.checked : ""
                                }`}>
                              {selectedFolder.includes(subfolder.id) && <img src={Utilities.checkIcon} />}
                            </div>
                            <div className={styles["icon-descriptions"]}>
                              <span>{subfolder.name}</span>
                            </div>
                          </div>
                          <div className={styles["list1-right-contents"]}>
                            {selectedFolder.includes(subfolder.id) && <span></span>}
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                }
                {(keyExists(folder.id) && (keyResultsFetch(folder.id, "next") as number) >= 0) && <div className={`${styles['outer-load-wrapper']}`}><div className={`${styles['load-wrapper']}`}
                  onClick={() => { getSubFolders(folder.id, (keyResultsFetch(folder.id, "next") as number), false) }}>
                  <IconClickable additionalClass={styles.loadIcon} src={Utilities.load} />
                  <button className={styles.loadMore}>{
                    subFolderLoadingState.get(folder.id)
                      ?
                      "Loading..."
                      :
                      "Load More"
                  }</button>
                </div>
                </div>
                }
              </div>
            </div>
            }
          </div>
        ))}
      </div>
      <div className={styles["folder-wrapper"]}>
        {folderInputActive ? (
          <form onSubmit={onSubmit}>
            <div
              className={styles["create-new"]}
              onClick={() => setFolderInputActive(false)}
            >
              X
            </div>
            <Input
              placeholder={"Collection name"}
              onChange={(e) => setNewFolderName(e.target.value)}
              value={newFolderName}
              styleType={"regular-short"}
            />
            <Button
              type={"submit"}
              text={"Create"}
              className="container submit input-height"
              disabled={!newFolderName}
            />
          </form>
        ) : (
          <span
            onClick={() => setFolderInputActive(true)}
            className={styles["create-new"]}
          >
            + Create New Collection
          </span>
        )}
      </div>
    </Base>
  );
};

export default MoveReplaceModal;
