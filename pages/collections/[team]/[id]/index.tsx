import Head from "next/head";
import { useContext } from "react";
import FilterProvider from "../../../../context/filter-provider";

// Components
import AssetDownloadProcess from "../../../../components/asset-download-process";
import ShareFolderLayout from "../../../../components/common/layouts/share-folder-layout";
import ShareCollectionMain from "../../../../components/share-collections";

import { AssetContext } from "../../../../context";

const ShareFolder = () => {
  const { downloadingStatus } = useContext(AssetContext);

  return (
    <FilterProvider isPublic={true}>
      <Head>
        <title>Shared Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ShareFolderLayout advancedLink={true}>
        {downloadingStatus !== "none" && <AssetDownloadProcess />}
        <ShareCollectionMain />
      </ShareFolderLayout>
    </FilterProvider>
  );
};

export default ShareFolder;
