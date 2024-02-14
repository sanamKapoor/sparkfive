import { useContext, useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import { AssetContext, FilterContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import shareCollectionApi from "../../../server-api/share-collection";
import Button from "../../common/buttons/button";
import Search from "../../common/inputs/search";
import styles from "./index.module.css";

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
    setFolders,
    setSubFoldersViewList,
  } = useContext(AssetContext);

  const { setSearchTerm, setSearchFilterParams, activeSortFilter } = useContext(FilterContext);

  const [filterParams, setFilterParams] = useState({});
  const [openFilters, setOpenFilters] = useState(false);

  const getData = async (inputTerm, replace = true, _filterParams = filterParams) => {
    try {
      if (mode === "assets") {
        await fetchAssets(inputTerm, replace, _filterParams);
      } else if (mode === "SubCollectionView") {
        await fetchSubFolders(inputTerm);
      } else if (mode === "folders") {
        await fetchFolders(inputTerm);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAssets = async (inputTerm, replace, _filterParams) => {
    let fetchFn = assetApi.getAssets;
    if (sharePath) {
      fetchFn = shareCollectionApi.getAssets;
    }
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

  const fetchSubFolders = async (inputTerm) => {
    let fetchFn = folderApi.getSubFolders;
    if (sharePath) {
      fetchFn = shareCollectionApi.getSubFolders;
    }

    const query = {
      page: 1,
      sortField: activeSortFilter.sort?.field || "createdAt",
      sortOrder: activeSortFilter.sort?.order || "desc",
      term: inputTerm,
      sharePath,
    };

    const { data: subFolders } = await fetchFn(query, activeFolder);
    setSubFoldersViewList(subFolders, true);
  };

  const fetchFolders = async (inputTerm) => {
    let fetchFn = folderApi.getFolders;
    if (sharePath) {
      fetchFn = shareCollectionApi.getFolders;
    }

    const query = {
      page: 1,
      sortField: activeSortFilter.sort?.field || "createdAt",
      sortOrder: activeSortFilter.sort?.order || "desc",
      term: inputTerm,
      sharePath,
    };

    const { data } = await fetchFn(query);
    setFolders(data, true, true);
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
