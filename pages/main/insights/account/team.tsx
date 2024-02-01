import React from 'react';
import Cookies from "universal-cookie";
import InsightsLayout from '../../../../components/common/layouts/insights-layout';
import { InsightsApiEndpoint } from '../../../../constants/analytics';
import { calculateBeginDate } from '../../../../config/data/filter';
import { AnalyticsApiHelperServerRender } from '../../../../server-api/analytics';
import Team from '../../../../components/analytics/team';

const TeamPage = ({ data }) => {
  return (
    <InsightsLayout title="Insights - Team">
      <Team initialData={data} />
    </InsightsLayout>
  );
}

export async function getServerSideProps({ req, res, query }) {
  try {
    const cookies = new Cookies(req.headers.cookie, { path: "/" });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.get("jwt")}`,
    };
    const payload = {
      filter: {
        beginDate: calculateBeginDate(7, 1),
        endDate: new Date(),
      },
    };

    const response = await AnalyticsApiHelperServerRender(InsightsApiEndpoint.TEAM, payload, headers);
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

export default TeamPage