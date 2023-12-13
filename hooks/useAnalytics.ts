import { useContext } from "react";
import { TeamContext, UserContext } from "../context";
import AnalyticsService from "../utils/analytics-service";

const useAnalytics = () => {
  const { user } = useContext(UserContext);
  const { team } = useContext(TeamContext);

  const isTrackingEnabled = user?.team?.analytics || team?.analytics;

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

  const group = (groupId: string, infoObject?: Record<string, unknown>) => {
    AnalyticsService.group(groupId, infoObject);
  };

  return { trackPage, trackEvent, identify, group };
};

export default useAnalytics;
