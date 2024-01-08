import React, { useContext, useState } from 'react'
import TableComponent from './insight-table/insight-table'
import Content from './content';
import InsightsSidenav from './insights-sidenav/insights-sidenav';
import { analyticsLayoutSection } from '../../constants/analytics';
import { AnalyticsContext } from '../../context';

export default function Analytics() {

  return (
    <div>
      <InsightsSidenav />
      <Content />
    </div>
  )
}
