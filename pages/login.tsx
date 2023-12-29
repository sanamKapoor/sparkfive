// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Login from "../components/login";
import { pages } from "../constants/analytics";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";

const LoginPage = () => {
  const data = usePageInfo();

  useEffect(() => {    
    analyticsApi.capturePageVisit({ name: pages.LOGIN, ...data })
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
