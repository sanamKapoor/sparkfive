import React from "react";

// Components
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Analytics from "../../../components/analytics";
import AppLayout from "../../../components/common/layouts/app-layout";
import MainLayout from "../../../components/common/layouts/main-layout";
import { pages } from "../../../constants/analytics";
import { CALENDAR_ACCESS } from "../../../constants/permissions";
import { UserContext } from "../../../context";
import AnalyticsProvider from "../../../context/analytics-provider";
import useAnalytics from "../../../hooks/useAnalytics";

const Insights = ({ data }) => {

  const router = useRouter();
  const { pageVisit } = useAnalytics();
  const { user } = useContext(UserContext);

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




// export async function getServerSideProps({ req, res, query }) {
//   const { section, page, limit } = query;

//   const cookies = new Cookies(req.headers.cookie, { path: '/' });
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${cookies.get("jwt")}`
//   }

//   let result: Array<any> = [];
//   if (section === 'dashboard') {
//     for (const endpoint of DashboardSections) {
//       const res = await fetch(`${process.env.SERVER_BASE_URL}/analytics/${endpoint}`, {
//         method: 'post',
//         headers,
//         body: JSON.stringify({
//           page: +page || 1,
//           limit: +limit || 6,
//           filter: {
//             endDate: new Date(),
//             beginDate: calculateBeginDate(7, 1)
//           }
//         })
//       })
//       const data = await res.json();

//       result.push({
//         ...data,
//         endpoint
//       })
//     }
//   }

//   return {
//     props: {
//       data: result,
//     },
//   };
// }

export default Insights;
