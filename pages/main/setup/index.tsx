// Components
import { useEffect } from "react";
import AppLayout from "../../../components/common/layouts/app-layout";
import AuthLayout from "../../../components/common/layouts/auth-layout";
import SetupMain from "../../../components/main/setup";
import { pages } from "../../../constants/analytics";
import usePageInfo from "../../../hooks/usePageInfo";
import analyticsApi from "../../../server-api/analytics";

const AssetsPage = () => {

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.SETUP, ...data })
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
