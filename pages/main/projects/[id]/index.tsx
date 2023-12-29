import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import ProjectDetail from "../../../../components/main/project/detail";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";
import analyticsApi from "../../../../server-api/analytics";

const ProjectDetailPage = () => {

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.PROJECTS, ...data })
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
