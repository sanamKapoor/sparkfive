import { useContext } from "react";
import FilterProvider from "../../../../context/filter-provider";

// Components
import AssetDownloadProcess from "../../../../components/asset-download-process";
import ShareFolderLayout from "../../../../components/common/layouts/share-folder-layout";
import ShareCollectionMain from "../../../../components/share-collections";

import AppLayout from "../../../../components/common/layouts/app-layout";
import { AssetContext } from "../../../../context";

const ShareFolder = () => {
  const { downloadingStatus } = useContext(AssetContext);

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
