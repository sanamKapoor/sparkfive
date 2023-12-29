import { useContext, useEffect } from "react";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import UserSettings from "../../../../components/main/user-settings";
import AssetDownloadProcess from "../../../../components/asset-download-process";

import { AssetContext } from "../../../../context";
import { pages } from "../../../../constants/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";
import analyticsApi from "../../../../server-api/analytics";

const UserSettingsPage: React.FC = () => {
  const { downloadingStatus } = useContext(AssetContext);

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.USER_SETTING, ...data })
  }, []);

  return (
    <>
      <AppLayout title="User Settings">
        <MainLayout>
          <UserSettings />

          {downloadingStatus !== "none" && <AssetDownloadProcess />}
        </MainLayout>
      </AppLayout>
    </>
  );
};

export default UserSettingsPage;
