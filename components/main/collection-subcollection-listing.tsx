import React, { useContext, useEffect } from 'react';

import { Utilities } from '../../assets';
import { ASSET_EDIT } from '../../constants/permissions';
import { UserContext } from '../../context';
import Button from '../common/buttons/button';
import IconClickable from '../common/buttons/icon-clickable';
import SearchModal from '../SearchModal/Search-modal';
import styles from './collection-subcollection-list.module.css';

// import styles from './upload-approval/index.module.css';
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
const CollectionSubcollectionListing = ({
    activeDropdown,
    setActiveDropdown,
    folders,
    selectedFolder,
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
    // setSelectedFolder,
    completeSelectedFolder,
    isCustomRestriction
}) => {
    const { hasPermission } = useContext(UserContext);


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

    useEffect(() => {
        getFolders()
    }, [])




    return (
        <section className={styles["field-wrapper"]}>

            {(hasPermission([ASSET_EDIT])) && (activeDropdown === "" || activeDropdown !== "collections") && (
                <>
                    <div className={`${styles['top-heading']}`}>
                        <span>Collection</span>
                    </div>
                    {<div className={`${styles["tag-container-wrapper"]}`}>
                        {
                            [...completeSelectedFolder.entries()].map(([key, value], index) => (
                                <div className={`${styles["tag-container"]}`} key={index}>
                                    <span>{value.name}</span>
                                    <IconClickable
                                        additionalClass={styles.remove}
                                        src={Utilities.closeTag}
                                        onClick={() => toggleSelected(key, !selectedFolder.includes(key), false, "", value.name, isCustomRestriction ? true : false)}
                                    />
                                </div>
                            ))
                        }
                    </div>}

                    <div
                        className={`add ${styles["select-add"]}`}
                        onClick={() => setActiveDropdown("collections")}
                    >
                        <IconClickable src={Utilities.addLight} />
                        <span>{"Add to Collection"}</span>
                    </div>
                </>

            )}
            {
                (hasPermission([ASSET_EDIT]) && activeDropdown === "collections") &&
                <div className={`${styles["edit-bulk-outer-wrapper"]}`}>
                    <div className={`${styles["close-popup"]}`}> <IconClickable
                        additionalClass={styles.remove}
                        src={Utilities.closeTag}
                        onClick={() => setActiveDropdown("")}
                    /></div>
                    <div className={`${styles["search-btn"]}`}>
                        <SearchModal filteredData={filteredData} input={input} setInput={setInput} />
                    </div>
                    <div className={`${styles["modal-heading"]}`}>
                        <span>Collections</span>
                    </div>
                    <div className={`${styles["outer-wrapper"]}`}>
                        {folders.map((folder, index) => (
                            <div key={index}>
                                <div className={`${styles["flex"]} ${styles.nestedbox}`}>

                                    {
                                        folder?.childFolders?.length > 0 ? (
                                            <div className={`${styles["height"]} ${styles["flex"]}`}
                                                onClick={() => { toggleDropdown(folder.id, true) }}
                                            >
                                                <img
                                                    className={showDropdown.includes(folder.id) ? styles.iconClick : styles.rightIcon}
                                                    src={Utilities.caretRightSolid}
                                                    alt="Right Arrow Icon"
                                                    onClick={() => { toggleDropdown(folder.id, true) }}
                                                />
                                            </div>
                                        ) : <div className={styles.emptyBox}></div>
                                    }


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
                                                    onClick={() => toggleSelected(folder.id, !selectedFolder.includes(folder.id), false, "", folder.name, isCustomRestriction ? true : false)}
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
                                            {
                                                folder?.childFolders?.length > 0 && (
                                                    <div>
                                                        <div className={styles["list1-right-contents"]}>
                                                            {
                                                                selectAllFolders[folder.id] ?
                                                                    <div style={{ cursor: "pointer" }} onClick={() => toggleSelectAllChildList(folder.id, folder.name)} className={`${styles['deselect-all']}`}>
                                                                        <img
                                                                            src={Utilities.redCheck} alt="Check Icon" />
                                                                        <span className={styles.deselectText}>Deselect All</span>
                                                                    </div>
                                                                    :
                                                                    <div style={{ cursor: "pointer" }} onClick={() => toggleSelectAllChildList(folder.id, folder.name)} className={`${styles['select-all']}`}>
                                                                        <img src={Utilities.doubleCheck} alt="Check Icon" />
                                                                        <span className={styles.selectText}>Select All</span>
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                {showDropdown.includes(folder.id) && <div className={styles.folder}>
                                    <div className={styles.subfolderList}>
                                        {
                                            keyExists(folder.id) && (keyResultsFetch(folder.id, "record") as Item[]).map(({ id, name, parentId, ...rest }) => (
                                                <>
                                                    <div
                                                        key={id}
                                                        className={styles.dropdownOptions}
                                                        onClick={() => toggleSelected(id, !selectedFolder.includes(id), true, folder.id, name, isCustomRestriction ? true : false)}>
                                                        <div className={styles["folder-lists"]}>
                                                            <div className={styles.dropdownIcons}>
                                                                <div
                                                                    className={`${styles.circle} ${selectedFolder.includes(id) ? styles.checked : ""
                                                                        }`}>
                                                                    {selectedFolder.includes(id) && <img src={Utilities.checkIcon} />}
                                                                </div>
                                                                <div className={styles["icon-descriptions"]}>
                                                                    <span>{name}</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles["list1-right-contents"]}>
                                                                {selectedFolder.includes(id) && <span></span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ))
                                        }
                                        {(keyExists(folder.id) && (keyResultsFetch(folder.id, "next") as number) >= 0) && <div className={`${styles['outer-load-wrapper']}`}><div className={`${styles['load-wrapper']}`}
                                            onClick={() => { getSubFolders(folder.id, (keyResultsFetch(folder.id, "next") as number), false) }}>
                                            {/* <IconClickable additionalClass={styles.loadIcon} src={Utilities.load} /> */}
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
                                </div>}
                            </div>
                        ))}
                    </div>
                    <div className={styles["modal-btns"]}>
                        <Button className="container secondary bulk-edit-btn" text="Close" onClick={() => setActiveDropdown("")}
                        ></Button>
                    </div>
                </div>
            }
        </section>
    )
}

export default CollectionSubcollectionListing