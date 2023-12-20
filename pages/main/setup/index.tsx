// Components
import { useEffect } from "react";
import AppLayout from "../../../components/common/layouts/app-layout";
import AuthLayout from "../../../components/common/layouts/auth-layout";
import SetupMain from "../../../components/main/setup";
import useAnalytics from "../../../hooks/useAnalytics";
import { pages } from "../../../constants/analytics";

const AssetsPage = () => {

  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.SETUP)
},[]);

  return (
  <>
    <AppLayout title="Account Setup">
      <AuthLayout>
        <SetupMain />
      </AuthLayout>
    </AppLayout>
  </>
)};

export default AssetsPage;
