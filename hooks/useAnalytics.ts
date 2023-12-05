import { useContext } from "react";
import { UserContext } from "../context";
import AnalyticsService from "../utils/analytics-service";

const useAnalytics = () => {
  const { insightAllowed, advancedConfig } = useContext(UserContext);

  const isTrackingEnabled = advancedConfig?.insights || insightAllowed;

  const trackPage = (pageName: string) => {
    // if (isTrackingEnabled || pageName === "LOGIN") {
      AnalyticsService.trackPage(pageName);
    // }
  };

  const trackEvent = (
    eventName: string,
    infoObject?: Record<string, unknown>
  ) => {
    // if (isTrackingEnabled || eventName === "LOGOUT") {
      AnalyticsService.trackEvent('USER_ACTION', {
        actionName: eventName,
        actionInfo: infoObject
      });
    // }
  };

  const identify = (userId: string, infoObject?: Record<string, unknown>) => {
    AnalyticsService.identify(userId, infoObject);
  };

  return { trackPage, trackEvent, identify };
};

export default useAnalytics;
