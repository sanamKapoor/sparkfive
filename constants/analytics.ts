// Data Collection

export const pages = {
  LOGIN: "LOGIN",
  AUTH_CALLBACK: "AUTH_CALLBACK",
  TWO_FECTOR: "TWO_FECTOR",
  SIGNUP: "SIGNUP",
  TRIAL_SIGNUP: "TRIAL_SIGNUP",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  RESET_PASSWORD: "RESET_PASSWORD",
  REQUEST_ACCESS: "REQUEST_ACCESS",
  PAYMENT: "PAYMENT",
  HOME: "HOME",
  SHARED_LINKS: "SHARED_LINKS",
  GUEST_UPLOAD: "GUEST_UPLOAD",
  COLLECTIONS: "COLLECTIONS",
  ASSETS: "ASSETS",
  OVERVIEW: "OVERVIEW",
  SCHEDULE: "SCHEDULE",
  TASKS: "TASKS",
  PROJECTS: "PROJECTS",
  CAMPAIGNS: "CAMPAIGNS",
  SETUP: "SETUP",
  USER_SETTING: "USER_SETTING",
  UPLOAD_APPROVAL: "UPLOAD_APPROVAL",
  ASSETS_DELETE: "ASSET_DELETE",
  INSIGHTS: "INSIGHTS",

  // previously they were pages, but now they are tabs inside user-settings. Still we will track those sections as page visit

  PROFILE: "PROFILE",
  NOTIFICATIONS: "NOTIFICATIONS",
  INTEGRATIONS: "INTEGRATIONS",
  BILLING: "BILLING",
  COMPANY: "COMPANY",
  SECURITY: "SECURITY",
  TEAM: "TEAM",
  ATTRIBUTES: "ATTRIBUTES",
  CUSTOM_SETTINGS: "CUSTOM_SETTINGS",
  GUEST_UPLOAD_LINKS: "GUEST_UPLOAD_LINKS",
};

export const events = {
  LOGOUT: "LOGOUT",
  UPLOAD_ASSET: "UPLOAD_ASSET",
  SEARCH_ASSET: "SEARCH_ASSET",
  VIEW_ASSET: "VIEW_ASSET",
  DOWNLOAD_ASSET: "DOWNLOAD_ASSET",
  SHARE_ASSET: "SHARE_ASSET",
  DOWNLOAD_COLLECTION: "DOWNLOAD_COLLECTION",
  SHARE_COLLECTION: "SHARE_COLLECTION",
  VIEW_TAB: "VIEW_TAB",
};

export const shareLinkEvents = {
  DOWNLOAD_SHARED_ASSET: "DOWNLOAD_SHARED_ASSET",
  VIEW_SHARED_ASSET: "VIEW_SHARED_ASSET",
  ACCESS_SHARED_LINK: "ACCESS_SHARED_LINK",
};

export const eventTypes = {
  TRACK: "TRACK",
  IDENTITY: "IDENTITY",
  PAGE: "PAGE",
};

// Data Presentation

export const AnalyticsLayoutSection = {
  DASHBOARD: "DASHBOARD",
  ACCOUNT_USERS: "ACCOUNT_USERS",
  ACCOUNT_ASSETS: "ACCOUNT_ASSETS",
  TEAM: "TEAM",
  EXTERNAL_USERS: "EXTERNAL_USERS",
  EXTERNAL_ASSETS: "EXTERNAL_ASSETS",
  SHARED_LINK: "SHARED_LINK",
};

export const AnalyticsRoutes = {
  DASHBOARD: "/main/insights",
  ACCOUNT_USERS: "/main/insights/account/users",
  ACCOUNT_ASSETS: "/main/insights/account/assets",
  ACCOUNT_TEAM: "/main/insights/account/team",
  EXTERNAL_USERS: "/main/insights/external/users",
  EXTERNAL_ASSETS: "/main/insights/external/assets",
  EXTERNAL_LINK: "/main/insights/external/links",
};

export const AnalyticsActiveModal = {
  USER_ACTIVITY: "activity",
  ASSET_CHART: "chart",
};

export const DashboardSections = {
  TEAM: "team?sessionOnly=true",
  USER: "dashboard-users",
  ASSET: "assets",
  USER_ACTIVITY: "user-activity",
};

export const TableBodySection = {
  USER_ACTIVITY: "activity",
  USER: "users",
  ASSET: "assets",
  DASHBOARD_ASSETS: 'dashboard-asset',
  DASHBOARD_USERS: 'dashboard-user'
};

export const InsightsApiEndpoint = {
  USER: "users",
  ASSET: "assets",
  TEAM: "team",
  USER_ACTIVITY: "user-activity",
};

export const ChartLines = {
  views: {
    label: 'Views',
    borderColor: "#E2407B",
    backgroundColor:"rgba(252, 236, 242, 0.6)",
    fill: true,
  },
  downloads: {
    label: 'Downloads',
    borderColor: "#2484F4",
    backgroundColor: "rgba(168, 173, 237, 0.6)",

    fill: true,
  },
  shares: {
    label: 'Shares',
    borderColor: "#EEBA01",
    backgroundColor:"rgba(255,255,0,0.1)",
    fill: true,
  },
  sessionCount: {
    label: 'Sessions',
    borderColor: "#10BDA5",
    backgroundColor:"rgba(16,189,165,0.1)",
    fill: true,
  },
};

export const PAGE = 1;
export const LIMIT = 15;
export const DASHBOARD_REC_LIMIT = 6;
export const TABLE_REC_LEN = 15;
export const DASHBOARD_TABLE_REC_LEN = 6;
export const DASHBOARD_ASSET_TABLE_REC_LEN = 8;
export const ANALYTICS_DATE_FORMAT = "MM/dd/yy"
export const ANALYTICS_DATE_PLACEHOLDER = "MM/DD/YY"
