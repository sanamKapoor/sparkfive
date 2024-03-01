import { useContext, useEffect } from "react";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import UserSettings from "../../../../components/main/user-settings";
import AssetDownloadProcess from "../../../../components/asset-download-process";
import FaceRecognitionProcess from "../../../../components/face-recognition-process/face-recognition-process";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";
import { AssetContext, LoadingContext } from "../../../../context";
import SpinnerOverlay from "../../../../components/common/spinners/spinner-overlay";

const UserSettingsPage: React.FC = () => {
  const { downloadingStatus } = useContext(AssetContext);
  const { isLoading } = useContext(LoadingContext);

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
          {isLoading && <SpinnerOverlay />}
          <FaceRecognitionProcess />
        </MainLayout>
      </AppLayout>
    </>
  );
};

export default UserSettingsPage;
