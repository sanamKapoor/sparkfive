import { useContext } from "react";
import { TeamContext, UserContext } from "../context";
import analyticsApi from "../server-api/analytics";
import { eventTypes } from "../constants/analytics";

const useAnalytics = () => {
  const { user } = useContext(UserContext);
  const { team } = useContext(TeamContext);

  const isTrackingEnabled = user?.team?.analytics || team?.analytics;

  const trackPage = (pageName: string) => {    
    // if (isTrackingEnabled || pageName === "LOGIN") {
    // }
  };

  const trackEvent = (
    eventName: string,
    infoObject?: Record<string, unknown>
  ) => {
    // if (isTrackingEnabled || eventName === "LOGOUT") {
      analyticsApi.capturePageVisit({
        eventType: eventTypes.TRACK,
        actionName: eventName,
        actionInfo: infoObject,
        userId: user?.id || null
      })
    // }
  };

  const identify = (userId: string, infoObject?: Record<string, unknown>) => {
    analyticsApi.capturePageVisit({
      eventType: eventTypes.IDENTITY,
      userId,
      infoObject
    })
  };

  return { trackPage, trackEvent, identify };
};

export default useAnalytics;
