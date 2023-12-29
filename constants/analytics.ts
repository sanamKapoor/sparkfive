export const pages = {
    LOGIN: 'LOGIN',
    AUTH_CALLBACK: 'AUTH_CALLBACK',
    TWO_FECTOR: 'TWO_FECTOR',
    SIGNUP: 'SIGNUP',
    TRIAL_SIGNUP: 'TRIAL_SIGNUP',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    RESET_PASSWORD: 'RESET_PASSWORD',
    REQUEST_ACCESS: 'REQUEST_ACCESS',
    PAYMENT: 'PAYMENT',
    HOME: 'HOME',
    SHARED_LINKS: 'SHARED_LINKS',
    GUEST_UPLOAD: 'GUEST_UPLOAD',
    COLLECTIONS: 'COLLECTIONS',
    ASSETS: 'ASSETS',
    OVERVIEW: 'OVERVIEW',
    SCHEDULE: 'SCHEDULE',
    TASKS: 'TASKS',
    PROJECTS: 'PROJECTS',
    CAMPAIGNS: 'CAMPAIGNS',
    SETUP: 'SETUP',
    USER_SETTING: 'USER_SETTING',
    UPLOAD_APPROVAL: 'UPLOAD_APPROVAL',
    ASSETS_DELETE: 'ASSET_DELETE',
    INSIGHTS: 'INSIGHTS',

    // previously they were pages, but now they are tabs inside user-settings. Still we will track those sections as page visit

    PROFILE: 'PROFILE',
    NOTIFICATIONS: 'NOTIFICATIONS',
    INTEGRATIONS: 'INTEGRATIONS',
    BILLING: 'BILLING',
    COMPANY: 'COMPANY',
    SECURITY: 'SECURITY',
    TEAM: 'TEAM',
    ATTRIBUTES: 'ATTRIBUTES',
    CUSTOM_SETTINGS: 'CUSTOM_SETTINGS',
    GUEST_UPLOAD_LINKS: 'GUEST_UPLOAD_LINKS',
}

export const events = {
    LOGOUT: 'LOGOUT',
    UPLOAD_ASSET: 'UPLOAD_ASSET', 
    SEARCH_ASSET:'SEARCH_ASSET', // Done
    VIEW_ASSET: 'VIEW_ASSET',
    DOWNLOAD_ASSET: 'DOWNLOAD_ASSET',
    SHARE_ASSET: 'SHARE_ASSET',
    DOWNLOAD_COLLECTION: 'DOWNLOAD_COLLECTION',
    SHARE_COLLECTION:'SHARE_COLLECTION',
    DOWNLOAD_SHARED_ASSET: 'DOWNLOAD_SHARED_ASSET',
    VIEW_SHARED_ASSET: 'VIEW_SHARED_ASSET',
    ACCESS_SHARED_LINK: 'ACCESS_SHARED_LINK',
    VIEW_TAB: 'VIEW_TAB'
}