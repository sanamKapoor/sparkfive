import { createContext } from 'react'
import { create } from 'domain'

export const LoadingContext = createContext({
    isLoading: false,
    setIsLoading: (value) => { }
})

export const UserContext = createContext({
    user: null,
    setUser: (user) => { },
    advancedConfig: null,
    setAdvancedConfig: (config) => { },
    fetchUser: (redirectUser) => { },
    logOut: () => { },
    hasPermission: (requiredPermissions) => { return true },
    afterAuth: ({ twoFactor, token }) => { },
    vanityCompanyInfo: undefined,
    cdnAccess: false
})

export const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => { }
})

export const LanguageContext = createContext({
    language: "en",
    setLanguage: () => { }
})

export const DragContext = createContext({
    item: null,
    setItem: (item) => { }
})

export const AssetContext = createContext({
    nextPage: 0,
    totalAssets: 0,
    assets: [],
    setAssets: (assets, replace) => { },
    lastUploadedFolder: undefined,
	setLastUploadedFolder: (folder) => {},
    completedAssets: [],
    setCompletedAssets: (assets, replace) => { },
    folders: [],
    setFolders: (folders, replace, ignoreTotalItems) => { },
    setPlaceHolders: (type, replace) => { },
    operationAsset: null,
    setOperationAsset: (asset) => { },

    selectedAllAssets: false,
    selectAllAssets: (isSelected) => { },

    loadingAssets: false,
    setLoadingAssets: (loading) => { },

    operationFolder: null,
    setOperationFolder: (folder) => { },

    activeOperation: '',
    setActiveOperation: (op) => { },

    activeFolder: '',
    setActiveFolder: (folderId) => { },

    activePageMode: '',
    setActivePageMode: (mode) => { },

    needsFetch: '',
    setNeedsFetch: (type) => { },

    addedIds: [],
    setAddedIds: (idList) => { },

    uploadingStatus: '',
    showUploadProcess: (value, fileIndex) => { },
    uploadingFile: undefined,
    uploadRemainingTime: '',
    uploadingPercent: 0,
    uploadingAssets: [],
    setUploadingAssets: (assets) => { },
    uploadingType: '',
    setUploadingType: (uploadingType) => { },
    uploadDetailOverlay: false,
    setUploadDetailOverlay: (show) => { },
    reUploadAsset: (i, assets, currentDataClone, totalSize, retryList, folderId, folderGroups, subFolderAutoTag) => { },

    uploadingFileName: '',
    setUploadingFileName: (name) => { },


    folderGroups: {},
    setFolderGroups: (value) => { },

    uploadSourceType: undefined,
    dropboxUploadingFile: undefined,
    folderImport: false,
    setFolderImport: (value) => {},
    setUploadSourceType: (value) => { },

    setTotalAssets: (value) => { },

    downloadingPercent: 0,
    downloadingStatus: 'none',
    totalDownloadingAssets: 0,
    downloadingError: '',
    updateDownloadingStatus: (status, percent, totalAssets, error) => { },
    retryListCount: 0
})

export const TeamContext = createContext({
    team: null,
    patchTeam: (patchData) => { },
    getTeam: (once) => { },
    teamMembers: [],
    setTeamMembers: (data) => { },
    getTeamMembers: () => { },

    plan: null,
    getPlan: (data) => { },

})

export const LocationContext = createContext({
    countries: [],
    loadCountries: () => { },

    states: [],
    loadStates: (countryId) => { },

    cities: [],
    loadCities: (stateId) => { },
})

export const ScheduleContext = createContext({
    newItem: undefined,
    setNewItem: (item) => { },
    needItemsReset: false,
    setNeedItemReset: (newValue) => { }
})

export const FilterContext = createContext({

    activeSortFilter: {},
    setActiveSortFilter: (val) => { },

    term: "",
    setSearchTerm: (value) => {},

    tags: [],
    loadTags: () => { },

    customFields: [],
    loadCustomFields: (id, customFields) => { },
    setCustomFields: (val) => { },

    folders: [],
    loadFolders: (ignoreCurrentSelectedFolder) => { },
    loadAllFolders: () => { },

    campaigns: [],
    loadCampaigns: () => { },

    channels: [],
    loadChannels: () => { },

    projects: [],
    loadProjects: () => { },

    fileTypes: [],
    loadFileTypes: () => { },

    assetDimensionLimits: {},
    loadAssetDimensionLimits: () => { },

    assetOrientations: [],
    loadAssetOrientations: () => { },

    assetResolutions: [],
    loadAssetResolutions: () => { },

    productFields: {
        categories: [],
        vendors: [],
        retailers: []
    },
    loadProductFields: () => { },
    setSharePath: (path) => { },
    loadAll: () => { },

    isPublic: false,
    sharePath: ''
})

export const ShareContext = createContext({
    folderInfo: undefined,
    setFolderInfo: (folderInfo) => { }
})

export const SocketContext = createContext({
    socket: undefined,
    connected: false,
    globalListener: true, // listener will be initialized in any context's child
    socketLogout: () => { },
    connectSocket: (token) => { }
})

export const GuestUploadContext = createContext({
    logo: '',
    updateLogo: (url) => {}
})
