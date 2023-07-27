import Head from "next/head";
import { useContext } from "react";
import { ASSET_ACCESS } from "../../constants/permissions";
import FilterProvider from "../../context/filter-provider";

// Components
import AssetDownloadProcess from "../../components/asset-download-process";
import AssetUploadProcess from "../../components/asset-upload-process";
import MainLayout from "../../components/common/layouts/main-layout";
import AssetsLibrary from "../../components/main/assets-library";

import { AssetContext } from "../../context";

const AssetsPage = () => {
  const { uploadingStatus, uploadingAssets, downloadingStatus } =
    useContext(AssetContext);
  return (
    <FilterProvider>
      <Head>
        <title>Assets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout requiredPermissions={[ASSET_ACCESS]}>
        {uploadingStatus !== "none" && uploadingAssets.length > 0 && (
          <AssetUploadProcess />
        )}
        {downloadingStatus !== "none" && <AssetDownloadProcess />}
        <AssetsLibrary />
      </MainLayout>
    </FilterProvider>
  );
};

export default AssetsPage;
