import { CALENDAR_ACCESS } from "../../constants/permissions";

// Components
import AppLayout from "../../components/common/layouts/app-layout";
import MainLayout from "../../components/common/layouts/main-layout";
import { useContext, useEffect } from "react";
import { DashboardApiEndpoints, pages } from "../../constants/analytics";
import Analytics from "../../components/analytics";
import React from "react";
import useAnalytics from "../../hooks/useAnalytics";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import AnalyticsProvider from "../../context/analytics-provider";
import AnalyticsApi from "../../server-api/analytics";

const OverviewPage = ({ data }) => {

  const router = useRouter();
  const { pageVisit } = useAnalytics();
  const { user } = useContext(UserContext);

  console.log({ data });

  useEffect(() => {
    pageVisit(pages.INSIGHTS);
  }, []);

  useEffect(() => {
    if (!user || !user?.team?.analytics || user?.roleId !== 'admin') {
      router.replace("/main/assets")
    }
  }, [user])

  return (
    <>
      <AppLayout title="Overview">
        <MainLayout requiredPermissions={[CALENDAR_ACCESS]}>
          <AnalyticsProvider>
            <Analytics />
          </AnalyticsProvider>
        </MainLayout>
      </AppLayout>
    </>
  )
};

export async function getServerSideProps(context) {
  const { section, page, limit } = context.query;
  
  let result = [];
  if(section === 'dashboard'){
    for(const endpoint of DashboardApiEndpoints){
      const { data } = await AnalyticsApi.getAnalyticsData(endpoint, {
        page,
        limit
      })
      result.push(data?.data)
    }
  }

  return {
    props: {
      data: result,
    },
  };
}

export default OverviewPage;
