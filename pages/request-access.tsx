// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import RequestAccess from "../components/request-access";
import { pages } from "../constants/analytics";
import useAnalytics from "../hooks/useAnalytics";

const RequestAccessPage = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.REQUEST_ACCESS)
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
