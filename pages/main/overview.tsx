import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import Overview from "../../components/main/overview";
import useAnalytics from "../../hooks/useAnalytics";
import { useEffect } from "react";
import { pages } from "../../constants/analytics";

const OverviewPage = () => {

  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.OVERVIEW)
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
