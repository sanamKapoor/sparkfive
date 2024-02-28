import { useState, useContext } from "react";
import { FilterContext } from "../context";
import folderApi from "../server-api/folder";
// Defining interfaces
import { Item, MoveModalReturnType } from "../interfaces/modal/use-modal-hook"
export const useMoveModal = (): MoveModalReturnType => {
    //States for folders, search results, selected folders, etc.
    const [folders, setFolders] = useState([]);
    const [resultedSearchFolders, setResultedSearchFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState([]);
    const [newFolderName, setNewFolderName] = useState("");
    const [folderInputActive, setFolderInputActive] = useState(false);
    const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map());
    const [folderChildList, setFolderChildList] = useState(new Map());
    const [showDropdown, setShowDropdown] = useState([]);
    const [selectAllFolders, setSelectAllFolders] = useState<Record<string, boolean>>({});
    const [input, setInput] = useState('');
    const [completeSelectedFolder, setCompleteSelectedFolder] = useState<Map<string, { name: string; parentId: string | null }>>(new Map());

    // Extract values from FilterContext
    const {
        activeSortFilter
    } = useContext(FilterContext) as { term: any, activeSortFilter: any }

    // Filter folders based on the input search string
    const filteredData = () => {
        setFolders(resultedSearchFolders.filter(item =>
            item.name.toLowerCase().includes(input.toLowerCase())
        )
        )
    }

    // Fetch folders from the API
    const getFolders = async () => {
        try {
            const { data } = await folderApi.getFoldersSimple();
            const filteredParent = data.filter((folder: Item) => !folder?.parentId)
            setResultedSearchFolders(filteredParent)
            setFolders(filteredParent);
        } catch (err) {
        }
    };

    // Set subfolders
    const setFolderChildListItems = (
        inputFolders: any,
        id: string,
        replace = true,
    ) => {
        const { results, next, total } = inputFolders;
        if (replace) {
            if (results.length > 0) {
                setFolderChildList((map) => { return new Map(map.set(id, { results, next, total })) })
            }
        }
        else {
            setFolderChildList((map) => { return new Map(map.set(id, { results: [...map.get(id).results, ...results], next, total })) })
        }
    };
    // Fetch subfolders based on folder ID and page number
    const getSubFolders = async (id: string, page: number, replace: boolean) => {
        const foundObject = folders.find(obj => obj.id === id);
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
        setFolderChildListItems(data,
            id,
            replace
        )
        if (selectAllFolders[id]) ToggleAllSelectedFolders(id, true, foundObject ? foundObject.name : "")
        setSubFolderLoadingState((map) => new Map(map.set(id, false)))
        return folderChildList;
    }


    const removeIdsIntoFolder = (idsToRemove: string[]) => {
        setCompleteSelectedFolder((map) => {
            idsToRemove.forEach(id => {
                map.delete(id);
            });
            return map
        })
    };

    const insertIdsIntoFolder = (items: {
        [key: string]: {
            name: string, parentId: string | null
        }
    }[]) => {
        setCompleteSelectedFolder((map) => {
            items.forEach(item => {
                for (const key in item) {
                    map.set(key, item[key]);
                }
            });
            return map
        })

    };

    const toggleSelected = async (
        folderId: string,
        selected: boolean,
        subFolderToggle?: boolean,
        mainFolderId?: string,
        name = "",
        customRole?: boolean // Added this check to select the parent when subcollection select in case of parent
    ) => {
        const parentFolderId = subFolderToggle ? mainFolderId : folderId;
        if (selected) {
            if (subFolderToggle && !selectedFolder.includes(parentFolderId) && customRole) {
                setSelectedFolder([...selectedFolder, folderId, mainFolderId]);
                insertIdsIntoFolder([
                    {
                        [folderId]: {
                            name: name,
                            parentId: subFolderToggle ? mainFolderId : null,
                        },
                        [mainFolderId]: {
                            name: name,
                            parentId: null,
                        },
                    },
                ]);
            } else {
                setSelectedFolder([...selectedFolder, folderId]);
                insertIdsIntoFolder([
                    {
                        [folderId]: {
                            name: name,
                            parentId: subFolderToggle ? mainFolderId : null,
                        },
                    },
                ]);
            }

            let selectedFolderArray: string[] = [];
            const allChildIds: string[] = [];
            if (!selectAllFolders[parentFolderId]) {
                if (folderChildList.has(parentFolderId)) {
                    const response = folderChildList.get(parentFolderId);
                    if (response?.results?.length > 0) {
                        response?.results.forEach((item: Item) => {
                            allChildIds.push(item.id);
                        });
                        selectedFolderArray = Array.from(new Set(selectedFolder)).filter(
                            (item) => [...allChildIds, parentFolderId].includes(item)
                        );
                    }
                }

                if (
                    [...selectedFolderArray, folderId].length ===
                    [...allChildIds, parentFolderId].length ||
                    (!subFolderToggle && !showDropdown.includes(folderId))
                ) {
                    setSelectAllFolders((prev) => ({ ...prev, [parentFolderId]: true }));
                } else if (
                    subFolderToggle &&
                    !selectedFolder.includes(parentFolderId) &&
                    [...selectedFolderArray, folderId, parentFolderId].length ===
                    [...allChildIds, parentFolderId].length, customRole
                ) {
                    setSelectAllFolders((prev) => ({ ...prev, [parentFolderId]: true }));
                }
            }
        } else {
            setSelectedFolder(selectedFolder.filter((item) => item !== folderId));
            removeIdsIntoFolder([folderId]);
            if (selectAllFolders[parentFolderId]) {
                setSelectAllFolders((prev) => ({ ...prev, [parentFolderId]: false }));
            }
            // Remove on Icon click of selected folders on above modal in edit page
            if (completeSelectedFolder.get(parentFolderId)?.parentId) {
                setSelectAllFolders((prev) => ({
                    ...prev,
                    [completeSelectedFolder.get(parentFolderId)?.parentId]: false,
                }));
            }
        }
    };
    // Handle dropdown toggle for displaying subfolders
    const toggleDropdown = async (folderId: string, replace: boolean) => {
        if (!showDropdown.includes(folderId)) {
            await getSubFolders(folderId, 1, replace);
            setShowDropdown([...showDropdown, folderId])
        } else {
            setShowDropdown(showDropdown.filter((item) => item !== folderId));
        }
    };
    // Select or deselect all folders in a list
    const ToggleAllSelectedFolders = (folderId: string, selectAll: boolean, name = "") => {
        const response = folderChildList.get(folderId);
        const allChildIds: string[] = []
        const idsWithName: { [key: string]: { name: string; parentId: string | null } }[] = [];
        if (selectAll) {
            if (response?.results?.length > 0) {
                response?.results.forEach((item: Item) => {
                    allChildIds.push(item.id);
                    idsWithName.push({
                        [item.id]: { name: item.name, parentId: folderId }
                    })
                })
            }
            setSelectedFolder((prev) => Array.from(new Set([...prev, folderId, ...allChildIds])));
            insertIdsIntoFolder([...idsWithName, { [folderId]: { name: name, parentId: null } }])
        }
        else if (!selectAll) {
            if (response?.results?.length > 0) {
                response?.results.forEach((item: Item) => {
                    allChildIds.push(item.id);
                })
            }
            setSelectedFolder((prev) => (prev.filter((item) => ![...allChildIds, folderId].includes(item))));
            removeIdsIntoFolder([...allChildIds, folderId])

        }
    }

    const toggleSelectAllChildList = async (folderId: string, name = "") => {
        if (selectAllFolders[folderId]) {
            ToggleAllSelectedFolders(folderId, false, name)
            setSelectAllFolders((prev) => ({ ...prev, [folderId]: false }));

        } else {
            if (!showDropdown.includes(folderId)) {
                await toggleDropdown(folderId, true)
            }
            ToggleAllSelectedFolders(folderId, true, name)
            setSelectAllFolders((prev) => ({ ...prev, [folderId]: true }));
        }
    }

    // Return all state values and handlers
    return {
        folders,
        resultedSearchFolders,
        selectedFolder,
        newFolderName,
        folderInputActive,
        subFolderLoadingState,
        folderChildList,
        showDropdown,
        selectAllFolders,
        input,
        completeSelectedFolder,
        setInput,
        filteredData,
        getFolders,
        setFolderChildListItems,
        getSubFolders,
        toggleSelected,
        toggleDropdown,
        ToggleAllSelectedFolders,
        toggleSelectAllChildList,
        setNewFolderName,
        setFolderInputActive,
        setSelectedFolder,
        setShowDropdown,
        setSubFolderLoadingState,
        setFolderChildList,
        setSelectAllFolders,
    };
};