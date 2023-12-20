import { useContext, useEffect } from "react";
import FilterProvider from "../../../../../context/filter-provider";

// Components
import AssetDownloadProcess from "../../../../../components/asset-download-process";
import ShareFolderLayout from "../../../../../components/common/layouts/share-folder-layout";
import ShareFolderMain from "../../../../../components/share-folder";

import AppLayout from "../../../../../components/common/layouts/app-layout";
import { AssetContext } from "../../../../../context";
import useAnalytics from "../../../../../hooks/useAnalytics";
import { pages } from "../../../../../constants/analytics";


const ShareFolder = () => {
  const { downloadingStatus } = useContext(AssetContext);

  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.COLLECTIONS)
},[]);

  return (
    <FilterProvider isPublic={true}>
      <AppLayout title="Shared Collection">
        <ShareFolderLayout>
          {downloadingStatus !== "none" && <AssetDownloadProcess />}
          <ShareFolderMain />
        </ShareFolderLayout>
      </AppLayout>
    </FilterProvider>
  );
};

export default ShareFolder;
