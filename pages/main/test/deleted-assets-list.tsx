import { ASSET_ACCESS } from "../../../constants/permissions";
import FilterProvider from "../../../context/filter-provider";

// Components
import MainLayout from "../../../components/common/layouts/main-layout";

import { useContext, useEffect } from "react";
import DeletedAssetsLibrary from "../../../components/common/custom-settings/deleted-assets";
import AppLayout from "../../../components/common/layouts/app-layout";
import NoPermissionNotice from "../../../components/common/misc/no-permission-notice";
import { UserContext } from "../../../context";
import useAnalytics from "../../../hooks/useAnalytics";
import { pages } from "../../../constants/analytics";

const AssetsPage = () => {
  const { user } = useContext(UserContext);
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.ASSETS_DELETE)
},[]);

  return (
    <FilterProvider>
      <AppLayout title="User Settings">
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
          {user.roleId === "admin" || user.roleId === "super_admin" ? (
            <DeletedAssetsLibrary />
          ) : (
            <NoPermissionNotice />
          )}
        </MainLayout>
      </AppLayout>
    </FilterProvider>
  );
};

export default AssetsPage;
