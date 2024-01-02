import { useState, useContext } from "react";
import { FilterContext } from "../context";
import folderApi from "../server-api/folder";
// Defining interfaces
import { Item, MoveModalReturnType } from "../interfaces/modal/use-modal-hook"
export const useCollectionMoveModal = (parentId: string | null): MoveModalReturnType => {
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
            const filteredParent = data.filter((folder: Item) => {
                return (!folder?.parentId && folder.id !== parentId)
            })
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

    const toggleSelected = async (
        folderId: string,
        selected: boolean,
    ) => {
        if (selected) {
            setSelectedFolder([folderId]);
        } else {
            setSelectedFolder([]);
        }
    }


    // Handle dropdown toggle for displaying subfolders
    const toggleDropdown = async (folderId: string, replace: boolean) => {
        if (!showDropdown.includes(folderId)) {
            await getSubFolders(folderId, 1, replace);
            setShowDropdown([...showDropdown, folderId])
        } else {
            setShowDropdown(showDropdown.filter((item) => item !== folderId));
        }
    };


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
        setInput,
        filteredData,
        getFolders,
        setFolderChildListItems,
        getSubFolders,
        toggleSelected,
        toggleDropdown,
        setNewFolderName,
        setFolderInputActive,
        setSelectedFolder,
        setShowDropdown,
        setSubFolderLoadingState,
        setFolderChildList,
        setSelectAllFolders,
    };
};