// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import TwoFactor from "../components/two-factor";


import { useEffect } from "react";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";

const TwoFactorPage = () => {
  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.TWO_FECTOR)
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
