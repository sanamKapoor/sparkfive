import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import TaskDetail from "../../../../components/main/task/detail";
import useAnalytics from "../../../../hooks/useAnalytics";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";

const TaskDetailPage = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.UPLOAD_APPROVAL)
},[]);

  return (
  <>
    <AppLayout title="Task">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <TaskDetail />
      </MainLayout>
    </AppLayout>
  </>
)};

export default TaskDetailPage;
