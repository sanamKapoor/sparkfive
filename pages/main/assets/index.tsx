import React, { useContext, useEffect } from "react";
import { ASSET_ACCESS } from "../../../constants/permissions";
import FilterProvider from "../../../context/filter-provider";

// Components
import AssetDownloadProcess from "../../../components/asset-download-process";
import AssetUploadProcess from "../../../components/asset-upload-process";
import MainLayout from "../../../components/common/layouts/main-layout";
import AssetsLibrary from "../../../components/main/assets-library";

import AppLayout from "../../../components/common/layouts/app-layout";
import { AssetContext } from "../../../context";
import useAnalytics from "../../../hooks/useAnalytics";
import { pages } from "../../../constants/analytics";

const AssetsPage = () => {

  const { uploadingStatus, uploadingAssets, downloadingStatus } =
    useContext(AssetContext);

  const { pageVisit } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.ASSETS)
  },[]);

  return (
    <FilterProvider>
      <AppLayout title="Assets">
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
          {uploadingStatus !== "none" && uploadingAssets.length > 0 && (
            <AssetUploadProcess />
          )}
          {downloadingStatus !== "none" && <AssetDownloadProcess />}
          <AssetsLibrary />
        </MainLayout>
      </AppLayout>
    </FilterProvider>
  );
};

export default AssetsPage;
