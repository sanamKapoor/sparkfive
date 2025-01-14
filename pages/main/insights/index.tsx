import React, { useContext, useEffect } from "react";
import Cookies from "universal-cookie";

// Components
import { useRouter } from "next/router";
import Dashboard from "../../../components/analytics/dashboard";
import InsightsLayout from "../../../components/common/layouts/insights-layout";
import { calculateBeginDate } from "../../../config/data/filter";
import { DASHBOARD_ASSET_TABLE_REC_LEN, DASHBOARD_REC_LIMIT, DashboardSections, pages } from "../../../constants/analytics";
import { SOMETHING_WENT_WRONG } from "../../../constants/messages";
import { TeamContext, UserContext } from "../../../context";
import useAnalytics from "../../../hooks/useAnalytics";
import { AnalyticsApiHelperServerRender } from "../../../server-api/analytics";

const Insights = ({ data }) => {

  const router = useRouter();
  const { pageVisit } = useAnalytics();
  const { user } = useContext(UserContext);
  const { team } = useContext(TeamContext);

  useEffect(() => {
    pageVisit(pages.INSIGHTS);
  }, []);

  useEffect(() => {
    if (!user || !team?.analytics || user?.roleId !== 'admin') {
      router.replace("/main/assets")
    }
  }, [user])

  return (
    <InsightsLayout title="Insights - Dashboard">
      <Dashboard data={data} />
    </InsightsLayout>
  );
};

export async function getServerSideProps({ req, res, query }) {
  const cookies = new Cookies(req.headers.cookie, { path: "/" });
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cookies.get("jwt")}`
  }

  let result: Array<any> = [];
  for (const endpoint in DashboardSections) {
    let payload: Record<string, unknown> = {};

    if(DashboardSections[endpoint] !== DashboardSections.USER_ACTIVITY){
      payload = {
        ...payload,
        filter: {
          beginDate: calculateBeginDate(7, 1),
          endDate: new Date(),
        },
      }
    }

    if (DashboardSections[endpoint] !== DashboardSections.TEAM) {
      payload = {
        ...payload,
        page: 1,
        limit: DashboardSections[endpoint] === DashboardSections.ASSET ? DASHBOARD_ASSET_TABLE_REC_LEN : DASHBOARD_REC_LIMIT,
        sortBy: "",
        sortOrder: true,
      }
    }    

    const res = await AnalyticsApiHelperServerRender(DashboardSections[endpoint], payload, headers);
    if (!res.ok) {
      result.push({
        error: SOMETHING_WENT_WRONG,
        section: DashboardSections[endpoint],
      });
    } else {
      const data = await res.json();
      result.push({
        ...data,
        section: DashboardSections[endpoint],
      });
    }
  }

  return {
    props: {
      data: result,
    },
  };
}

export default Insights;