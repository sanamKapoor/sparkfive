import React from 'react'
import InsightsSideNav from '../../analytics/common/sidenav'
import AppLayout from './app-layout'
import MainLayout from './main-layout';

const InsightsLayout = ({ title, children }) => {
  return (
    <>
      <AppLayout title={title}>
        <MainLayout>
          <InsightsSideNav />
          {children}
        </MainLayout>
      </AppLayout>
    </>
  );
}

export default InsightsLayout