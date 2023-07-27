import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import Overview from "../../components/main/overview";

const OverviewPage = () => (
  <>
    <AppLayout title="Overview">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <Overview />
      </MainLayout>
    </AppLayout>
  </>
);

export default OverviewPage;
