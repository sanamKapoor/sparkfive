import { useContext } from "react";

// Components
import ShareLayout from "../../components/common/layouts/share-layout";
import ShareMain from "../../components/share";

import AssetDownloadProcess from "../../components/asset-download-process";
import AppLayout from "../../components/common/layouts/app-layout";
import { AssetContext } from "../../context";

const SharePage = () => {
  const { downloadingStatus } = useContext(AssetContext);

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
