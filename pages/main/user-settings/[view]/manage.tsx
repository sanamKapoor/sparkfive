import { ASSET_ACCESS } from "../../../../constants/permissions";
import FilterProvider from "../../../../context/filter-provider";

// Components
import MainLayout from "../../../../components/common/layouts/main-layout";

import { useContext, useEffect } from "react";
import DeletedAssetsLibrary from "../../../../components/common/custom-settings/deleted-assets";
import AppLayout from "../../../../components/common/layouts/app-layout";
import NoPermissionNotice from "../../../../components/common/misc/no-permission-notice";
import { UserContext } from "../../../../context";
import { UserRole } from "../../../../interfaces/user/role";
import { pages } from "../../../../constants/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";
import analyticsApi from "../../../../server-api/analytics";

const AssetsPage: React.FC = () => {
  const { user } = useContext(UserContext);

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.USER_SETTING, ...data })
  }, []);

  return (
    <FilterProvider>
      <AppLayout title="User Settings">
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
          {user.roleId === UserRole.ADMIN ||
            user.roleId === UserRole.SUPER_ADMIN ? (
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
