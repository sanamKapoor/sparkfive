import { useContext } from "react";
import { ASSET_ACCESS } from "../../constants/permissions";
import FilterProvider from "../../context/filter-provider";

// Components
import AssetUploadProcess from "../../components/asset-upload-process";
import MainLayout from "../../components/common/layouts/main-layout";
import UploadRequest from "../../components/main/upload-requests";

import AppLayout from "../../components/common/layouts/app-layout";
import { AssetContext } from "../../context";

const UploadRequestsPage = () => {
  const { uploadingStatus, uploadingAssets, downloadingStatus } =
    useContext(AssetContext);
  return (
    <FilterProvider>
      <AppLayout title="Upload Approval">
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
          {uploadingStatus !== "none" && uploadingAssets.length > 0 && (
            <AssetUploadProcess />
          )}
          <UploadRequest />
        </MainLayout>
      </AppLayout>
    </FilterProvider>
  );
};

export default UploadRequestsPage;
