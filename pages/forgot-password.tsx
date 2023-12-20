// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ForgotPassword from "../components/forgot-password";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";

const ForgotPasswordPage = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.FORGOT_PASSWORD)
},[]);

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
