// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import RequestAccess from "../components/request-access";
import { pages } from "../constants/analytics";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";

const RequestAccessPage = () => {
  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.REQUEST_ACCESS, ...data })
  }, []);

  return (
    <>
      <AppLayout title="Request Access">
        <AuthLayout>
          <RequestAccess />
        </AuthLayout>
      </AppLayout>
    </>
  )
};

export default RequestAccessPage;
