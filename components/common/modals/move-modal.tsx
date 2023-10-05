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
const data = [
  {
    folderName: "Architecture",
    subfolders: [
      {
        name: "City",
      },
      {
        name: "Renaissance",
      },
      {
        name: "Interior",
      },
      {
        name: "House",
      },
    ],
  },
  {
    folderName: "Portraits",
    subfolders: [],
  },
  {
    folderName: "Nature",
    subfolders: [],
  },
  {
    folderName: "Events",
    subfolders: [],
  },
  {
    folderName: "Travel",
    subfolders: [],
  },
  {
    folderName: "Food",
    subfolders: [],
  },
  {
    folderName: "Landscapes",
    subfolders: [],
  },
];

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
  const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map());
  const [sidenavFolderChildList, setSidenavFolderChildList] = useState(
    new Map()
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };

  const handleItemClick = (index: any) => {
    if (selectedItem === index) {
      setSelectedItem(null);
    } else {
      setSelectedItem(index);
    }
  };

  const { activeSortFilter } = useContext(FilterContext) as {
    term: any;
    activeSortFilter: any;
  };

  useEffect(() => {
    if (modalIsOpen) {
      getFolders();
    }
  }, [modalIsOpen]);

  const getFolders = async () => {
    try {
      const { data } = await folderApi.getFoldersSimple();
      setFolders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const setSidenavFolderChildListItems = (
    inputFolders: any,
    id: string,
    replace = true
  ) => {
    const { results, next, total } = inputFolders;
    if (replace) {
      if (results.length > 0) {
        setSidenavFolderChildList((map) => {
          return new Map(map.set(id, { results, next, total }));
        });
      }
    } else {
      setSidenavFolderChildList((map) => {
        return new Map(
          map.set(id, {
            results: [...map.get(id).results, ...results],
            next,
            total,
          })
        );
      });
    }
  };

  const getSubFolders = async (id: string, page: number, replace: boolean) => {
    setSubFolderLoadingState((map) => new Map(map.set(id, true)));

    const { field, order } = activeSortFilter.sort;
    const queryParams = {
      page: replace ? 1 : page,
      pageSize: 10,
      sortField: field,
      sortOrder: order,
    };
    const { data } = await folderApi.getSubFolders(
      {
        ...queryParams,
      },
      id
    );
    setSidenavFolderChildListItems(data, id, replace);
    setSubFolderLoadingState((map) => new Map(map.set(id, false)));
    return sidenavFolderChildList;
  };

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

  const toggleSelected = (folderId: string, selected: boolean) => {
    if (selected) {
      setSelectedFolder([...selectedFolder, folderId]);
    } else {
      setSelectedFolder(selectedFolder.filter((item) => item !== folderId));
    }
  };

  return (
    <Base
      additionalClasses={[styles.moveModal]}
      modalIsOpen={modalIsOpen}
      closeModal={closemoveModal}
      confirmText={confirmText}
      headText={`${confirmText} ${itemsAmount} item(s) to Collection`}
      subText="The assets will be added into the new collection(s) and will not be removed from their current collection(s)"
      disabledConfirm={!selectedFolder}
      confirmAction={() => {
        moveAssets(selectedFolder);
        closemoveModal();
      }}
    >
      <div className={`${styles["search-btn"]}`}>
        <Search placeholder="search collection" />
      </div>
      {/* <ul className={styles.list}>
        {folders.map((folder) => (
          <li
            key={folder.id}
            onClick={() =>
              toggleSelected(folder.id, !selectedFolder.includes(folder.id))
            }
          >
            {selectedFolder.includes(folder.id) ? (
              <IconClickable
                src={Utilities.radioButtonEnabled}
                additionalClass={styles["select-icon"]}
              />
            ) : (
              <IconClickable
                src={Utilities.radioButtonNormal}
                additionalClass={styles["select-icon"]}
              />
            )}
            <IconClickable src={Assets.folder} />
            <IconClickable src={Assets.folder} />
            <div className={styles.name}>{folder.name}</div>
          </li>
        ))}
      </ul> */}
      <div className={`${styles["modal-heading"]}`}>
        <span>Collection(21)</span>
      </div>
      <div className={`${styles["outer-wrapper"]}`}>
        {data.map((folder, index) => (
          <div key={index}>
            <div className={`${styles["flex"]} ${styles.nestedbox}`}>
              <img
                className={styles.rightIcon}
                src={Utilities.arrowBlue}
                alt="Right Arrow Icon"
              />

              <div className={styles.w100}>
                <div
                  className={`${styles["dropdownMenu"]} ${
                    selectedItem === index ? styles["active"] : ""
                  }`}
                  onClick={() => handleItemClick(index)}
                >
                  <div className={styles.flex}>
                    {/* <img src={Utilities.folder} alt="Folder Icon" /> */}
                    <div
                      className={`${styles.circle} ${
                        isChecked ? styles.checked : ""
                      }`}
                      onClick={handleCircleClick}
                    >
                      {isChecked && <img src={Utilities.checkIcon} />}
                    </div>
                    <div className={styles["icon-descriptions"]}>
                      <span>{folder.folderName}</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles["list1-right-contents"]}>
                      {selectedItem === index && (
                        <>
                          <img src={Utilities.checkBlue} alt="Check Icon" />
                          <span className={styles.selectText}>Select All</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.folder}>
              <div className={styles.subfolderList}>
                {folder.subfolders.map((subfolder, subIndex) => (
                  <>
                    <div
                      key={subIndex}
                      className={styles.dropdownOptions}
                      onClick={() => handleItemClick(index)}
                    >
                      <div className={styles["folder-lists"]}>
                        <div className={styles.dropdownIcons}>
                          {/* <img
                            className={styles.subfolder}
                            src={Utilities.folder}
                            alt="Folder Icon"
                          /> */}
                          <div
                            className={`${styles.circle} ${
                              isChecked ? styles.checked : ""
                            }`}
                            onClick={handleCircleClick}
                          >
                            {isChecked && <img src={Utilities.checkIcon} />}
                          </div>
                          <div className={styles["icon-descriptions"]}>
                            <span>{subfolder.name}</span>
                          </div>
                        </div>
                        <div className={styles["list1-right-contents"]}>
                          {selectedItem === index && <span></span>}
                        </div>
                      </div>
                    </div>
                    <button className={styles.loadMore}>Load more</button>
                  </>
                ))}
              </div>
            </div>
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

export default MoveModal;
