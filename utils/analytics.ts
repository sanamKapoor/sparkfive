import { AnalyticsActiveModal, AnalyticsLayoutSection } from "../constants/analytics";
import { ANALYTICS_DOWNLOADED, ASSET_CHART_DOWNLOADED, TOP_ASSETS_DOWNLOADED, USERS_ENG_DOWNLOADED, USER_ACTIVITY_DOWNLOADED } from "../constants/messages";

export const getCSVFileName = (section: string) => {
    switch(section){
        case AnalyticsLayoutSection.ACCOUNT_USERS:
            return {
                fileName: `User-Engagement-${new Date().getTime()}`,
                successMsg: USERS_ENG_DOWNLOADED
            }
        case AnalyticsLayoutSection.ACCOUNT_ASSETS:
            return {
                fileName: `Top-Assets-${new Date().getTime()}`,
                successMsg: TOP_ASSETS_DOWNLOADED
            }
        case AnalyticsActiveModal.USER_ACTIVITY:
            return {
                fileName: `User-Activities-${new Date().getTime()}`,
                successMsg: USER_ACTIVITY_DOWNLOADED
            }
        case AnalyticsActiveModal.ASSET_CHART:
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

export const handleBlobDownload = (fileName: string, data: Blob) => {
    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(data);

    // Create a link element
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger a click event on the link to initiate the download
    link.click();

    // Remove the link from the document body
    document.body.removeChild(link);

    // Revoke the URL to release memory resources
    URL.revokeObjectURL(blobUrl);
}