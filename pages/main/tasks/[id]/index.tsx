import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import TaskDetail from "../../../../components/main/task/detail";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";

const TaskDetailPage = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.TASKS)
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
