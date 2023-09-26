import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import TaskDetail from "../../../../components/main/task/detail";

const TaskDetailPage = () => (
  <>
    <AppLayout title="Task">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <TaskDetail />
      </MainLayout>
    </AppLayout>
  </>
);

export default TaskDetailPage;
