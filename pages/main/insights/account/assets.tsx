import React from 'react'
import Cookies from "universal-cookie";
import Asset from '../../../../components/analytics/asset';
import InsightsLayout from '../../../../components/common/layouts/insights-layout';
import { InsightsApiEndpoint, LIMIT, PAGE } from "../../../../constants/analytics";
import { calculateBeginDate } from "../../../../config/data/filter";
import { AnalyticsApiHelperServerRender } from "../../../../server-api/analytics";

const Assets = ({ data }) => {
  return (
    <InsightsLayout title="Insights - Assets">
      <Asset initialData={data} />
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

    const response = await AnalyticsApiHelperServerRender(InsightsApiEndpoint.ASSET, payload, headers);
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

export default Assets