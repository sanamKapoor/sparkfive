import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import Overview from "../../components/main/overview";
import { useEffect } from "react";
import { pages } from "../../constants/analytics";
import usePageInfo from "../../hooks/usePageInfo";
import analyticsApi from "../../server-api/analytics";

const OverviewPage = () => {

const data = usePageInfo();

useEffect(() => {    
  analyticsApi.capturePageVisit({ name: pages.OVERVIEW, ...data })
},[]);

  return (
  <>
    <AppLayout title="Overview">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <Overview />
      </MainLayout>
    </AppLayout>
  </>
)};

export default OverviewPage;
