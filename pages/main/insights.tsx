import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import { useContext, useEffect } from "react";
import { pages } from "../../constants/analytics";
import Analytics from "../../components/analytics";
import React from "react";
import useAnalytics from "../../hooks/useAnalytics";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import AnalyticsProvider from "../../context/analytics-provider";

const OverviewPage = () => {

  const router = useRouter();
  const { pageVisit } = useAnalytics();
  const { user } = useContext(UserContext);

  useEffect(() => {
    pageVisit(pages.INSIGHTS);
  }, []);

  useEffect(() => {
    if (!user || !user?.team?.analytics || user?.roleId !== 'admin') {
      router.replace("/main/assets")
    }
  }, [user])

  return (
    <>
      <AppLayout title="Overview">
        <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
          <AnalyticsProvider>
            <Analytics />
          </AnalyticsProvider>
        </MainLayout>
      </AppLayout>
    </>
  )
};

export default OverviewPage;
