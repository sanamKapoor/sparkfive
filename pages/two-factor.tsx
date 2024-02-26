// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import TwoFactor from "../components/two-factor";

const TwoFactorPage = () => (
  <>
    <AppLayout title="Enter Confirmation Code">
      <AuthLayout>
        <TwoFactor />
      </AuthLayout>
    </AppLayout>
  </>
);

export default TwoFactorPage;
