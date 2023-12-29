import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import TaskDetail from "../../../../components/main/task/detail";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";
import analyticsApi from "../../../../server-api/analytics";

const TaskDetailPage = () => {
  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.TASKS, ...data })
  }, []);

  return (
    <>
      <AppLayout title="Task">
        <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
          <TaskDetail />
        </MainLayout>
      </AppLayout>
    </>
  )
};

export default TaskDetailPage;
