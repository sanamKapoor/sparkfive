import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import Schedule from "../../components/main/schedule";
import { useEffect } from "react";
import { pages } from "../../constants/analytics";
import useAnalytics from "../../hooks/useAnalytics";

const SchedulePage = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.SCHEDULE)
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
