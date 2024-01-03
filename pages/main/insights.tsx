import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import { useEffect } from "react";
import { pages } from "../../constants/analytics";
import Analytics from "../../components/analytics";
import React from "react";
import useAnalytics from "../../hooks/useAnalytics";

const OverviewPage = () => {

  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.INSIGHTS)
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
