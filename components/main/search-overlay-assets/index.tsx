import { useContext, useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import { AssetContext, FilterContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import shareCollectionApi from "../../../server-api/share-collection";
import Button from "../../common/buttons/button";
import Search from "../../common/inputs/search";
import styles from "./index.module.css";

import { events } from '../../../constants/analytics';
import useAnalytics from '../../../hooks/useAnalytics';

// Components
const SearchOverlayAssets = ({
  closeOverlay = () => { },
  importEnabled = false,
  importAssets = () => { },
  sharePath = "",
  activeFolder = "",
  isFolder,
  mode = "",
}) => {
  const {
    assets,
    setAssets,
    setPlaceHolders,
    nextPage,
    selectAllAssets,
    setFolders,
    setSubFoldersViewList,
  } = useContext(AssetContext);

  const { setSearchTerm, setSearchFilterParams, activeSortFilter } = useContext(FilterContext);

  const [filterParams, setFilterParams] = useState({});
  const [openFilters, setOpenFilters] = useState(false);
  const { trackEvent } = useAnalytics();

  const getData = async (inputTerm, replace = true, _filterParams = filterParams) => {
    try {
      if (mode === "assets") {
        await fetchAssets(inputTerm, replace, _filterParams);
      } else if (mode === "SubCollectionView") {
        await fetchSubFolders(inputTerm);
      } else if (mode === "folders") {
        await fetchFolders(inputTerm);
      }
      trackEvent(events.SEARCH_ASSET, { searchTerm: inputTerm });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAssets = async (inputTerm, replace, _filterParams) => {
    const fetchFn = sharePath ? shareCollectionApi.getAssets : assetApi.getAssets;
    setPlaceHolders("asset", replace);
    if (Object.keys(_filterParams).length > 0) {
      setFilterParams(_filterParams);
      setSearchFilterParams(_filterParams);
    }
    const params = {
      term: inputTerm,
      stage: activeSortFilter?.mainFilter === "archived" ? "archived" : "draft",
      page: replace ? 1 : nextPage,
      sharePath,
      ..._filterParams,
    };

    if (activeFolder) {
      params.folderId = activeFolder;
    }

    const { data } = await fetchFn(params);
    setAssets(data, replace);
  };
  const fetchData = async (fetchFn, inputTerm, isSubFolders = false) => {
    const query = {
      page: 1,
      sortField: activeSortFilter.sort?.field || "createdAt",
      sortOrder: activeSortFilter.sort?.order || "desc",
      term: inputTerm,
      sharePath,
    };

    if (isSubFolders && activeFolder) {
      query.folderId = activeFolder;
    }

    const { data } = await fetchFn(query, isSubFolders ? activeFolder : undefined);
    if (isSubFolders) {
      setSubFoldersViewList(data, true);
    } else {
      setFolders(data, true, true);
    }
  };

  const fetchSubFolders = async (inputTerm) => {
    const fetchFn = sharePath ? shareCollectionApi.getSubFolders : folderApi.getSubFolders;
    await fetchData(fetchFn, inputTerm, true);
  };

  const fetchFolders = async (inputTerm) => {
    const fetchFn = sharePath ? shareCollectionApi.getFolders : folderApi.getFolders;
    await fetchData(fetchFn, inputTerm);
  };

  useEffect(() => {
    if (openFilters) {
      setOpenFilters(false);
    }
  }, [isFolder]);

  const selectedAssets = assets.filter((asset) => asset.isSelected);

  // Close search modal
  const closeSearchModal = () => {
    // Reset all value
    setSearchTerm("");
    setSearchFilterParams({});
    selectAllAssets(false);
    closeOverlay();
  };

  //TODO: we can have an enum for these modes and use that all over the app to ensure consistency
  const isSubCollectionMode = mode === "SubCollectionView" ? "Collections, Sub Collections, Assets" : "assets";

  const searchText = mode === "folders" ? "Collections" : isSubCollectionMode;

  return (
    <div>
      <div className={sharePath ? `${styles["share-landing-search"]} search-content` : "search-content"}>
        <div className={"search-cont"}>
          <div className={"search-actions"}>
            {(mode === "assets" || mode === "SubCollectionView") && (
              <div className={"search-filter"} onClick={() => setOpenFilters(!openFilters)}>
                <img src={Utilities.filterGray} alt={"filter"} />
              </div>
            )}
            {
              <div className={"search-close"} onClick={closeSearchModal}>
                <img src={Utilities.grayClose} alt={"close"} />
              </div>
            }
          </div>
          {/* TODO: When is a collecttion change placeholter to "Search Collections" */}
          <Search
            placeholder={`Search ${searchText}`}
            onSubmit={(inputTerm, filterParams) => getData(inputTerm, true, filterParams)}
            openFilters={openFilters}
          />
        </div>

        {importEnabled && (
          <div className={styles["import-wrapper"]}>
            <Button
              text="Import Assets"
              type="button"
              disabled={selectedAssets.length === 0}
              onClick={importAssets}
              className="container primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlayAssets;
