import { useContext, useEffect } from "react";

// Components
import ShareLayout from "../../components/common/layouts/share-layout";
import ShareMain from "../../components/share";

import AssetDownloadProcess from "../../components/asset-download-process";
import AppLayout from "../../components/common/layouts/app-layout";
import { AssetContext } from "../../context";
import { pages } from "../../constants/analytics";
import usePageInfo from "../../hooks/usePageInfo";
import analyticsApi from "../../server-api/analytics";

const SharePage = () => {
  const { downloadingStatus } = useContext(AssetContext);

  const data = usePageInfo();

  useEffect(() => {    
    analyticsApi.capturePageVisit({ name: pages.SHARED_LINKS, ...data })
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
