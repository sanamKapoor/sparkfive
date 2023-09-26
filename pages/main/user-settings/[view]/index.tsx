// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import UserSettings from "../../../../components/main/user-settings";

const UserSettingsPage: React.FC = () => {
  return (
    <>
      <AppLayout title="User Settings">
        <MainLayout>
          <UserSettings />
        </MainLayout>
      </AppLayout>
    </>
  );
};

export default UserSettingsPage;
