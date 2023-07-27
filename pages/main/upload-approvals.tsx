import Head from "next/head";
import { useContext } from "react";
import { ASSET_ACCESS } from "../../constants/permissions";
import FilterProvider from "../../context/filter-provider";

// Components
import AssetUploadProcess from "../../components/asset-upload-process";
import MainLayout from "../../components/common/layouts/main-layout";
import UploadRequest from "../../components/main/upload-requests";

import { AssetContext } from "../../context";

const UploadRequestsPage = () => {
  const { uploadingStatus, uploadingAssets, downloadingStatus } =
    useContext(AssetContext);
  return (
    <FilterProvider>
      <Head>
        <title>Upload Approval</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout requiredPermissions={[ASSET_ACCESS]}>
        {uploadingStatus !== "none" && uploadingAssets.length > 0 && (
          <AssetUploadProcess />
        )}
        <UploadRequest />
      </MainLayout>
    </FilterProvider>
  );
};

export default UploadRequestsPage;
