import { useContext, useEffect, useState } from "react";
import { Utilities } from "../../../assets";
import { AssetContext, FilterContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import shareCollectionApi from "../../../server-api/share-collection";
import styles from "./index.module.css";

// Components
import Button from "../../common/buttons/button";
import Search from "../../common/inputs/search";

const SearchOverlayAssets = ({
  closeOverlay,
  importEnabled = false,
  operationsEnabled = false,
  importAssets = () => {},
  sharePath = "",
  activeFolder = "",
  onCloseDetailOverlay = (assetData) => {},
  onClickOutside,
  isFolder,
}) => {
  const {
    assets,
    setAssets,
    setPlaceHolders,
    nextPage,
    selectAllAssets,
    selectedAllAssets,
    totalAssets,
    setFolders,
  } = useContext(AssetContext);

  const { setSearchTerm, setSearchFilterParams, activeSortFilter } =
    useContext(FilterContext);

  const [filterParams, setFilterParams] = useState({});
  const [openFilters, setOpenFilters] = useState(false);

  const getData = async (
    inputTerm,
    replace = true,
    _filterParams = filterParams
  ) => {
    try {
      if (!isFolder) {
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
      } else {
        let query = {
          page: 1,
          sortField: activeSortFilter.sort?.field || "createdAt",
          sortOrder: activeSortFilter.sort?.order || "desc",
          term: inputTerm,
        };
        const { data } = await folderApi.getFolders(query);
        setFolders(data, true, true);
      }
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

  // Hidden pagination assets are selected
  if (selectedAllAssets) {
    // Get assets is not selected on screen
    const currentUnSelectedAssets = assets.filter((asset) => !asset.isSelected);
    totalSelectAssets = totalAssets - currentUnSelectedAssets.length;
  }

  // Close search modal
  const closeSearchModal = () => {
    // Reset all value
    setSearchTerm("");
    setSearchFilterParams({});
    selectAllAssets(false);

    closeOverlay();
  };

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
            {!isFolder && (
              <div
                className={"search-filter"}
                onClick={() => setOpenFilters(!openFilters)}
              >
                <img src={Utilities.filterGray} alt={"filter"} />
              </div>
            )}
            {!sharePath && (
              <div className={"search-close"} onClick={closeSearchModal}>
                <img src={Utilities.grayClose} alt={"close"} />
              </div>
            )}
          </div>
          {/* TODO: When is a collecttion change placeholter to "Search Collections" */}
          <Search
            placeholder={`Search ${isFolder ? "Collections" : "Assets"}`}
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
