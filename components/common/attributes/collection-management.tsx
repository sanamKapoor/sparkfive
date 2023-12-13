import { useEffect, useState } from "react";
import styles from "./tag-management.module.css";

// Components
import CreatableSelect from "../inputs/creatable-select";
import Select from "../inputs/select";
import Tag from "../misc/tag";
import Search from "./search-input";

// APIs
import folderApi from "../../../server-api/attribute";
import Button from "../buttons/button";
import ConfirmModal from "../modals/confirm-modal";
import SpinnerOverlay from "../spinners/spinner-overlay";

// Utils
import { sorts } from "../../../config/data/attributes";
import toastUtils from "../../../utils/toast";
import Input from "../inputs/input";
import IconClickable from "../buttons/icon-clickable";
import { Utilities } from "../../../assets";
import NestedButton from "./AddSubcollectionModal";

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
  childFolders: Item[];
}

const CollectionManagement = () => {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [sort, setSort] = useState(sorts[0]);
  const [searchType, setSearchType] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(); // Id is pending to delete
  const [editMode, setEditMode] = useState(false); // Double click on tag to edit
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(); // Current edit tag
  const [currentEditValue, setCurrentEditValue] = useState(""); // Current edit value
  const [editSubCollectionId, setEditSubCollectionId] = useState<string>("");

  const [isFolderLoading, SetIsFolderLoading] = useState(false);
  const [subFoldersParentId, setSubFoldersParentId] = useState(new Map());
  const [sidenavFolderChildList, setSidenavFolderChildList] = useState(
    new Map()
  );
  const [showDropdown, setShowDropdown] = useState(
    new Array(folderList.length).fill(false)
  );
  const keyExists = (key: string) => {
    return sidenavFolderChildList.has(key);
  };

  const keyResultsFetch = (key: string) => {
    const results = sidenavFolderChildList.get(key);
    return results || [];
  };
  const getSubFolders = async (id: string, page: number, replace: boolean) => {
    const { data } = await folderApi.getSubFolders({
      isAll: 1,
      sort: sort.value,
      searchType,
      searchKey,
      parentId: id,
    });
    setSubFoldersParentId((prev) => {
      data.forEach((item: Item) => {
        prev.set(item.id, id);
      });
      return prev;
    });
    setSidenavFolderChildList((map) => {
      return new Map(map.set(id, data));
    });
  };

  const toggleDropdown = async (
    index: number,
    item: Item,
    replace: boolean
  ) => {
    if (!showDropdown[index]) {
      await getSubFolders(item.id, 1, replace);
    }
    const updatedShowDropdown = [...showDropdown];
    updatedShowDropdown[index] = !updatedShowDropdown[index]; //Toggle dropdown on img click event
    setShowDropdown(updatedShowDropdown);
  };
  // Create the new tag
  const createFolder = async (item) => {
    try {
      // Show loading
      setLoading(true);

      await folderApi.createFolders({ folders: [item] });

      // Reload the list
      getFolderList();
    } catch (err) {
      if (err.response?.status === 400)
        toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not create folder, please try again later.");

      // Show loading
      setLoading(false);
    }
  };

  // Get folder list
  const getFolderList = async () => {
    // Show loading
    setLoading(true);
    SetIsFolderLoading(true);

    let { data } = await folderApi.getFolders({
      isAll: 1,
      sort: sort.value,
      searchType,
      searchKey,
    });
    setFolderList(data);

    // Hide loading
    SetIsFolderLoading(false);
    setLoading(false);
  };

  const getFoldersOnUpdate = async (id: string) => {
    await getFolderList();
    if (subFoldersParentId.has(id)) {
      const data = subFoldersParentId.get(id);
      getSubFolders(data, 1, true);
    }
  };

  const deleteFolderList = async (id) => {
    try {
      // Hide confirm modal
      setConfirmDeleteModal(false);
      // Show loading
      setLoading(true);
      // Call API to delete folder
      await folderApi.deleteFolders({ folderIds: [id] });
      // Refresh the list
      // getFolderList();
      getFoldersOnUpdate(id);
      toastUtils.success("Collection deleted successfully");
    } catch (err) {
      setLoading(false);
      toastUtils.error(
        err?.response?.data?.message ||
        "Something went wrong please try again later"
      );
    }
  };

  // Reset edit state
  const resetEditState = () => {
    setEditMode(false);
    setCurrentEditIndex(0);
    setCurrentEditValue("");
    setEditSubCollectionId("");
  };

  // Save updated changes
  const saveChanges = async (id) => {
    // Show loading
    setLoading(true);
    // Call API to delete tag
    await folderApi.updateFolders({
      folders: [
        {
          id: id,
          name: currentEditValue,
        },
      ],
    });
    resetEditState();
    // Refresh the list
    getFoldersOnUpdate(id);
  };

  useEffect(() => {
    getFolderList();
  }, [sort, searchKey]);

  return (
    <div
      className={`${styles["main-wrapper"]} ${styles["collection-management-wrapper"]}`}
    >
      <h3>Collections</h3>

      <div className={styles["search-row"]}>
        {/* <div className={styles["search-column-1"]}>
          <Search
            name={"start"}
            searchType={searchType}
            placeholder={"Starts with"}
            onSubmit={(key) => {
              setSearchType("start");
              setSearchKey(key);
            }}
            onClear={() => {
              setSearchKey("");
            }}
          />
        </div>
        <div className={styles["search-column-2"]}>
          <Search
            name={"exact"}
            searchType={searchType}
            placeholder={"Exact Match"}
            onSubmit={(key) => {
              setSearchType("exact");
              setSearchKey(key);
            }}
            onClear={() => {
              setSearchKey("");
            }}
          />
        </div> */}
        <div className={styles["search-column-3"]}>
          <Search
            name={"contain"}
            searchType={searchType}
            onlyInput={true}
            placeholder={"Search Collection"}
            onChange={(key) => {
              setSearchType("contain");
              setSearchKey(key);
            }}
            onClear={() => {
              setSearchKey("");
            }}
          />
        </div>
      </div>

      <div className={styles["operation-row"]}>
        {/**
         * todo once confirmed the changes for modal
         */}
        <NestedButton type={"collection"} iconSrc={Utilities.addLight}
          text="Add collection"
          textColor="
                              #08135E" updateFolders={getFolderList} />
        {/* <CreatableSelect
          altColor="blue"
          title=""
          addText="Add Collection"
          onAddClick={() => setActiveDropdown("folders")}
          selectPlaceholder={"Enter a new collection"}
          avilableItems={[]}
          setAvailableItems={() => { }}
          selectedItems={[]}
          setSelectedItems={() => { }}
          onAddOperationFinished={() => { }}
          onRemoveOperationFinished={() => { }}
          onOperationFailedSkipped={() => setActiveDropdown("")}
          isShare={false}
          asyncCreateFn={createFolder}
          dropdownIsActive={activeDropdown === "folders"}
          selectClass={styles["campaign-select"]}
        /> */}

        {/* <Select
          options={sorts}
          onChange={(value) => {
            setSort(value);
          }}
          placeholder={"Select to sort"}
          styleType={`regular ${styles["sort-select"]}`}
          value={sort}
        /> */}
      </div>

      <ul className={styles["tag-wrapper"]}>
        {folderList.map((folder, index) => (
          <li
            key={index}
            className={`${styles["tag-item"]} ${styles["attribute-tag-list"]}`}
          >
            {(editMode === false ||
              (editMode === true && currentEditIndex !== index)) && (
                // new design added acoording
                <div className={`${styles["outer-wrapper"]}`}>
                  <div className={`${styles["attribute-wrapper"]}`}>
                    {/* <IconClickable src={Utilities.CaretDown}/> */}
                    {folder?.childFolders?.length > 0 ? (
                      showDropdown[index] ? (
                        <IconClickable
                          src={Utilities.CaretDown}
                          onClick={() => toggleDropdown(index, folder, true)}
                          additionalClass={styles["dropdown-icon"]}
                        />
                      ) : (
                        <IconClickable
                          src={Utilities.caretRightsingle}
                          onClick={() => toggleDropdown(index, folder, true)}
                          additionalClass={styles["dropdown-icon"]}
                        />
                      )
                    ) : (
                      <div className={styles.emptyBox}></div>
                    )}
                    <Tag
                      altColor="blue"
                      tag={
                        <>
                          <span className={styles["tag-item-text"]}>
                            {folder.numberOfFiles}
                          </span>{" "}
                          <span>{folder.name}</span>
                        </>
                      }
                      data={folder}
                      type="collection"
                      canRemove={true}
                      editFunction={() => {
                        setCurrentEditIndex(index);
                        setCurrentEditValue(folder.name);
                        setEditMode(true);
                      }}
                      removeFunction={() => {
                        if (folder?.childFolders?.length > 0) {
                          toastUtils.error(
                            "Please delete its sub-collection first then try to delete this collection"
                          );
                        } else {
                          setCurrentDeleteId(folder.id);
                          setConfirmDeleteModal(true);
                        }
                      }}
                    />
                  </div>
                  {/* only static need to change this  */}
                  <div className={styles["sublist-wrapper"]}>
                    {showDropdown[index] && keyExists(folder.id) && (
                      <>
                        {keyResultsFetch(folder.id).map(
                          (record: any, recordIndex: number) => (
                            <div className={styles["sublist-outer"]}>
                              <div className={styles.subList}>
                                <Tag
                                  altColor="blue"
                                  tag={
                                    <>
                                      <span className={styles["tag-item-text"]}>
                                        {record.numberOfFiles}
                                      </span>{" "}
                                      <span>{record.name}</span>
                                    </>
                                  }
                                  data={record}
                                  type="collection"
                                  canRemove={true}
                                  editFunction={() => {
                                    setCurrentEditIndex(index);
                                    setCurrentEditValue(record.name);
                                    setEditMode(true);
                                    setEditSubCollectionId(record.id);
                                  }}
                                  removeFunction={() => {
                                    setCurrentDeleteId(record.id);
                                    setConfirmDeleteModal(true);
                                  }}
                                />
                              </div>

                            </div>
                          )
                        )}
                        <div className={styles.addButton}>
                          {showDropdown[index] && (
                            <div className={styles["attribute-add-subcollection"]}>
                              <NestedButton
                                updateFolders={getSubFolders}
                                type={"subCollection"}
                                parentId={folder.id}
                                iconSrc={Utilities.add}
                                text="Add subcollection"
                                textColor="var(--secondary-color)"
                              />

                            </div>

                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            {editMode === true &&
              ((currentEditIndex === index && !editSubCollectionId) ||
                (currentEditIndex === index && editSubCollectionId)) && (
                <div>
                  <Input
                    placeholder={"Edit name"}
                    onChange={(e) => {
                      setCurrentEditValue(e.target.value);
                    }}
                    additionalClasses={styles["edit-input"]}
                    value={currentEditValue}
                    styleType={"regular-short"}
                  />
                  <Button
                    className={
                      "container submit exclude-min-height edit-submit-btn primary"
                    }
                    type={"submit"}
                    text="Save changes"
                    onClick={() => {
                      saveChanges(
                        editSubCollectionId !== ""
                          ? editSubCollectionId
                          : folder.id
                      );
                    }}
                  />
                  <Button
                    className={"container secondary edit-cancel-btn"}
                    type={"button"}
                    text="Cancel"
                    onClick={resetEditState}
                  />
                </div>
              )}
          </li>
        ))}
      </ul>

      {loading && <SpinnerOverlay />}

      <ConfirmModal
        modalIsOpen={confirmDeleteModal}
        closeModal={() => {
          setConfirmDeleteModal(false);
        }}
        confirmAction={() => {
          deleteFolderList(currentDeleteId);
        }}
        confirmText={"Delete"}
        message={
          <span>
            This folder will be deleted and removed from any file that has
            it.&nbsp; Are you sure you want to delete these?
          </span>
        }
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />
    </div>
  );
};

export default CollectionManagement;
