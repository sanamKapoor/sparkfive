import React from 'react';
import { useContext } from 'react';

import { Utilities } from '../../assets';
import { AssetContext, FilterContext, UserContext } from '../../context';
import selectOptions from '../../utils/select-options';
import ReusableHeading from './nested-heading';
import NestedSidenavDropdown from './nested-sidenav-dropdown-list';
import NestedFirstlist from './nested-sidenav-firstlist';
import styles from './nested-sidenav.module.css';

const NestedSidenav = () => {
  const {
    sidenavTotalCollectionCount,
    sidebarOpen,
    setSidebarOpen,
    selectAllAssets, selectAllFolders, setLastUploadedFolder,
    setHeaderName
  } = useContext(AssetContext);
  const {
    setActiveSortFilter,
    activeSortFilter
  } = useContext(FilterContext) as { setActiveSortFilter: Function, activeSortFilter: any };
  const { advancedConfig, user: { team } } =
    useContext(UserContext) as { advancedConfig: any, user: any };

  const headingClick = (value: string, description: string) => {
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
    //setting the HeaderName
    setHeaderName(description)
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
          customStyle={{ padding: "0px 23px 0px 23px" }}
          text={`${team?.company}.`}
          headingClick={headingClick}
          icon={<img onClick={() => { setSidebarOpen(!sidebarOpen) }} src={Utilities.arrowleft} />}
        />
        <div className={styles.sidenavScroll}>
          <NestedFirstlist headingClick={headingClick} />

          <NestedSidenavDropdown headingClick={headingClick} />
        </div>


      </div>


    </div>
  );
};
export default React.memo(NestedSidenav);