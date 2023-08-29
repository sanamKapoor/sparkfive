import React from 'react'
import SwitchableTabs from '../../../common/switchable-tabs';
import { superAdminTabsData } from '../../../../config/data/super-admin';

const SuperAdmin = () => {
  return (
    <div>
      <SwitchableTabs initialActiveTab='allUsers' data={superAdminTabsData} />
    </div>
  )
}

export default SuperAdmin;