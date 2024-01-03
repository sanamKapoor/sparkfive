import { useContext, useEffect } from "react";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import UserSettings from "../../../../components/main/user-settings";
import AssetDownloadProcess from "../../../../components/asset-download-process";

import { AssetContext } from "../../../../context";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";

const UserSettingsPage: React.FC = () => {
  const { downloadingStatus } = useContext(AssetContext);

  const { pageVisit } = useAnalytics();

  useEffect(() => {
    pageVisit(pages.USER_SETTING)
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
