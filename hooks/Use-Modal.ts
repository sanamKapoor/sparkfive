import { useState, useContext } from "react";
import { FilterContext } from "../context";
import folderApi from "../server-api/folder";
// Defining interfaces
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
interface MoveModalReturnType {
    folders: Item[]; // Replace 'Item' with the actual type of your folders
    resultedSearchFolders: Item[]; // Replace 'Item' with the actual type
    selectedFolder: string[]; // Replace 'string' with the actual type
    newFolderName: string;
    folderInputActive: boolean;
    subFolderLoadingState: Map<string, boolean>; // Replace 'string' with the actual key type
    folderChildList: Map<string, string>; // Replace 'Item' and 'string' with actual types
    showDropdown: string[];
    selectAllFolders: Record<string, boolean>;
    input: string;
    selectedFolderCompleteObject?: Map<string, { name: string; parentId: string | null }>; // Replace 'Item' and 'string' with actual types

    setInput: (value: string) => void;
    filteredData: () => void;
    getFolders: () => void;
    setFolderChildListItems: (inputFolders: any, id: string, replace?: boolean) => void;
    getSubFolders: (id: string, page: number, replace: boolean) => Promise<Map<string, { results: Item[], next: number, total: number }>>;
    toggleSelected: (folderId: string, selected: boolean, subFolderToggle?: boolean, mainFolderId?: string, name?: string) => void;
    toggleDropdown: (folderId: string, replace: boolean) => void;
    ToggleAllSelectedFolders: (folderId: string, selectAll: boolean) => void;
    toggleSelectAllChildList: (folderId: string, name?: string) => void;
    setNewFolderName: (value: string) => void;
    setFolderInputActive: (value: boolean) => void;
    [key: string]: any
}

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
    const [selectedFolderCompleteObject, setSelectedFolderCompleteObject] = useState<Map<string, { name: string; parentId: string | null }>>(new Map());

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
            console.log(err);
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



        setSelectedFolderCompleteObject((map) => {
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
        setSelectedFolderCompleteObject((map) => {
            items.forEach(item => {
                for (const key in item) {
                    map.set(key, item[key]);
                }
            });
            return map
        })

    };
    // Handle folder selection toggle
    const toggleSelected = async (folderId: string, selected: boolean, subFolderToggle?: boolean, mainFolderId?: string, name = "") => {
        const actionFolderId = subFolderToggle ? mainFolderId : folderId;
        if (selected) {
            setSelectedFolder([...selectedFolder, folderId]);
            insertIdsIntoFolder([{ [folderId]: { "name": name, parentId: subFolderToggle ? mainFolderId : null } }])
            let selectedFolderArray: string[] = []
            const allChildIds: string[] = []
            if (!selectAllFolders[actionFolderId]) {
                if (folderChildList.has(actionFolderId)) {
                    const response = folderChildList.get(actionFolderId);
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
            removeIdsIntoFolder([folderId])
            if (selectAllFolders[actionFolderId]) {
                setSelectAllFolders((prev) => ({ ...prev, [actionFolderId]: false }))
            };
            // Remove on Icon click of selected folders on above modal in edit page  
            if (selectedFolderCompleteObject.get(actionFolderId).parentId) {
                setSelectAllFolders((prev) => ({ ...prev, [selectedFolderCompleteObject.get(actionFolderId).parentId]: false }))
            };
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

    const toggleSelectAllChildList = (folderId: string, name = "") => {
        if (selectAllFolders[folderId]) {
            ToggleAllSelectedFolders(folderId, false, name)
            setSelectAllFolders((prev) => ({ ...prev, [folderId]: false }));
        } else {
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
        selectedFolderCompleteObject,
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