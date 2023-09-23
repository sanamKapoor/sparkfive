import styles from "./top-bar.module.css";
import React, { useContext, useState, useRef, useEffect } from "react";
import { Utilities } from "../../../assets";
import selectOptions from "../../../utils/select-options";
import { isMobile } from "react-device-detect";

// Components
import SectionButton from "../buttons/section-button";
import Select from "../inputs/select";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import AssetAddition from "../../common/asset/asset-addition";
import Dropdown from "../inputs/dropdown";
import SubHeader from "../layouts/sub-header";
import Breadcrumbs from "../misc/breadcrumbs";

// Context
import { AssetContext, UserContext } from "../../../context";

import {
  ASSET_UPLOAD_NO_APPROVAL,
  ASSET_UPLOAD_APPROVAL,
} from "../../../constants/permissions";
import SearchOverlay from "../../main/search-overlay-assets";

const TopBar = ({
  activeSortFilter,
  setActiveSearchOverlay,
  setActiveSortFilter,
  setActiveView,
  activeView,
  selectAll,
  activeFolder = "",
  getFolders,
  setOpenFilter,
  openFilter,
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
  activeMode,
}) => {
  const {
    selectedAllAssets,
    selectAllAssets,
    selectAllFolders,
    selectedAllFolders,
    setLastUploadedFolder,
    folders,
    setActiveFolder,
  } = useContext(AssetContext);

  const { user, hasPermission, advancedConfig, setAdvancedConfig } =
    useContext(UserContext);
  const [hideFilterElements, setHideFilterElements] = useState(
    advancedConfig.hideFilterElements
  );
  const [showTabs, setShowTabs] = useState(isMobile ? false : true);
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  const [tabs, setTabs] = useState(selectOptions.views);

  const setSortFilterValue = (key, value) => {
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
    setActiveSortFilter({
      ...activeSortFilter,
    });
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
    if (openFilter) {
      setOpenFilter(false);
    } else {
      setOpenFilter(true);
    }
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

  const folderData = folders.filter((folder) => folder.id === activeFolder);

  return (
    <section className={styles.container} id={"top-bar"}>
      <div
        className={styles["filter-mobile"]}
        onClick={() => handleOpenFilter()}
      >
        <img src={Utilities.filterBlue} alt={"filter"} />
      </div>
      <div className={styles.titleBreadcrumbs}>
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
        {activeFolder && mode === "assets" && !singleCollection && (
          <SubHeader pageTitle={folderData[0]?.name} />
        )}
      </div>
      <div className={styles.wrapper}>
        <div className={styles.innerwrapper}>
          {!deletedAssets ? (
            <div className={styles.filters}>
              <ul className={styles["tab-list"]}>
                {isMobile ? (
                  <div className={styles["mobile-tabs"]}>
                    <IconClickable
                      src={Utilities.menu}
                      additionalClass={styles.hamburger}
                      onClick={() => setShowTabs(!showTabs)}
                    />
                    <li className={styles["tab-list-item"]}>
                      {tabs
                        .filter(
                          (view) => activeSortFilter.mainFilter === view.name
                        )
                        .map((view) => (
                          <SectionButton
                            keyProp={view.name}
                            text={
                              activeFolder && mode === "assets"
                                ? folderData[0].name
                                : view.text
                            }
                            active={activeSortFilter.mainFilter === view.name}
                            onClick={() =>
                              setSortFilterValue("mainFilter", view.name)
                            }
                          />
                        ))}
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
                  tabs.map((view) => {
                    return (
                      <li key={view.name} className={styles["tab-list-item"]}>
                        {(!activeFolder || !view.omitFolder) &&
                          (!isShare ||
                            (isShare &&
                              !view.omitShare &&
                              view.hideOnSingle !== singleCollection)) &&
                          (view.requirePermissions.length === 0 ||
                            (view.requirePermissions.length > 0 &&
                              hasPermission(view.requirePermissions))) && (
                            <SectionButton
                              keyProp={view.name}
                              text={view.text}
                              active={activeSortFilter.mainFilter === view.name}
                              onClick={() =>
                                setSortFilterValue("mainFilter", view.name)
                              }
                            />
                          )}
                      </li>
                    );
                  })
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
        <div className={styles["sec-filters"]}>
          {!isMobile && !isShare && !activeSearchOverlay && (
            <img
              src={Utilities.search}
              onClick={setActiveSearchOverlay}
              className={`${styles.search} ${!((amountSelected === 0 || mode === "folders") &&
              showAssetAddition &&
              hasPermission([
                ASSET_UPLOAD_NO_APPROVAL,
                ASSET_UPLOAD_APPROVAL,
              ])) ? "m-r-20": "" }`}
            />
          )}
          {activeSearchOverlay && !(isShare && isFolder) &&(
            <SearchOverlay
              closeOverlay={closeSearchOverlay}
              operationsEnabled={true}
              activeFolder={activeFolder}
              onCloseDetailOverlay={(assetData) => {
                closeSearchOverlay();
                // setActiveSearchOverlay(false)
                setDetailOverlayId(undefined);
                setCurrentViewAsset(assetData);
              }}
              sharePath={sharePath}
              isFolder={isFolder}
            />
          )}
          {(amountSelected === 0 || mode === "folders") &&
            showAssetAddition &&
            hasPermission([
              ASSET_UPLOAD_NO_APPROVAL,
              ASSET_UPLOAD_APPROVAL,
            ]) && (

              <div  className={styles.mobilePlus}>
              <AssetAddition
              activeFolder={activeFolder}
              getFolders={getFolders}
            /></div>
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
          {selectedAllFolders && (
            <span
              className={styles["select-only-shown-items-text"]}
              onClick={toggleSelectAll}
            >
              Select only 25 collections shown
            </span>
          )}
          <Button
            type="button"
            text="Select All"
            styleType="secondary"
            onClick={selectAll}
          />
          {!deletedAssets && !isMobile && (
            <div className={styles["nested-wrapper"]}>
              <Button
                text="Filters"
                type="button"
                styleType="secondary"
                onClick={() => {
                  handleOpenFilter();
                }}
              />
            </div>
          )}
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
      </div>

      <div className={styles["mobile-bottom"]}>
        {(amountSelected === 0 || mode === "folders") &&
          showAssetAddition &&
          hasPermission([ASSET_UPLOAD_NO_APPROVAL, ASSET_UPLOAD_APPROVAL]) && (
            <AssetAddition
              activeFolder={activeFolder}
              getFolders={getFolders}
            />
          )}
      </div>
    </section>
  );
};

export default TopBar;
