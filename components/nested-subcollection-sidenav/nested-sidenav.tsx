import React, { useState } from 'react';
import { useContext } from 'react';

import { Utilities } from '../../assets';
import { AssetContext, UserContext } from '../../context';
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
  const { user: { team } } = useContext(UserContext)
  return (
    <div className={styles.nestedsidenav}>
      <div className={styles["sidenav-content"]}>
        <ReusableHeading
          text={`${team?.company}.`}
          icon={<img onClick={() => { setSidebarOpen(!sidebarOpen) }} src={Utilities.arrowleft} />}
        />
        <NestedFirstlist />
        <ReusableHeading text="Collections" totalCount={sidenavTotalCount} icon={undefined} />

      </div>
      <NestedSidenavDropdown />
    </div>
  );
};
export default NestedSidenav;