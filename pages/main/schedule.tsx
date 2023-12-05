import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import Schedule from "../../components/main/schedule";
import useAnalytics from "../../hooks/useAnalytics";
import { useEffect } from "react";
import { pages } from "../../constants/analytics";

const SchedulePage = () => {

  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.UPLOAD_APPROVAL)
},[]);

  return (
  <>
    <AppLayout title="Schedule">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <Schedule />
      </MainLayout>
    </AppLayout>
  </>
)};

export default SchedulePage;
