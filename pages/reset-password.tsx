// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ResetPassword from "../components/reset-password";
import { pages } from "../constants/analytics";
import useAnalytics from "../hooks/useAnalytics";

const ResetPasswordPage = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.RESET_PASSWORD)
  }, []);

  return (
    <>
      <AppLayout title="Reset Password">
        <AuthLayout>
          <ResetPassword />
        </AuthLayout>
      </AppLayout>
    </>
  )
};

export default ResetPasswordPage;
