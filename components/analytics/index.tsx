import React from 'react'
import Content from './content';
import InsightsSidenav from './insights-sidenav';
import AnalyticsHOC from './hoc';

 function Analytics() {
  return (
    <div>
      <InsightsSidenav />
      <Content />
    </div>
  )
}

export default AnalyticsHOC(Analytics)