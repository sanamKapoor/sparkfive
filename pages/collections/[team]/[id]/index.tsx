import { useContext, useEffect } from "react";
import FilterProvider from "../../../../context/filter-provider";

// Components
import AssetDownloadProcess from "../../../../components/asset-download-process";
import ShareFolderLayout from "../../../../components/common/layouts/share-folder-layout";
import ShareCollectionMain from "../../../../components/share-collections";

import AppLayout from "../../../../components/common/layouts/app-layout";
import { AssetContext } from "../../../../context";
import { pages } from "../../../../constants/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";
import analyticsApi from "../../../../server-api/analytics";

const ShareFolder = () => {
  const { downloadingStatus } = useContext(AssetContext);

const data = usePageInfo();

useEffect(() => {    
  analyticsApi.capturePageVisit({ name: pages.COLLECTIONS, ...data })
},[]);

  return (
    <FilterProvider isPublic={true}>
      <AppLayout title="Shared Collections">
        <ShareFolderLayout advancedLink={true}>
          {downloadingStatus !== "none" && <AssetDownloadProcess />}
          <ShareCollectionMain />
        </ShareFolderLayout>
      </AppLayout>
    </FilterProvider>
  );
};

export default ShareFolder;
