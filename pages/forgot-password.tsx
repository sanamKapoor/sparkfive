// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import ForgotPassword from "../components/forgot-password";
import { pages } from "../constants/analytics";
import useAnalytics from "../hooks/useAnalytics";

const ForgotPasswordPage = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.FORGOT_PASSWORD)
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
