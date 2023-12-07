// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import RequestAccess from "../components/request-access";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";

const RequestAccessPage = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.REQUEST_ACCESS)
},[]);

  return (
  <>
    <AppLayout title="Request Access">
      <AuthLayout>
        <RequestAccess />
      </AuthLayout>
    </AppLayout>
  </>
)};

export default RequestAccessPage;
