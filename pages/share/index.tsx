import { useContext, useEffect } from "react";

// Components
import ShareLayout from "../../components/common/layouts/share-layout";
import ShareMain from "../../components/share";

import AssetDownloadProcess from "../../components/asset-download-process";
import AppLayout from "../../components/common/layouts/app-layout";
import { AssetContext } from "../../context";
import useAnalytics from "../../hooks/useAnalytics";
import { pages } from "../../constants/analytics";

const SharePage = () => {
  const { downloadingStatus } = useContext(AssetContext);
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.SHARED_LINKS)
  },[]);

  return (
    <>
      <AppLayout title="Assets">
        <ShareLayout>
          {downloadingStatus !== "none" && <AssetDownloadProcess />}
          <ShareMain />
        </ShareLayout>
      </AppLayout>
    </>
  );
};

export default SharePage;
