// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Login from "../components/login";
import { pages } from "../constants/analytics";
import useAnalytics from "../hooks/useAnalytics";

const LoginPage = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.LOGIN)
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
