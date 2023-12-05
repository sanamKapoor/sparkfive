import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import ProjectDetail from "../../../../components/main/project/detail";
import useAnalytics from "../../../../hooks/useAnalytics";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";

const ProjectDetailPage = () => {

  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.UPLOAD_APPROVAL)
},[]);

  return (
  <>
    <AppLayout title="Project">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <ProjectDetail />
      </MainLayout>
    </AppLayout>
  </>
)};

export default ProjectDetailPage;
