// Components
import { useEffect } from "react";
import AppLayout from "../../../components/common/layouts/app-layout";
import AuthLayout from "../../../components/common/layouts/auth-layout";
import SetupMain from "../../../components/main/setup";
import { pages } from "../../../constants/analytics";
import useAnalytics from "../../../hooks/useAnalytics";

const AssetsPage = () => {

  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.SETUP);
  }, []);

  return (
    <>
      <AppLayout title="Account Setup">
        <AuthLayout>
          <SetupMain />
        </AuthLayout>
      </AppLayout>
    </>
  )
};

export default AssetsPage;
