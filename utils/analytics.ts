import { analyticsActiveModal, analyticsLayoutSection } from "../constants/analytics";
import { ANALYTICS_DOWNLOADED, ASSET_CHART_DOWNLOADED, TOP_ASSETS_DOWNLOADED, USERS_ENG_DOWNLOADED, USER_ACTIVITY_DOWNLOADED } from "../constants/messages";

export const getCSVFileName = (section: string) => {
    switch(section){
        case analyticsLayoutSection.ACCOUNT_USERS:
            return {
                fileName: `User-Engagement-${new Date().getTime()}`,
                successMsg: USERS_ENG_DOWNLOADED
            }
        case analyticsLayoutSection.ACCOUNT_ASSETS:
            return {
                fileName: `Top-Assets-${new Date().getTime()}`,
                successMsg: TOP_ASSETS_DOWNLOADED
            }
        case analyticsActiveModal.USER_ACTIVITY:
            return {
                fileName: `User-Activities-${new Date().getTime()}`,
                successMsg: USER_ACTIVITY_DOWNLOADED
            }
        case analyticsActiveModal.ASSET_CHART:
            return {
                fileName: `Asset-Stats-${new Date().getTime()}`,
                successMsg: ASSET_CHART_DOWNLOADED
            }
        default:
            return {
                fileName: `Analytics-${new Date().getTime()}`,
                successMsg: ANALYTICS_DOWNLOADED
            }
    }
}