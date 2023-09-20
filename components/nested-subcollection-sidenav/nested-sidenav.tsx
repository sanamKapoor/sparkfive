import React from 'react';
import { useContext } from 'react';

import { Utilities } from '../../assets';
import { AssetContext, FilterContext, UserContext } from '../../context';
import ReusableHeading from './nested-heading';
import NestedSidenavDropdown from './nested-sidenav-dropdown-list';
import NestedFirstlist from './nested-sidenav-firstlist';
import styles from './nested-sidenav.module.css';
import selectOptions from '../../utils/select-options';

const NestedSidenav = () => {
  const {
    sidenavTotalCollectionCount,
    sidebarOpen,
    setSidebarOpen,
    selectAllAssets, selectAllFolders, setLastUploadedFolder
  } = useContext(AssetContext);
  const {
    setActiveSortFilter,
    activeSortFilter
  } = useContext(FilterContext) as { setActiveSortFilter: Function, activeSortFilter: any };
  const { hasPermission, advancedConfig } =
    useContext(UserContext) as { hasPermission: any, advancedConfig: any };
  const { user: { team } } = useContext(UserContext)

  const headingClick = (value: any) => {
    if (!value) {
      return false
    }
    let sort = activeSortFilter.sort;
    if (value === "folders") {
      sort =
        advancedConfig.collectionSortView === "alphabetical"
          ? selectOptions.sort[3]
          : selectOptions.sort[1];
    } else {
      sort =
        advancedConfig.assetSortView === "newest"
          ? selectOptions.sort[1]
          : selectOptions.sort[3];
    }
    // Reset select all status
    selectAllAssets(false);
    selectAllFolders(false);
    // Needed to reset because it is set for collection upload when alphabetical sort active
    // And uploaded folder needed to show at first
    setLastUploadedFolder(undefined);

    setActiveSortFilter({
      ...activeSortFilter,
      ["mainFilter"]: value,
      sort,
    });

  }

  return (
    <div className={styles.nestedsidenav}>
      <div className={styles["sidenav-content"]}>
        <ReusableHeading
          text={`${team?.company}.`}
          headingClick={headingClick}
          icon={<img onClick={() => { setSidebarOpen(!sidebarOpen) }} src={Utilities.arrowleft} />}
        />
        <NestedFirstlist headingClick={headingClick} />
        <ReusableHeading text="Collections" headingClickType="folders" headingTrue={activeSortFilter.mainFilter === "folders"}
          headingClick={headingClick} totalCount={sidenavTotalCollectionCount} icon={undefined} />
      </div>
      <NestedSidenavDropdown />
    </div>
  );
};
export default React.memo(NestedSidenav);