import React, { useContext, useEffect } from "react";
import { ASSET_ACCESS } from "../../constants/permissions";
import FilterProvider from "../../context/filter-provider";

// Components
import MainLayout from "../../components/common/layouts/main-layout";
import AppLayout from "../../components/common/layouts/app-layout";
import TableComponent from "../components/analytics/insight-table/insight-table";

const InsightsPage = () => {

  return (
    <FilterProvider>
      <AppLayout title="Assets">
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
         
        <TableComponent />
        </MainLayout>
      </AppLayout>
    </FilterProvider>
  );
};

export default InsightsPage;
