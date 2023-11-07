export interface Asset {
    id: string;
    name: string;
    type: string;
    thumbailUrl: string;
    realUrl: string;
    extension: string;
    version: number;
}
export interface Item {
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
export interface MoveModalReturnType {
    folders: Item[]; // Replace 'Item' with the actual type of your folders
    resultedSearchFolders: Item[]; // Replace 'Item' with the actual type
    selectedFolder: string[]; // Replace 'string' with the actual type
    newFolderName: string;
    folderInputActive: boolean;
    subFolderLoadingState: Map<string, boolean>; // Replace 'string' with the actual key type
    folderChildList: Map<string, { results: Item[], next: number, total: number }>; // Replace 'Item' and 'string' with actual types
    showDropdown: string[];
    selectAllFolders: Record<string, boolean>;
    input: string;
    completeSelectedFolder?: Map<string, { name: string; parentId: string | null }>; // Replace 'Item' and 'string' with actual types

    setInput: (value: string) => void;
    filteredData: () => void;
    getFolders: () => void;
    setFolderChildListItems: (inputFolders: any, id: string, replace?: boolean) => void;
    getSubFolders: (id: string, page: number, replace: boolean) => Promise<Map<string, { results: Item[], next: number, total: number }>>;
    toggleSelected: (folderId: string, selected: boolean, subFolderToggle?: boolean, mainFolderId?: string, name?: string, customRole?: boolean) => void;
    toggleDropdown: (folderId: string, replace: boolean) => void;
    ToggleAllSelectedFolders: (folderId: string, selectAll: boolean) => void;
    toggleSelectAllChildList: (folderId: string, name?: string) => void;
    setNewFolderName: (value: string) => void;
    setFolderInputActive: (value: boolean) => void;
    [key: string]: any
}