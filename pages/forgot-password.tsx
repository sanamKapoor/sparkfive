// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ForgotPassword from "../components/forgot-password";

const ForgotPasswordPage = () => {
  return (
    <>
      <AppLayout title="Forgot Password">
        <AuthLayout>
          <ForgotPassword />
        </AuthLayout>
      </AppLayout>
    </>
  );
}

export default ForgotPasswordPage;
