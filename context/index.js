import { createContext } from "react";
import { calculateBeginDate } from "../config/data/filter";
import { AnalyticsLayoutSection } from "../constants/analytics";

export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (value) => { },
});

export const AnalyticsContext = createContext({
  apiEndpoint: "",
  activeSection: AnalyticsLayoutSection.DASHBOARD,
  search: '',
  filter: {
    endDate: new Date(),
    beginDate: calculateBeginDate(7, 1)
  },
  customDates: false,
  sortBy: '',
  sortOrder: true,
  page: 1,
  limit: 3,
  error: "",
  data: [],
  loading: false,
  tableLoading: false,
  totalRecords: 0,
  downloadCSV: false,
  initialRender: true,
  tableRows: 15,
  dashboardView: false,
  dashboardData: {},
  sortFor: [],
  filterFor: [],
  customDatesFor: [],
  errorFor: [],
  loadingFor: [],
  tableLoadingFor: [],
  setActiveSection: (value) => { },
  setApiEndpoint: (value) => { },
  setSearch: (value) => { },
  setFilter: (value) => { },
  setCustomDates: (value) => { },
  setSortBy: (value) => { },
  setSortOrder: (value) => { },
  setPage: (value) => { },
  setLimit: (value) => { },
  setError: (value) => { },
  setData: (value) => { },
  setLoading: (value) => { },
  setTableLoading: (value) => { },
  setTotalRecords: (value) => { },
  setDownloadCSV: (value) => { },
  setInitialRender: (value) => { },
  setTableRows: (value) => { },
  setDashboardView: (value) => { },
  setSortFor: (value) => { },
  setFilterFor: (value) => { },
  setDashboardData: (value) => { },
  setCustomDatesFor: (value) => { },
  setErrorFor: (value) => { },
  setLoadingFor: (value) => { },
  setTableLoadingFor: (value) => { },
});

export const UserContext = createContext({
  user: null,
  setUser: (user) => { },
  advancedConfig: null,
  setAdvancedConfig: (config) => { },
  fetchUser: (redirectUser) => { },
  logOut: () => { },
  hasPermission: (requiredPermissions, requiredTeamSetting) => {
    return true;
  },
  afterAuth: ({ twoFactor, token }) => { },
  initialLoadFinished: false,
  vanityCompanyInfo: undefined,
  cdnAccess: false,
  transcriptAccess: false,
  logo: "",
  setLogo: (logo) => { },
  logoId: "",
  resetLogo: () => { },
  faceRecognitionSettings: {},
  setFaceRecognitionSettings: (value) => { },
});

export const ThemeContext = createContext({
  theme: "light",
  setTheme: () => { },
});

export const LanguageContext = createContext({
  language: "en",
  setLanguage: () => { },
});

export const DragContext = createContext({
  item: null,
  setItem: (item) => { },
});

export const AssetContext = createContext({
  nextPage: 0,
  totalAssets: 0,
  assets: [],
  setAssets: (assets, replace) => { },
  lastUploadedFolder: undefined,
  setLastUploadedFolder: (folder) => { },
  completedAssets: [],
  setCompletedAssets: (assets, replace) => { },
  folders: [],
  setFolders: (folders, replace, ignoreTotalItems) => { },
  setPlaceHolders: (type, replace) => { },
  operationAsset: null,
  setOperationAsset: (asset) => { },

  selectedAllAssets: false,
  selectAllAssets: (isSelected) => { },

  selectedAllFolders: false,
  selectAllFolders: (isSelected) => { },

  loadingAssets: false,
  setLoadingAssets: (loading) => { },

  operationFolder: null,
  setOperationFolder: (folder) => { },

  activeOperation: "",
  setActiveOperation: (op) => { },

  activeFolder: "",
  setActiveFolder: (folderId) => { },

  activePageMode: "",
  setActivePageMode: (mode) => { },

  needsFetch: "",
  setNeedsFetch: (type) => { },

  addedIds: [],
  setAddedIds: (idList) => { },

  uploadingStatus: "",
  showUploadProcess: (value, fileIndex) => { },
  uploadingFile: undefined,
  uploadRemainingTime: "",
  uploadingPercent: 0,
  setUploadingPercent: (value) => { },
  uploadingAssets: [],
  setUploadingAssets: (assets) => { },
  uploadingType: "",
  setUploadingType: (uploadingType) => { },
  uploadDetailOverlay: false,
  setUploadDetailOverlay: (show) => { },
  reUploadAsset: (i, assets, currentDataClone, totalSize, retryList, folderId, folderGroups, subFolderAutoTag) => { },

  uploadingFileName: "",
  setUploadingFileName: (name) => { },

  folderGroups: {},
  setFolderGroups: (value) => { },

  uploadSourceType: undefined,
  dropboxUploadingFile: undefined,
  folderImport: false,
  setFolderImport: (value) => { },
  setUploadSourceType: (value) => { },

  setTotalAssets: (value) => { },

  downloadingPercent: 0,
  downloadingStatus: "none",
  totalDownloadingAssets: 0,
  downloadingError: "",
  updateDownloadingStatus: (status, percent, totalAssets, error) => { },
  retryListCount: 0,
  detailOverlayId: undefined,
  setDetailOverlayId: (id) => { },

  operationAssets: [],
  setOperationAssets: (value) => { },

  currentViewAsset: undefined,
  setCurrentViewAsset: (asset) => { },

  // Active folder for subListing
  activeSubFolders: "",
  setActiveSubFolders: (subFolderIds) => { },

  // Sidenav parent Folder List
  sidenavFolderList: [],
  setSidenavFolderList: (folders, replace, ignoreTotalItems) => { },

  // Sidenav parent Folder Next page list
  sidenavFolderNextPage: 0,
  setSidenavFolderNextPage: () => { },

  // Sidenav parent Folder count
  sidenavTotalCollectionCount: 0,
  setSidenavTotalCollectionCount: (value) => { },

  sidenavFolderChildList: {},
  setSidenavFolderChildList: (data, id, replace) => { },
  // side bar open close button click
  sidebarOpen: true,
  setSidebarOpen: (sidebarValue) => { },

  //sub collection page sub folders listing items
  setSubFoldersViewList: (data, replace) => { },
  subFoldersViewList: { results: [], next: 0, total: 0 },

  //sub collection page sub assets listing items
  subFoldersAssetsViewList: { results: [], next: 0, total: 0 },
  setSubFoldersAssetsViewList: (data, replace) => { },

  // Landing Page Header Type(text)
  setHeaderName: (name) => { },
  headerName: "",

  // Sub Collection select All Folders and assets in subCollection
  selectedAllSubFoldersAndAssets: false,
  setSelectedAllSubFoldersAndAssets: (value) => { },
  selectedAllSubAssets: false,
  setSelectedAllSubAssets: (value) => { },
  setListUpdateFlag: (value) => { },
  listUpdateFlag: false,
  appendNewSubSidenavFolders: (inputFolders, id, remove, removeId) => { },
  downloadController: undefined,
  setDownloadController: (controller) => { },
  currentFolder: null,
  setCurrentFolder: (value) => { },
  showSubCollectionContent: false,
  setShowSubCollectionContent: (value) => { },
  history: "",
  setHistory: (value) => { },
  assetDragFlag: false,
  setAssetDragFlag: (value) => { },
  assetDragId: "",
  setAssetDragId: (value) => { },
  assetDragType: "",
  setAssetDragType: (value) => { },
  setDroppableId: (value) => { },
  droppableId: "",
  collectionDragFlag: false,
  setCollectionDragFlag: (value) => { },
  collectionDragId: "",
  setCollectionDragId: (value) => { },
  collectionParentDragId: "",
  setCollectionParentDragId: (value) => { },
  subCollectionMove: false,
  setSubCollectionMove: (value) => { },
  faceRecognitionScanningPercent: 0,
  faceRecognitionScanning: false,
  setFaceRecognitionScanning: (value) => { },
});

export const TeamContext = createContext({
  team: null,
  patchTeam: (patchData) => { },
  getTeam: (once) => { },
  setTeam: (team) => { },
  teamMembers: [],
  setTeamMembers: (data) => { },
  getTeamMembers: () => { },

  plan: null,
  getPlan: (data) => { },
});

export const LocationContext = createContext({
  countries: [],
  loadCountries: () => { },

  states: [],
  loadStates: (countryId) => { },

  cities: [],
  loadCities: (stateId) => { },
});

export const ScheduleContext = createContext({
  newItem: undefined,
  setNewItem: (item) => { },
  needItemsReset: false,
  setNeedItemReset: (newValue) => { },
});

export const FilterContext = createContext({
  searchFilterParams: {},
  setSearchFilterParams: (val) => { },

  activeSortFilter: {},
  setActiveSortFilter: (val) => { },

  term: "",
  setSearchTerm: (value) => { },

  tags: [],
  loadTags: (params) => { },

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
    retailers: [],
  },
  loadProductFields: () => { },
  setSharePath: (path) => { },
  loadAll: () => { },

  loadSharedFolders: (ignoreCurrentSelectedFolder, sharePath) => { },

  isPublic: false,
  sharePath: "",
  renderFlag: false,
  setRenderedFlag: (val) => { },
  preparingAssets: { current: "" },
});

export const ShareContext = createContext({
  folderInfo: undefined,
  setFolderInfo: (folderInfo) => { },
  activePasswordOverlay: true,
  email: "",
  setEmail: (value) => { },
  setActivePasswordOverlay: (value) => { },
});

export const SocketContext = createContext({
  socket: undefined,
  connected: false,
  globalListener: true, // listener will be initialized in any context's child
  socketLogout: () => { },
  connectSocket: (token) => { },
});

export const GuestUploadContext = createContext({
  logo: "",
  updateLogo: (url) => { },
  banner: "",
  setBanner: (banner) => { },
});

export const AssetDetailContext = createContext({
  sharePath: "",
  isShare: "",
  asset: {},
  realUrl: "",
  activeFolder: "",
  thumbnailUrl: "",
  initialParams: {},
  setSharePath: (data) => { },
  setisShare: (data) => { },
  setAsset: (record) => { },
  setrealUrl: (data) => { },
  setactiveFolder: (data) => { },
  setThumbnailURL: (data) => { },
  setInitialParam: (record) => { },
});
