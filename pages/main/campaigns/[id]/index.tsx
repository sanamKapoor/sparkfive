import { CALENDAR_ACCESS } from "../../../../constants/permissions";

// Components
import AppLayout from "../../../../components/common/layouts/app-layout";
import MainLayout from "../../../../components/common/layouts/main-layout";
import CampaignDetail from "../../../../components/main/campaign/detail";
import { useEffect } from "react";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";

const CampaignDetailPage = () => {

const { pageVisit } = useAnalytics();

useEffect(() => {    
  pageVisit(pages.CAMPAIGNS)
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
