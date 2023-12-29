// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import TwoFactor from "../components/two-factor";


import { useEffect } from "react";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";

const TwoFactorPage = () => {
  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.TWO_FECTOR, ...data })
  }, []);

  return (
    <>
      <AppLayout title="Enter Confirmation Code">
        <AuthLayout>
          <TwoFactor />
        </AuthLayout>
      </AppLayout>
    </>
  )
};

export default TwoFactorPage;
