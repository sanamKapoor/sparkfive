import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import Schedule from "../../components/main/schedule";

const SchedulePage = () => (
  <>
    <AppLayout title="Schedule">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <Schedule />
      </MainLayout>
    </AppLayout>
  </>
);

export default SchedulePage;
