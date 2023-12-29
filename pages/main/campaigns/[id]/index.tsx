import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import CampaignDetail from "../../../../components/main/campaign/detail";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import usePageInfo from "../../../../hooks/usePageInfo";
import analyticsApi from "../../../../server-api/analytics";

const CampaignDetailPage = () => {

const data = usePageInfo();

useEffect(() => {    
  analyticsApi.capturePageVisit({ name: pages.CAMPAIGNS, ...data })
},[]);

  return (
  <>
    <AppLayout title="Campaign">
      <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
        <CampaignDetail />
      </MainLayout>
    </AppLayout>
  </>
)};

export default CampaignDetailPage;
