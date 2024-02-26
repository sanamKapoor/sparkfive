import React, { useEffect } from 'react';

import { Utilities } from '../../../assets';
import { useCollectionMoveModal } from '../../../hooks/use-collection-move-modal';
import { Item } from '../../../interfaces/modal/use-modal-hook';
import Base from '../../common/modals/base';
import SearchModal from '../../SearchModal/Search-modal';
import styles from './move-modal.module.css';

// Components

const MoveCollectionModal = ({ modalIsOpen, closeModal, itemsAmount, moveFolder, confirmText = "Add", parentId = null }) => {
    const {
        folders,
        selectedFolder,
        subFolderLoadingState,
        folderChildList,
        showDropdown,
        input,
        setInput,
        filteredData,
        getFolders,
        getSubFolders,
        toggleSelected,
        toggleDropdown,
        setSelectedFolder,
        setShowDropdown,
        setSubFolderLoadingState,
        setFolderChildList,
        setSelectAllFolders,
    } = useCollectionMoveModal(parentId);

    useEffect(() => {
        if (modalIsOpen) {
            getFolders();
        }
        return () => {
            setSelectedFolder([]);
            setShowDropdown([]);
            setSubFolderLoadingState(new Map());
            setFolderChildList(new Map());
            setSelectAllFolders({});
            setInput("");
        };
    }, [modalIsOpen]);

    const closemoveModal = () => {
        setSelectedFolder([]);
        closeModal();
    };

    const keyExists = (key: string) => {
        return folderChildList.has(key);
    };

    const keyResultsFetch = (key: string, type: string): Item[] | number => {
        const { results, next } = folderChildList.get(key);
        if (type === "record") {
            return results || [];
        }
        return next;
    };

    return (
        <Base
            additionalClasses={[styles.moveModal]}
            overlayAdditionalClass={styles["move-modal-outer"]}
            modalIsOpen={modalIsOpen}
            closeModal={closemoveModal}
            confirmText={parentId ? "Move Subcollection" : "Make Collection a Subcollection"}
            headText={parentId ? "Move Subcollection" : "Make Collection a Subcollection"}
            subText={parentId ? "The selected subcollection will be moved from its current location and made a subcollection of the selected parent collection" : "The selected collection will be moved from its current location and made a subcollection of the selected parent collection"}
            disabledConfirm={!selectedFolder}
            confirmAction={() => {
                moveFolder(selectedFolder);
                closemoveModal();
            }}
        >
            <div className={`${styles["search-btn"]}`}>
                <SearchModal filteredData={filteredData} input={input} setInput={setInput} />
            </div>
            <div className={`${styles["modal-heading"]}`}>
                <div className={`${styles["heading-border"]}`}>
                    <span>Collection({folders.length ?? ""})</span>
                </div>
            </div>
            <div className={`${styles["outer-wrapper"]}`}>
                {folders.map((folder, index) => (
                    <div key={index}>
                        <div className={`${styles["flex"]} ${styles.nestedbox}`}>
                            {folder?.childFolders?.length > 0 ? (
                                <div
                                    className={`${styles["height"]}`}
                                    onClick={() => {
                                        toggleDropdown(folder.id, true);
                                    }}
                                >
                                    <img
                                        className={showDropdown.includes(folder.id) ? styles.iconClick : styles.rightIcon}
                                        src={Utilities.caretRightSolid}
                                        alt="Right Arrow Icon"
                                    />
                                </div>
                            ) : (
                                <div className={styles.emptyBox}></div>
                            )}
                            <div className={styles.w100}>
                                <div
                                    className={`${styles["dropdownMenu"]} ${selectedFolder.includes(folder.id) ? styles["active"] : ""}`}
                                >
                                    <div className={styles.flex}>
                                        <div
                                            className={`${styles.circle} ${selectedFolder.includes(folder.id) ? styles.checked : ""}`}
                                            onClick={() => toggleSelected(folder.id, !selectedFolder.includes(folder.id))}
                                        >
                                            {selectedFolder.includes(folder.id) && <img src={Utilities.checkIcon} />}
                                        </div>
                                        <div className={styles["icon-descriptions"]} title={folder.name}>
                                            <span>{folder.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showDropdown.includes(folder.id) && (
                            <div className={styles.folder}>
                                <div className={styles.subfolderList}>
                                    {keyExists(folder.id) &&
                                        (keyResultsFetch(folder.id, "record") as Item[]).map((subfolder, subIndex) => (
                                            <>
                                                <div key={subfolder.id} className={styles.dropdownOptions}>
                                                    <div className={styles["folder-lists"]}>
                                                        <div className={styles.dropdownIcons}>
                                                            <div className={styles["icon-descriptions"]}>
                                                                <span title={subfolder.name}> {subfolder.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                    {keyExists(folder.id) && (keyResultsFetch(folder.id, "next") as number) >= 0 && (
                                        <div className={`${styles["outer-load-wrapper"]}`}>
                                            <div
                                                className={`${styles["load-wrapper"]}`}
                                                onClick={() => {
                                                    getSubFolders(folder.id, keyResultsFetch(folder.id, "next") as number, false);
                                                }}
                                            >
                                                {/* <IconClickable additionalClass={styles.loadIcon} src={Utilities.load} /> */}
                                                <button className={styles.loadMore}>
                                                    {subFolderLoadingState.get(folder.id) ? "Loading..." : "Load More"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Base>
    );
};

export default MoveCollectionModal;
