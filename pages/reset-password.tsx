// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ResetPassword from "../components/reset-password";
import { pages } from "../constants/analytics";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";

const ResetPasswordPage = () => {
  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.RESET_PASSWORD, ...data })
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
