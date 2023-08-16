import styles from './nested-sidenav.module.css'
import { Utilities } from '../../assets';
import React from 'react';
import NestedFirstlist from './nested-sidenav-firstlist';
import NestedSidenavDropdown from './nested-sidenav-dropdown-list';
const NestedSidenav = () => {
    return (
<div className={styles.nestedsidenav}>
    <div className={styles['sidenav-content']}>
        <div className={styles['heading-contents']}>
        <div className={styles['sidenav-heading']}>
        Hooli Inc.
        </div>
        <div className='left-icon'>
        <img src={Utilities.arrowleft} />
        </div>
        </div>
        <NestedFirstlist />
        <div className={`${styles['sidenav-heading']} ${styles['mt-22']}`}>
       All Collection (9)
        </div>
        <NestedSidenavDropdown/>
    </div>
  </div>
    )
};

export default NestedSidenav;