import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import ProjectDetail from "../../../../components/main/project/detail";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";

const ProjectDetailPage = () => {

  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.PROJECTS)
  }, []);

  return (
    <>
      <AppLayout title="Project">
        <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
          <ProjectDetail />
        </MainLayout>
      </AppLayout>
    </>
  )
};

export default ProjectDetailPage;
