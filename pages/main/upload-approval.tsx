import { useContext, useEffect } from "react";
import { ASSET_ACCESS } from "../../constants/permissions";
import FilterProvider from "../../context/filter-provider";

// Components
import AssetUploadProcess from "../../components/asset-upload-process";
import MainLayout from "../../components/common/layouts/main-layout";
import UploadApproval from "../../components/main/upload-approval";

import AppLayout from "../../components/common/layouts/app-layout";
import { AssetContext } from "../../context";
import { pages } from "../../constants/analytics";
import usePageInfo from "../../hooks/usePageInfo";
import analyticsApi from "../../server-api/analytics";

const UploadApprovalPage = () => {
  const { uploadingStatus, uploadingAssets } = useContext(AssetContext);

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.UPLOAD_APPROVAL, ...data })
  }, []);

  return (
    <FilterProvider>
      <AppLayout title="Upload Approval">
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
          {uploadingStatus !== "none" && uploadingAssets.length > 0 && (
            <AssetUploadProcess />
          )}
          <UploadApproval />
        </MainLayout>
      </AppLayout>
    </FilterProvider>
  );
};

export default UploadApprovalPage;
