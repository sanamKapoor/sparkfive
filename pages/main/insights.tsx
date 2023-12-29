import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import { useEffect } from "react";
import { pages } from "../../constants/analytics";
import Analytics from "../../components/analytics";
import React from "react";
import usePageInfo from "../../hooks/usePageInfo";
import analyticsApi from "../../server-api/analytics";

const OverviewPage = () => {

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.INSIGHTS, ...data })
  }, []);

  return (
    <>
      <AppLayout title="Overview">
        <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
          <Analytics />
        </MainLayout>
      </AppLayout>
    </>
  )
};

export default OverviewPage;
