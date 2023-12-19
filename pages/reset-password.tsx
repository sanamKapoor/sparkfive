// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ResetPassword from "../components/reset-password";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";

const ResetPasswordPage = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.RESET_PASSWORD)
},[]);

  return (
  <>
    <AppLayout title="Reset Password">
      <AuthLayout>
        <ResetPassword />
      </AuthLayout>
    </AppLayout>
  </>
)};

export default ResetPasswordPage;
