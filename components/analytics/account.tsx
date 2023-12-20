import React from 'react'
import UserTable from './insight-table/insight-table'
import InsightsHeader from './insights-header/insights.header';
import styles from "./index.module.css";
import { insights } from '../../assets';
import UserModal from './Modals/user-modal/user-modal';
import AssetTable from './asset-table/asset-table';
export default function Account() {
   
  return (
    <>
      <div className={styles.tableHeader}>
      <InsightsHeader title="Users" companyName="Holli Inc." />
      </div>   
     <UserTable />
     <AssetTable/>
    
    </>
  )
}
