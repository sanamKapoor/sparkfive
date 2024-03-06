import React from 'react';
import Cookies from "universal-cookie";
import Users from '../../../../components/analytics/users';
import InsightsLayout from '../../../../components/common/layouts/insights-layout';
import { calculateBeginDate } from '../../../../config/data/filter';
import { InsightsApiEndpoint, LIMIT, PAGE } from '../../../../constants/analytics';
import { AnalyticsApiHelperServerRender } from '../../../../server-api/analytics';


const UserPage = ({ data }) => {
  return (
    <InsightsLayout title="Insights - Users">
      <Users initialData={data} />     
    </InsightsLayout>
  );
}

export async function getServerSideProps({ req, res, query }) {
  try {
    const { page, limit, search } = query;
    const cookies = new Cookies(req.headers.cookie, { path: "/" });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.get("jwt")}`,
    };
    const payload = {
      page: page || PAGE,
      limit: limit || LIMIT,
      search: search || "",
      sortBy: "",
      sortOrder: true,
      filter: {
        beginDate: calculateBeginDate(7, 1),
        endDate: new Date(),
      },
    };

    const response = await AnalyticsApiHelperServerRender(InsightsApiEndpoint.USER, payload, headers);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    } else {
      const data = await response.json();
      return {
        props: {
          data,
        },
      };
    }
  } catch (error) {
    return {
      props: {
        data: [],
      },
    };
  }
}

export default UserPage