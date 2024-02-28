import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { isMobile } from 'react-device-detect';

import { Utilities } from '../../../assets';
import { ASSET_UPLOAD_APPROVAL, ASSET_UPLOAD_NO_APPROVAL } from '../../../constants/permissions';
import { AssetContext, UserContext } from '../../../context';
import selectOptions from '../../../utils/select-options';
import AssetAddition from '../../common/asset/asset-addition';
import SearchOverlay, { default as SearchOverlayAssets } from '../../main/search-overlay-assets';
import NavHeading from '../../topbar-newnavigation/NavHeading';
import Button from '../buttons/button';
import Dropdown from '../inputs/dropdown';
import Select from '../inputs/select';
import styles from './top-bar.module.css';

const TopBar = ({
  activeSortFilter,
  setActiveSearchOverlay,
  setActiveSortFilter,
  setActiveView,
  activeView,
  selectAll,
  activeFolder = "",
  isShare = false,
  deletedAssets,
  amountSelected = 0,
  mode,
  showAssetAddition = true,
  activeSearchOverlay,
  closeSearchOverlay,
  sharePath,
  renderSidebar = true,
  isFolder,
}: any) => {

  const {
    selectAllAssets,
    selectAllFolders,
    setLastUploadedFolder,
    sidebarOpen,
    setSidebarOpen,
    setSelectedAllSubFoldersAndAssets,
    activeSubFolders,
    setSelectedAllSubAssets
  } = useContext(AssetContext);

  const { hasPermission, advancedConfig } = useContext(UserContext) as any;
  const [showViewDropdown, setShowViewDropdown] = useState(false);


  const setSortFilterValue = (key: string, value: string) => {

    let sort = key === "sort" ? value : activeSortFilter.sort;
    if (key === "mainFilter") {
      if (value === "folders" || value === "SubCollectionView") {
        sort = advancedConfig.collectionSortView === "alphabetical" ? selectOptions.sort[3] : selectOptions.sort[1];
      } else {
        sort = advancedConfig.assetSortView === "newest" ? selectOptions.sort[1] : selectOptions.sort[3];
      }
    }
    // Reset select all status
    selectAllAssets(false);
    selectAllFolders(false);
    setSelectedAllSubAssets(false)
    setSelectedAllSubFoldersAndAssets(false);

    // Needed to reset because it is set for collection upload when alphabetical sort active
    // And uploaded folder needed to show at first
    setLastUploadedFolder(undefined);

    setActiveSortFilter({
      ...activeSortFilter,
      [key]: value,
      sort,
    });
  };
  return (
    <section
      data-drag="false"
      className={`${(renderSidebar && sidebarOpen) ? !isShare ? styles["container"] : styles["topbarShareContainer"] : styles["container-on-toggle"]
        } }`}
      id={"top-bar"}
    >
      <div
        className={styles["filter-mobile"]}
      >
        <img src={Utilities.filterBlue} alt={"filter"} />
      </div>
      <div data-drag="false" className={styles.wrapper}>
        <div className={`${styles["main-heading-wrapper"]}`}>
          {sidebarOpen ? null : (
            <div className={styles.newsidenav}>
              <img
                className={styles.sidenavRightIcon}
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                }}
                src={Utilities.arrowright}
              />
            </div>
          )}
          <div className={styles.innerwrapper}>
            {!deletedAssets ? (
              <div className={styles.filters}>
                <ul className={styles["tab-list"]}>
                  {isMobile ? (
                    <div className={styles["mobile-tabs"]}>
                      <li className={styles["tab-list-item"]}>
                        <NavHeading isShare={isShare} />
                      </li>
                    </div>
                  ) : (
                    <NavHeading isShare={isShare} />
                  )}
                </ul>
              </div>
            ) : (
              <div className={styles.filters}>
                <h2>Deleted Assets</h2>
                <div></div>
                <span className={styles["content"]}>
                  Deleted assets are retained for 60 days before permanent
                  removal. Admin can recover deleted assets within 60 days
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles["sec-filters"]}>
          {!activeSearchOverlay && (
            <div className={styles["search-icon"]}>
              <img
                src={Utilities.search}
                onClick={setActiveSearchOverlay}
                className={`${styles.search} ${styles.SearchWeb} ${!(
                  (amountSelected === 0 || mode === "folders") &&
                  showAssetAddition &&
                  hasPermission([
                    ASSET_UPLOAD_NO_APPROVAL,
                    ASSET_UPLOAD_APPROVAL,
                  ])
                )
                  ? "m-r-20"
                  : ""
                  }`}
              />
              <div className={styles.SearchMobile}>
                <SearchOverlayAssets />
              </div>
            </div>
          )}
          {activeSearchOverlay &&
            (
              <SearchOverlay
                closeOverlay={closeSearchOverlay}
                activeFolder={
                  mode === "SubCollectionView" ? activeSubFolders : activeFolder
                }
                mode={mode}
                sharePath={sharePath}
                isFolder={isFolder}
                onClickOutside={undefined}
              />
            )}
          {(amountSelected === 0 || mode === "folders") &&
            showAssetAddition &&
            hasPermission([
              ASSET_UPLOAD_NO_APPROVAL,
              ASSET_UPLOAD_APPROVAL,
            ]) && (
              <div className={styles["mobilePlus"]}>
                <AssetAddition
                  activeFolder={
                    mode === "SubCollectionView"
                      ? activeSubFolders
                      : activeFolder
                  }
                />
              </div>
            )}
          <div className={styles.gridOuter}>
            {!deletedAssets && (
              <>
                {activeView === "grid" && (
                  <Utilities.gridView className={styles.gridList} onClick={() => setShowViewDropdown(true)} />
                )}
                {activeView === "list" && (
                  <Utilities.listView className={styles.gridList} onClick={() => setShowViewDropdown(true)} />
                )}
              </>
            )}
            {showViewDropdown && (
              <Dropdown
                additionalClass={styles["view-dropdown"]}
                onClickOutside={() => setShowViewDropdown(false)}
                svgIcon
                options={[
                  {
                    id: "view",
                    OverrideComp: () => <li className={styles["dropdown-title"]}>View</li>,
                  },
                  {
                    label: "Grid",
                    id: "grid",
                    icon: <Utilities.gridView />,
                    onClick: () => {
                      setActiveView("grid");
                    },
                  },
                  {
                    label: "List",
                    id: "list",
                    icon: <Utilities.listView />,
                    onClick: () => {
                      setActiveView("list");
                    },
                  },
                ]}
              />
            )}
          </div>
          <div className={styles["selected-wrapper"]}>
            <Button
              type="button"
              text="Select All"
              className="container secondary"
              onClick={selectAll}
            />
          </div>

          <div className={styles["nested-wrapper"]}>
            <Button
              text="Filters"
              type="button"
              className="container secondary filter-btn-mob"
              onClick={() => {
                handleOpenFilter();
              }}
            />
          </div>
          {/* )} */}

          <div className={styles["sort-wrapper"]}>
            <Select
              label={"Sort By"}
              options={selectOptions.sort.filter(item => {
                const filters = {
                  folders: ['size', 'none'],
                  SubCollectionView: ['size', 'none'],
                };

                const shouldExcludeItem = (
                  filters[activeSortFilter.mainFilter] &&
                  filters[activeSortFilter.mainFilter].includes(item.value)
                );

                return !shouldExcludeItem;
              })}
              value={activeSortFilter.sort}
              styleType="filter filter-schedule"
              onChange={(selected) => setSortFilterValue("sort", selected)}
              placeholder="Sort By"
            />
          </div>
        </div>
      </div>

      <div className={styles["mobile-bottom"]}>
        {(amountSelected === 0 || mode === "folders") &&
          showAssetAddition &&
          hasPermission([ASSET_UPLOAD_NO_APPROVAL, ASSET_UPLOAD_APPROVAL]) && (
            <AssetAddition triggerUploadComplete={undefined} />
          )}
      </div>
    </section>
  );
};

export default TopBar;
