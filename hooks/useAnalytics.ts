import { useContext } from "react";
import { eventTypes } from "../constants/analytics";
import { TeamContext, UserContext } from "../context";
import analyticsApi from "../server-api/analytics";
import { checkIfPLanIsActive } from "../utils/team";

const useAnalytics = () => {
  const { user } = useContext(UserContext);
  const { team } = useContext(TeamContext);

  const isTrackingEnabled = user?.team?.analytics || team?.analytics;
  const plan = user?.team?.plan?.name || team?.plan?.name;

  const pageVisit = (title: string) => {
    if (isTrackingEnabled) {
      analyticsApi.captureAnalytics({
        title,
        eventType: eventTypes.PAGE,
        userId: user?.id || null,
        url: window.location.href,
        origin: window.location.origin,
        path: window.location.pathname,
        search: window.location.search,
      });
    }
  };

  const trackEvent = (eventName: string, infoObject?: Record<string, unknown>) => {
    if (isTrackingEnabled) {
      analyticsApi.captureAnalytics({
        eventType: eventTypes.TRACK,
        actionName: eventName,
        actionInfo: infoObject,
        userId: user?.id || null,
      });
    }
  };

  const identify = (infoObject?: Record<string, unknown>) => {
    if (isTrackingEnabled) {
      analyticsApi.captureAnalytics({
        eventType: eventTypes.IDENTITY,
        ...infoObject,
      });
    }
  };

  return { pageVisit, trackEvent, identify };
};

export default useAnalytics;
