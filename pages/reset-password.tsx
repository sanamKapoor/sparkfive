// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ResetPassword from "../components/reset-password";

const ResetPasswordPage = () => (
  <>
    <AppLayout title="Reset Password">
      <AuthLayout>
        <ResetPassword />
      </AuthLayout>
    </AppLayout>
  </>
);

export default ResetPasswordPage;
