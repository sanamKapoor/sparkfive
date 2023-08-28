import React, { useState } from 'react';
import { useContext } from 'react';

import { Utilities } from '../../assets';
import { AssetContext } from '../../context';
import ReusableHeading from './nested-heading';
import NestedSidenavDropdown from './nested-sidenav-dropdown-list';
import NestedFirstlist from './nested-sidenav-firstlist';
import styles from './nested-sidenav.module.css';

const NestedSidenav = () => {
  const {
    sidenavTotalCount,
    sidebarOpen,
    setSidebarOpen
  } = useContext(AssetContext);
  return (
    <div className={styles.nestedsidenav}>
      <div className={styles["sidenav-content"]}>
        <ReusableHeading
          text="Hooli Inc."
          icon={<img onClick={()=>{setSidebarOpen(!sidebarOpen)}} src={sidebarOpen?Utilities.arrowleft:Utilities.arrowright} />}
        />
        <NestedFirstlist />
        <ReusableHeading text="Collections" totalCount={sidenavTotalCount} icon={undefined} />

      </div>
      <NestedSidenavDropdown />
    </div>
  );
};
export default NestedSidenav;