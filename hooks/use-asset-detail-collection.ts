

import { useState, useContext } from "react";
import { FilterContext } from "../context";
import folderApi from "../server-api/folder";
// Defining interfaces
import { Item, MoveModalReturnType, FolderType } from "../interfaces/modal/use-asset-detail-collection-hook"

export const useAssetDetailCollecion = (addFolder: (folder: FolderType) => void,
    updateAssetState: (assetId: any) => void,
    originalFolder: FolderType[],
    deleteFolder: (folderId: string, updatedArray: FolderType[]) => void): MoveModalReturnType => {

    const [folders, setFolders] = useState([]);
    const [resultedSearchFolders, setResultedSearchFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState<string[]>([]);
    const [subFolderLoadingState, setSubFolderLoadingState] = useState(new Map());
    const [folderChildList, setFolderChildList] = useState(new Map());
    const [showDropdown, setShowDropdown] = useState([]);
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

    // Handle folder selection toggle
    const toggleSelected = async (folderId: string, selected: boolean, subFolderToggle?: boolean, mainFolderId?: string, name = "") => {
        if (selected) {
            setSelectedFolder([...selectedFolder, folderId]);
            insertIdsIntoFolder([{ [folderId]: { "name": name, parentId: subFolderToggle ? mainFolderId : null } }])
            await addFolder({ id: folderId, name: name });
            updateAssetState({
                folders: { $set: [...originalFolder, { id: folderId, name: name }] },
            });
        } else {
            setSelectedFolder(selectedFolder.filter((item) => item !== folderId));
            removeIdsIntoFolder([folderId])
            await deleteFolder(folderId, originalFolder?.filter((folder: { id: string, [key: string]: any }) => { folder.id !== folderId }))
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

    // Return all state values and handlers
    return {
        folders,
        resultedSearchFolders,
        selectedFolder,
        subFolderLoadingState,
        folderChildList,
        showDropdown,
        input,
        completeSelectedFolder,
        setInput,
        filteredData,
        getFolders,
        setFolderChildListItems,
        getSubFolders,
        toggleSelected,
        toggleDropdown,
        setSelectedFolder,
        setShowDropdown,
        setSubFolderLoadingState,
        setFolderChildList,
        keyResultsFetch,
        keyExists
    };

};