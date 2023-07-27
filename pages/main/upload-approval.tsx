import Head from "next/head";
import { useContext } from "react";
import { ASSET_ACCESS } from "../../constants/permissions";
import FilterProvider from "../../context/filter-provider";

// Components
import AssetUploadProcess from "../../components/asset-upload-process";
import MainLayout from "../../components/common/layouts/main-layout";
import UploadApproval from "../../components/main/upload-approval";

import { AssetContext } from "../../context";

const UploadApprovalPage = () => {
  const { uploadingStatus, uploadingAssets } = useContext(AssetContext);
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
        <UploadApproval />
      </MainLayout>
    </FilterProvider>
  );
};

export default UploadApprovalPage;
