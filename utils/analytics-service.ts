export default class AnalyticsService {
    static trackPage(pageName: string): void {
      window.analytics.page(pageName);
    }
  
    static trackEvent(
      eventName: string,
      infoObject?: Record<string, unknown>
    ): void {
      window.analytics.track(eventName, infoObject);
    }
  
    static identify(userId: string, infoObject?: Record<string, unknown>): void {
      window.analytics.identify(userId, infoObject);
    }
  }
  