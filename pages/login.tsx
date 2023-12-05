// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Login from "../components/login";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";

const LoginPage = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.UPLOAD_APPROVAL)
},[]);

  return (
    <AppLayout title="Log In">
      <AuthLayout>
        <Login />
      </AuthLayout>
    </AppLayout>
  );
};

export default LoginPage;
