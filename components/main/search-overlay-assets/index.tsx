import { useContext, useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import { AssetContext, FilterContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import shareCollectionApi from "../../../server-api/share-collection";
import Button from "../../common/buttons/button";
import Search from "../../common/inputs/search";
import styles from "./index.module.css";

import {events} from '../../../constants/analytics';
import useAnalytics from '../../../hooks/useAnalytics';

// Components
const SearchOverlayAssets = ({
  closeOverlay,
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
    selectedAllAssets,
    setFolders,
    setSubFoldersViewList,
  } = useContext(AssetContext);

  const { setSearchTerm, setSearchFilterParams, activeSortFilter } =
    useContext(FilterContext);

  const [filterParams, setFilterParams] = useState({});
  const [openFilters, setOpenFilters] = useState(false);
  const {trackEvent} = useAnalytics();

  const getData = async (
    inputTerm,
    replace = true,
    _filterParams = filterParams
  ) => {
    try {
      if (mode === "assets") {
        let fetchFn = assetApi.getAssets;
        if (sharePath) {
          fetchFn = shareCollectionApi.getAssets;
        }
        setPlaceHolders("asset", replace);
        if (Object.keys(_filterParams).length > 0) {
          setFilterParams(_filterParams);
          setSearchFilterParams(_filterParams);
        }
        const params: any = {
          term: inputTerm,
          stage:
            activeSortFilter?.mainFilter === "archived" ? "archived" : "draft",
          page: replace ? 1 : nextPage,
          sharePath,
          ..._filterParams,
        };
        // search from inside collection
        if (activeFolder) {
          params.folderId = activeFolder;
        }
        const { data } = await fetchFn(params);
        setAssets(data, replace);
      } else if (mode === "SubCollectionView") {
        let query = {
          page: 1,
          sortField: activeSortFilter.sort?.field || "createdAt",
          sortOrder: activeSortFilter.sort?.order || "desc",
          term: inputTerm,
        };
        const { data: subFolders } = await folderApi.getSubFolders(
          query,
          activeFolder
        );

        setSubFoldersViewList(subFolders, true);
      } else if (mode === "folders") {
        let query = {
          page: 1,
          sortField: activeSortFilter.sort?.field || "createdAt",
          sortOrder: activeSortFilter.sort?.order || "desc",
          term: inputTerm,
        };
        const { data } = await folderApi.getFolders(query);
        setFolders(data, true, true);
      }

      
    trackEvent(events.SEARCH_ASSET, {searchTerm: inputTerm});

    } catch (err) {
      // TODO: Handle this error
      console.log(err);
    }
  };

  useEffect(() => {
    if (openFilters) {
      setOpenFilters(false);
    }
  }, [isFolder]);

  const selectedAssets = assets.filter((asset) => asset.isSelected);

  let totalSelectAssets = selectedAssets.length;
  // Hidden pagination assets are selected
  if (selectedAllAssets) {
    // Get assets is not selected on screen
    const currentUnSelectedAssets = assets.filter((asset) => !asset.isSelected);
    //  let totalSelectAssets = totalAssets - currentUnSelectedAssets.length;
  }

  // Close search modal
  const closeSearchModal = () => {
    // Reset all value
    setSearchTerm("");
    setSearchFilterParams({});
    selectAllAssets(false);
    closeOverlay();
  };

  //TODO: we can have an enum for these modes and use that all over the app to ensure consistency
  const isSubCollectionMode =
    mode === "SubCollectionView" ? "Subcollections" : "assets";

  const searchText = mode === "folders" ? "Collections" : isSubCollectionMode;

  return (
    <div>
      <div
        className={
          sharePath
            ? `${styles["share-landing-search"]} search-content`
            : "search-content"
        }
      >
        <div className={"search-cont"}>
          <div className={"search-actions"}>
            {mode === "assets" && (
              <div
                className={"search-filter"}
                onClick={() => setOpenFilters(!openFilters)}
              >
                <img src={Utilities.filterGray} alt={"filter"} />
              </div>
            )}
            {(
              <div className={"search-close"} onClick={closeSearchModal}>
                <img src={Utilities.grayClose} alt={"close"} />
              </div>
            )}
          </div>
          {/* TODO: When is a collecttion change placeholter to "Search Collections" */}
          <Search
            placeholder={`Search ${searchText}`}
            onSubmit={(inputTerm, filterParams) =>
              getData(inputTerm, true, filterParams)
            }
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
