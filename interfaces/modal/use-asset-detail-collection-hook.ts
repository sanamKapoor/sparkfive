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
    childFolders?: Item[]
}

export interface MoveModalReturnType {
    folders: Item[];
    resultedSearchFolders: Item[];
    selectedFolder: string[];
    subFolderLoadingState: Map<string, boolean>;
    folderChildList: Map<string, { results: Item[], next: number, total: number }>;
    showDropdown: string[];
    input: string;
    completeSelectedFolder?: Map<string, { name: string; parentId: string | null }>;

    setInput: (value: string) => void;
    filteredData: () => void;
    getFolders: () => void;
    setFolderChildListItems: (inputFolders: any, id: string, replace?: boolean) => void;
    getSubFolders: (id: string, page: number, replace: boolean) => Promise<Map<string, { results: Item[], next: number, total: number }>>;
    toggleSelected: (folderId: string, selected: boolean, subFolderToggle?: boolean, mainFolderId?: string, name?: string) => void;
    toggleDropdown: (folderId: string, replace: boolean) => void;
    [key: string]: any
}
export type FolderType = {
    id: string;
    name: string;
    [key: string]: any
};