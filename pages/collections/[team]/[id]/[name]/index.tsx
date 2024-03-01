import { useContext, useEffect } from "react";
import FilterProvider from "../../../../../context/filter-provider";

// Components
import AssetDownloadProcess from "../../../../../components/asset-download-process";
import ShareFolderLayout from "../../../../../components/common/layouts/share-folder-layout";
import ShareFolderMain from "../../../../../components/share-folder";

import AppLayout from "../../../../../components/common/layouts/app-layout";
import { AssetContext } from "../../../../../context";
import { pages, shareLinkEvents } from "../../../../../constants/analytics";
import useAnalytics from "../../../../../hooks/useAnalytics";
import cookiesApi from "../../../../../utils/cookies";


const ShareFolder = () => {
  const { downloadingStatus } = useContext(AssetContext);

  const { pageVisit, trackLinkEvent } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.COLLECTIONS)
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
