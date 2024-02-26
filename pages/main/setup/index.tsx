// Components
import AppLayout from "../../../components/common/layouts/app-layout";
import AuthLayout from "../../../components/common/layouts/auth-layout";
import SetupMain from "../../../components/main/setup";

const AssetsPage = () => (
  <>
    <AppLayout title="Account Setup">
      <AuthLayout>
        <SetupMain />
      </AuthLayout>
    </AppLayout>
  </>
);

export default AssetsPage;
