// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ForgotPassword from "../components/forgot-password";
import { pages } from "../constants/analytics";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";

const ForgotPasswordPage = () => {
  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.FORGOT_PASSWORD, ...data })
  }, []);

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
