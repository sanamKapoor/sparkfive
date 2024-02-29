import { FilterAttributeVariants, IDateRange } from "../../interfaces/filters";

export const calculateBeginDate = (daysAgo: number, extra = 0) => {
  const endDate = new Date();
  const beginDate = new Date(endDate);
  beginDate.setDate(endDate.getDate() - daysAgo + extra);
  return beginDate;
};

export const dateRanges: IDateRange[] = [
  {
    id: "today",
    label: "Today",
    beginDate: calculateBeginDate(0),
    endDate: new Date(),
  },
  {
    id: "yesterday",
    label: "Yesterday",
    beginDate: calculateBeginDate(1),
    endDate: calculateBeginDate(1),
  },
  {
    id: "last7Days",
    label: "Last 7 days",
    beginDate: calculateBeginDate(7),
    endDate: new Date(),
  },
  {
    id: "last30Days",
    label: "Last 30 days",
    beginDate: calculateBeginDate(30),
    endDate: new Date(),
  },
  {
    id: "last90Days",
    label: "Last 90 days",
    beginDate: calculateBeginDate(90),
    endDate: new Date(),
  },
  {
    id: "last365Days",
    label: "Last 365 days",
    beginDate: calculateBeginDate(365),
    endDate: new Date(),
  },
];

export const filterKeyMap = {
  [FilterAttributeVariants.TAGS]: "filterNonAiTags",
  [FilterAttributeVariants.AI_TAGS]: "filterAiTags",
  [FilterAttributeVariants.CAMPAIGNS]: "filterCampaigns",
  [FilterAttributeVariants.PRODUCTS]: "filterProductSku",
  [FilterAttributeVariants.FILE_TYPES]: "filterFileTypes",
  [FilterAttributeVariants.ORIENTATION]: "filterOrientations",
  [FilterAttributeVariants.RESOLUTION]: "filterResolutions",
  [FilterAttributeVariants.DATE_UPLOADED]: "dateUploaded",
  [FilterAttributeVariants.LAST_UPDATED]: "lastUpdated",
  [FilterAttributeVariants.DIMENSIONS]: "dimensions",
};

export const ruleKeyMap = {
  [FilterAttributeVariants.TAGS]: "allNonAiTags",
  [FilterAttributeVariants.AI_TAGS]: "allAiTags",
  [FilterAttributeVariants.CAMPAIGNS]: "allCampaigns",
};

export const rulesMapper = {
  all: "All Selected",
  any: "Any Selected",
  none: "No Tags",
};

//TODO

export const initialActiveSortFilters: any = {
  filterCampaigns: [],
  filterChannels: [],
  filterNonAiTags: [],
  filterAiTags: [],
  filterFolders: [],
  filterProjects: [],
  filterFileTypes: [],
  filterOrientations: [],
  filterProductFields: [],
  filterProductSku: undefined,
  filterProductType: [],
  filterCustomFields: [],
  filterResolutions: [],
  filterFaceRecognitions: [],
  allNonAiTags: "all",
  allAiTags: "all",
  allCampaigns: "all",
  allProjects: "all",
  dimensionWidth: undefined,
  dimensionHeight: undefined,
  beginDate: undefined,
  endDate: undefined,
  fileModifiedBeginDate: undefined,
  fileModifiedEndDate: undefined,
  dateUploaded: undefined,
  lastUpdated: undefined,
};

export const labelKeyMap = {
  filterProductSku: "sku",
  filterAiTags: "name",
  filterNonAiTags: "name",
  filterFileTypes: "value",
  lastUpdated: "label",
  dateUploaded: "label",
  filterOrientations: "name",
  filterResolutions: "label",
};
