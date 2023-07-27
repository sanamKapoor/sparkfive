import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import ProjectDetail from "../../../../components/main/project/detail";

const ProjectDetailPage = () => (
  <>
    <AppLayout title="Project">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <ProjectDetail />
      </MainLayout>
    </AppLayout>
  </>
);

export default ProjectDetailPage;
