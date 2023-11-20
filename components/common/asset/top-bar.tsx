import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

import React from "react";
import { Utilities } from "../../../assets";
import {
  ASSET_UPLOAD_APPROVAL,
  ASSET_UPLOAD_NO_APPROVAL,
} from "../../../constants/permissions";
import { AssetContext, UserContext } from "../../../context";
import selectOptions from "../../../utils/select-options";
import AssetAddition from "../../common/asset/asset-addition";
import {
  default as SearchOverlay,
  default as SearchOverlayAssets,
} from "../../main/search-overlay-assets";
import NavHeading from "../../topbar-newnavigation/NavHeading";
import Button from "../buttons/button";
import Dropdown from "../inputs/dropdown";
import Select from "../inputs/select";
import styles from "./top-bar.module.css";

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
  singleCollection = false,
  sharedAdvanceConfig,
  amountSelected = 0,
  mode,
  showAssetAddition = true,
  activeSearchOverlay,
  closeSearchOverlay,
  setDetailOverlayId,
  setCurrentViewAsset,
  sharePath,
  isFolder,
}: any) => {
  const {
    selectedAllAssets,
    selectAllAssets,
    selectAllFolders,
    selectedAllFolders,
    setLastUploadedFolder,
    folders,
    setActiveFolder,
    sidebarOpen,
    setSidebarOpen,
    selectedAllSubFoldersAndAssets,
    setSelectedAllSubFoldersAndAssets,
    activeSubFolders,
  } = useContext(AssetContext);

  const { hasPermission, advancedConfig } = useContext(UserContext) as any;
  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);
  const [showTabs, setShowTabs] = useState(isMobile ? false : true);
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  const [tabs, setTabs] = useState(selectOptions.views);

  const setSortFilterValue = (key: string, value: string) => {
    let sort = key === "sort" ? value : activeSortFilter.sort;
    if (key === "mainFilter") {
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
    }
    // Reset select all status
    selectAllAssets(false);
    selectAllFolders(false);
    // Needed to reset because it is set for collection upload when alphabetical sort active
    // And uploaded folder needed to show at first
    setLastUploadedFolder(undefined);

    setActiveSortFilter({
      ...activeSortFilter,
      [key]: value,
      sort,
    });
  };

  const toggleSelectAll = () => {
    selectAllAssets(!selectedAllAssets);
  };
  const toggleSelectAllFolders = () => {
    selectAllFolders(!selectedAllFolders);
  };
  const toggleSelectSubCollection = () => {
    setSelectedAllSubFoldersAndAssets(!selectedAllSubFoldersAndAssets);
  };

  const setTabsVisibility = () => {
    const filterElements = sharedAdvanceConfig
      ? sharedAdvanceConfig.hideFilterElements
      : hideFilterElements;

    const _tabs = selectOptions.views.filter((tab) => {
      let tabName = tab.text.toLowerCase();
      let shouldShow = true;
      if (filterElements && filterElements.hasOwnProperty(tabName)) {
        shouldShow = !filterElements[tabName];
      }
      return shouldShow;
    });
    setTabs(_tabs);
  };

  useEffect(() => {
    setTabsVisibility();
  }, [sharedAdvanceConfig]);

  const handleOpenFilter = () => {
    //TODO
  };

  const mobileTabs = tabs.filter((view) => {
    return (
      (!activeFolder || !view.omitFolder) &&
      (!isShare ||
        (isShare &&
          !view.omitShare &&
          view.hideOnSingle !== singleCollection)) &&
      (view.requirePermissions.length === 0 ||
        (view.requirePermissions.length > 0 &&
          hasPermission(view.requirePermissions)))
    );
  });

  return (
    <section
      className={`${
        sidebarOpen ? styles["container"] : styles["container-on-toggle"]
      }`}
      id={"top-bar"}
    >
      <div
        className={styles["filter-mobile"]}
        onClick={() => handleOpenFilter()}
      >
        <img src={Utilities.filterBlue} alt={"filter"} />
      </div>
      {/**
       * Todo manage the case for share collection
       */}
      {/* <div className={styles.titleBreadcrumbs}>
        {activeFolder && mode === "assets" && !singleCollection && (
          <Breadcrumbs
            links={[
              {
                name: "Collections",
                action: () => {
                  setActiveFolder("");
                  setSortFilterValue("mainFilter", "folders");
                },
              },
            ]}
            current={folderData[0]?.name}
          />
        )}
      </div> */}
      <div className={styles.wrapper}>
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
          {/* {activeFolder && mode === "assets" && (
            <SubHeader pageTitle={folderData[0]?.name} children={undefined} />
          )} */}
          <div className={styles.innerwrapper}>
            {!deletedAssets ? (
              <div className={styles.filters}>
                <ul className={styles["tab-list"]}>
                  {isMobile ? (
                    <div className={styles["mobile-tabs"]}>
                      {/* <IconClickable
                        src={Utilities.menu}
                        additionalClass={styles.hamburger}
                        onClick={() => setShowTabs(!showTabs)}
                      /> */}
                      <li className={styles["tab-list-item"]}>
                        <NavHeading isShare={isShare} />
                      </li>
                      {showTabs && (
                        <Dropdown
                          onClickOutside={() => setShowTabs(false)}
                          additionalClass={styles.dropdown}
                          options={mobileTabs.map((tab) => ({
                            label: tab.text,
                            id: tab.name,
                            onClick: () => {
                              setSortFilterValue("mainFilter", tab.name);
                            },
                          }))}
                        />
                      )}
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
          {!isMobile && !isShare && !activeSearchOverlay && (
            <div className={styles["search-icon"]}>
              <img
                src={Utilities.search}
                onClick={setActiveSearchOverlay}
                className={`${styles.search} ${styles.SearchWeb} ${
                  !(
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
          {activeSearchOverlay && !(isShare && isFolder) && (
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
              <img
                className={styles.gridList}
                src={
                  activeView === "grid"
                    ? Utilities.gridView
                    : Utilities.listView
                }
                onClick={() => setShowViewDropdown(true)}
              />
            )}
            {showViewDropdown && (
              <Dropdown
                additionalClass={styles["view-dropdown"]}
                onClickOutside={() => setShowViewDropdown(false)}
                options={[
                  {
                    id: "view",
                    OverrideComp: () => (
                      <li className={styles["dropdown-title"]}>View</li>
                    ),
                  },
                  {
                    label: "Grid",
                    id: "grid",
                    icon: Utilities.gridView,
                    onClick: () => {
                      setActiveView("grid");
                    },
                  },
                  {
                    label: "List",
                    id: "list",
                    icon: Utilities.listView,
                    onClick: () => {
                      setActiveView("list");
                    },
                  },
                ]}
              />
            )}
          </div>
          {selectedAllAssets && (
            <span
              className={styles["select-only-shown-items-text"]}
              onClick={toggleSelectAll}
            >
              Select only 25 assets shown
            </span>
          )}
          {selectedAllSubFoldersAndAssets && (
            <span
              className={styles["select-only-shown-items-text"]}
              onClick={toggleSelectSubCollection}
            >
              Select only 5 Sub collections and 25 Assets shown
            </span>
          )}

          {selectedAllFolders && (
            <span
              className={styles["select-only-shown-items-text"]}
              onClick={toggleSelectAllFolders}
            >
              Select only 25 collections shown
            </span>
          )}
          <div className={styles["selected-wrapper"]}>
            <Button
              type="button"
              text="Select All"
              className="container secondary"
              onClick={selectAll}
            />
          </div>

          {/* {!deletedAssets && !isMobile && ( */}
          <div className={styles["nested-wrapper"]}>
            {/* old filter button needed to be removed */}
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
              options={selectOptions.sort.filter((item) => {
                if (
                  activeSortFilter.mainFilter === "folders" &&
                  item.value === "size"
                ) {
                  return !item;
                }
                return activeSortFilter.mainFilter === "folders" &&
                  item.value === "none"
                  ? !item
                  : item;
              })}
              value={activeSortFilter.sort}
              styleType="filter filter-schedule"
              onChange={(selected) => setSortFilterValue("sort", selected)}
              placeholder="Sort By"
            />
          </div>
        </div>
        <div className={styles["mobile-app"]}>
          <div className={styles["outer-box"]}>
            <div className={styles["selected-wrapper-mob"]}>
              <Button
                type="button"
                text="Select All"
                className="container secondary mobile-select"
                onClick={selectAll}
              />
            </div>
            <div className={styles["sort-wrapper-mob"]}>
              <Select
                label={"Sort By"}
                options={selectOptions.sort.filter((item) => {
                  if (
                    activeSortFilter.mainFilter === "folders" &&
                    item.value === "size"
                  ) {
                    return !item;
                  }
                  return activeSortFilter.mainFilter === "folders" &&
                    item.value === "none"
                    ? !item
                    : item;
                })}
                value={activeSortFilter.sort}
                styleType="filter filter-schedule"
                onChange={(selected) => setSortFilterValue("sort", selected)}
                placeholder="Sort By"
              />
            </div>
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
