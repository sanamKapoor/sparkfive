import React from 'react';
import { useContext } from 'react';

import { Utilities } from '../../assets';
import { AssetContext } from '../../context';
import ReusableHeading from './nested-heading';
import NestedSidenavDropdown from './nested-sidenav-dropdown-list';
import NestedFirstlist from './nested-sidenav-firstlist';
import styles from './nested-sidenav.module.css';

const NestedSidenav = () => {
  const {
    folders,
    setFolders,
    totalAssets,
    
  } = useContext(AssetContext);
  return (
    <div className={styles.nestedsidenav}>
      <div className={styles["sidenav-content"]}>
        <ReusableHeading
          text="Hooli Inc."
          icon={<img src={Utilities.arrowleft} />}
        />
        <NestedFirstlist />
        <ReusableHeading text="Collections" totalCount={totalAssets} icon={undefined} />
       
      </div>
      <NestedSidenavDropdown folders={folders}/>
    </div>
  );
};

export default NestedSidenav;
