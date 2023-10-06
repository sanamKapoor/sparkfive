import { useContext, useEffect, useState } from "react";
import { Assets, Utilities } from "../../../assets";
import folderApi from "../../../server-api/folder";
import styles from "./move-modal.module.css";

// Components
import Button from "../../common/buttons/button";
import IconClickable from "../../common/buttons/icon-clickable";
import Input from "../../common/inputs/input";
import Base from "../../common/modals/base";
import { FilterContext } from "../../../context";
import Search from "../../common/inputs/search";
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

const MoveModal = ({
  modalIsOpen,
  closeModal,
  itemsAmount,
  moveAssets,
  createFolder,
  confirmText = "Add",
}) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderInputActive, setFolderInputActive] = useState(false);
  const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map())
  const [sidenavFolderChildList, setSidenavFolderChildList] = useState(new Map())
  const [showDropdown, setShowDropdown] = useState([]);
  const [selectAllFolders, setSelectAllFolders] = useState<Record<string, boolean>>({});
  const {
    activeSortFilter
  } = useContext(FilterContext) as { term: any, activeSortFilter: any }


  useEffect(() => {
    if (modalIsOpen) {
      getFolders();
    }
    return () => {
      setSelectedFolder([]);
      setShowDropdown([]);
      setSubFolderLoadingState(new Map());
      setSidenavFolderChildList(new Map())
      setSelectAllFolders({})
    };
  }, [modalIsOpen]);

  const getFolders = async () => {
    try {
      const { data } = await folderApi.getFoldersSimple();
      const filteredParent = data.filter((folder: Item) => !folder?.parentId)
      setFolders(filteredParent);
    } catch (err) {
      console.log(err);
    }
  };

  const setSidenavFolderChildListItems = (
    inputFolders: any,
    id: string,
    replace = true,
  ) => {
    const { results, next, total } = inputFolders;
    if (replace) {
      if (results.length > 0) {
        setSidenavFolderChildList((map) => { return new Map(map.set(id, { results, next, total })) })
      }
    }
    else {
      setSidenavFolderChildList((map) => { return new Map(map.set(id, { results: [...map.get(id).results, ...results], next, total })) })
    }
  };

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
    setSidenavFolderChildListItems(data,
      id,
      replace
    )
    if (selectAllFolders[id]) ToggleAllSelectedFolders(id, true)
    setSubFolderLoadingState((map) => new Map(map.set(id, false)))
    return sidenavFolderChildList;
  }

  const closemoveModal = () => {
    setSelectedFolder([]);
    closeModal();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await createFolder(newFolderName);
    getFolders();
    setNewFolderName("");
    setFolderInputActive(false);
  };

  const toggleSelected = async (folderId: string, selected: boolean, subFolderToggle?: boolean, mainFolderId?: string) => {
    const actionFolderId = subFolderToggle ? mainFolderId : folderId;
    if (selected) {
      setSelectedFolder([...selectedFolder, folderId]);
      let selectedFolderArray: string[] = []
      const allChildIds: string[] = []

      //Todo:check the logic for selctecing while select all
      if (!selectAllFolders[actionFolderId]) {
        if (sidenavFolderChildList.has(actionFolderId)) {

          const response = sidenavFolderChildList.get(actionFolderId);
          if (response?.results?.length > 0) {
            response?.results.forEach((item: Item) => {
              allChildIds.push(item.id);
            })
            selectedFolderArray = Array.from(new Set(selectedFolder)).filter(item =>
              [...allChildIds, actionFolderId].includes(item)
            );
          }
        }
        if ([...selectedFolderArray, folderId].length === [...allChildIds, actionFolderId].length) {
          setSelectAllFolders((prev) => ({ ...prev, [actionFolderId]: true }))
        }
      }
    } else {
      setSelectedFolder(selectedFolder.filter((item) => item !== folderId));
      if (selectAllFolders[actionFolderId]) {
        setSelectAllFolders((prev) => ({ ...prev, [actionFolderId]: false }))
      };
    }
  };


  const toggleDropdown = async (folderId: string, replace: boolean) => {
    if (!showDropdown.includes(folderId)) {
      await getSubFolders(folderId, 1, replace);
      setShowDropdown([...showDropdown, folderId])
    } else {
      setShowDropdown(showDropdown.filter((item) => item !== folderId));
    }
  };

  const keyExists = (key: string) => {
    return sidenavFolderChildList.has(key);
  };

  const keyResultsFetch = (key: string, type: string): Item[] | number => {
    const { results, next } = sidenavFolderChildList.get(key);
    if (type === 'record') {
      return results || []
    }
    return next
  };

  const ToggleAllSelectedFolders = (folderId: string, selectAll: boolean) => {
    const response = sidenavFolderChildList.get(folderId);
    const allChildIds: string[] = []

    if (selectAll) {
      if (response?.results?.length > 0) {
        response?.results.forEach((item: Item) => {
          allChildIds.push(item.id);
        })
      }
      setSelectedFolder((prev) => [...prev, folderId, ...allChildIds]);
    }
    else if (!selectAll) {
      if (response?.results?.length > 0) {
        response?.results.forEach((item: Item) => {
          allChildIds.push(item.id);
        })
      }
      setSelectedFolder((prev) => (prev.filter((item) => ![...allChildIds, folderId].includes(item))));
    }
  }

  const toggleSelectAllChildList = (folderId: string) => {
    if (selectAllFolders[folderId]) {
      ToggleAllSelectedFolders(folderId, false)
      setSelectAllFolders((prev) => ({ ...prev, [folderId]: false }));
    } else {
      ToggleAllSelectedFolders(folderId, true)
      setSelectAllFolders((prev) => ({ ...prev, [folderId]: true }));
    }
  }

  return (
    <Base
      additionalClasses={[styles.moveModal]}
      overlayAdditionalClass={styles["move-modal-outer"]}
      modalIsOpen={modalIsOpen}
      closeModal={closemoveModal}
      confirmText="Add to collections"
      headText={`${confirmText} ${itemsAmount} item(s) to Collection`}
      subText="The assets will be added into the new collection(s) and will not be removed from their current collection(s)"
      disabledConfirm={!selectedFolder}
      confirmAction={() => {
        moveAssets(selectedFolder);
        closemoveModal();
      }}
    >
      <div className={`${styles["search-btn"]}`}>
        <SearchModal/>
     
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
                        onClick={() => toggleSelected(subfolder.id, !selectedFolder.includes(subfolder.id), true, folder.id)}
                      >
                        <div className={styles["folder-lists"]}>
                          <div className={styles.dropdownIcons}>
                            <div
                              className={`${styles.circle} ${selectedFolder.includes(subfolder.id) ? styles.checked : ""
                                }`}
                            >
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
                {(keyExists(folder.id) && (keyResultsFetch(folder.id, "next") as number) >= 0) && <div className={`${styles['load-wrapper']}`}
                  onClick={() => { getSubFolders(folder.id, (keyResultsFetch(folder.id, "next") as number), false) }}>
                  <IconClickable additionalClass={styles.loadIcon} src={Utilities.load} />
                  <button className={styles.loadMore}>{
                    subFolderLoadingState.get(folder.id)
                      ?
                      "Loading..."
                      :
                      "Load More"
                  }</button>
                    <button className={`${styles['collection-btn']}`}>Add sub-collection</button>

                </div>}
              
                {/* <button className={styles.loadMore}>Load more</button>
                </div>
                <div className={`${styles['load-wrapper']}`}>
                <IconClickable additionalClass={styles.loadIcon} src={Utilities.add} />
                <button className={`${styles['collection-btn']}`}>Add sub-collection</button>
                </div> */}

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
    </Base >
  );
};

export default MoveModal;
