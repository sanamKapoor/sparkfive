import { useContext } from "react";
import { eventTypes } from "../constants/analytics";
import { TeamContext, UserContext } from "../context";
import analyticsApi from "../server-api/analytics";
import cookiesUtils from "../utils/cookies";

const useAnalytics = () => {
  const { user } = useContext(UserContext);
  const { team } = useContext(TeamContext);
  const adminJWT = cookiesUtils.get("adminToken");

  const isTrackingEnabled = team?.analytics;

  // For all page track (No Auth)
  const pageVisit = (title: string) => {
    if (isTrackingEnabled && !adminJWT) {
      analyticsApi.captureAnalytics({
        title,
        eventType: eventTypes.PAGE,
        userId: user?.id || '',
        teamId: user?.team?.id || team?.id || '',
        url: window.location.href,
        domain: window.location.origin,
        path: window.location.pathname,
        search: window.location.search,
      });
    }
  };

  // For all events (Auth)
  const trackEvent = (eventName: string, infoObject?: Record<string, unknown>) => {        
    if (isTrackingEnabled && !adminJWT) {
      analyticsApi.captureAnalytics({
        eventType: eventTypes.TRACK,
        actionName: eventName,
        actionInfo: infoObject,
        userId: user?.id || null,
        teamId: user?.team?.id || team?.id || null,
      });
    }
  };

  // For shared links (No Auth)
  const trackLinkEvent = (eventName: string, infoObject?: Record<string, unknown>) => {    
    analyticsApi.captureSharedLinkAnalytics({
      eventType: eventTypes.TRACK,
      actionName: eventName,
      actionInfo: infoObject,
    });
  };

  // For User Login (No Auth)
  const identify = (infoObject?: Record<string, unknown>) => {    
    analyticsApi.captureAnalytics({
      eventType: eventTypes.IDENTITY,
      ...infoObject,
    });
  };

  return { pageVisit, trackEvent, trackLinkEvent, identify };
};

export default useAnalytics;
