import React from 'react'
import TableComponent from './insight-table/insight-table'
import Account from './account';
import InsightsSidenav from './insights-sidenav/insights-sidenav';

export default function Analytics() {
  
  return (
    <div>
        <InsightsSidenav />
     <Account/>
    </div>
  )
}
