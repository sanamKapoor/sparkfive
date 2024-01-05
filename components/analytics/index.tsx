import React, { useState } from 'react'
import TableComponent from './insight-table/insight-table'
import Content from './content';
import InsightsSidenav from './insights-sidenav/insights-sidenav';
import { analyticsLayoutSection } from '../../constants/analytics';

export default function Analytics() {
  const [activeSection, setActiveSection] = useState(analyticsLayoutSection.DASHBOARD);

  return (
    <div>
        <InsightsSidenav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <Content activeSection={activeSection} />
    </div>
  )
}
