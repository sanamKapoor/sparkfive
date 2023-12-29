import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import Schedule from "../../components/main/schedule";
import { useEffect } from "react";
import { pages } from "../../constants/analytics";
import usePageInfo from "../../hooks/usePageInfo";
import analyticsApi from "../../server-api/analytics";

const SchedulePage = () => {
  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.SCHEDULE, ...data })
  }, []);

  return (
    <>
      <AppLayout title="Schedule">
        <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
          <Schedule />
        </MainLayout>
      </AppLayout>
    </>
  )
};

export default SchedulePage;
