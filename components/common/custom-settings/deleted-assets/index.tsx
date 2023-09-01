import update from "immutability-helper";
import { useContext, useEffect } from "react";
import { AssetContext, FilterContext } from "../../../../context";
import assetApi from "../../../../server-api/asset";
import { getAssetsFilters, getAssetsSort } from "../../../../utils/asset";

import styles from "./index.module.css";

// Components
import selectOptions from "../../../../utils/select-options";
import AssetOps from "../../asset/asset-ops";
import AssetSubheader from "../../asset/asset-subheader";
import Button from "../../buttons/button";
import Select from "../../inputs/select";
import DeletedAssets from "./deleted-assets";

const DeletedAssetsLibrary = () => {
  const {
    assets,
    setAssets,
    setPlaceHolders,
    activeFolder,
    nextPage,
    addedIds,
    setAddedIds,
    setLoadingAssets,
    selectAllAssets,
    selectedAllAssets,
  } = useContext(AssetContext);

  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  useEffect(() => {
    getAssets();
  }, [activeSortFilter]);

  const setSortFilterValue = (value) => {
    selectAllAssets(false);
    setActiveSortFilter({
      ...activeSortFilter,
      sort: value,
    });
  };

  const getAssets = async (replace = true, complete = null) => {
    try {
      setLoadingAssets(true);
      if (replace) {
        setAddedIds([]);
      }
      setPlaceHolders("asset", replace);
      const { data } = await assetApi.getAssets({
        ...getAssetsFilters({
          replace,
          activeFolder,
          addedIds,
          nextPage,
          userFilterObject: activeSortFilter,
        }),
        complete,
        ...getAssetsSort(activeSortFilter),
        deletedAssets: true,
      });
      setAssets(
        { ...data, results: data.results.map(mapWithToggleSelection) },
        replace
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAssets(false);
    }
  };

  const selectAll = () => {
    selectAllAssets();
    setAssets(assets.map((assetItem) => ({ ...assetItem, isSelected: true })));
  };

  const mapWithToggleSelection = (asset) => ({
    ...asset,
    isSelected: selectedAllAssets,
    toggleSelected,
  });

  const selectedAssets = assets.filter((asset) => asset.isSelected);

  const toggleSelected = (id) => {
    const assetIndex = assets.findIndex(
      (assetItem) => assetItem.asset.id === id
    );
    setAssets(
      update(assets, {
        [assetIndex]: {
          isSelected: { $set: !assets[assetIndex].isSelected },
        },
      })
    );
  };

  const loadMore = () => {
    getAssets(false);
  };

  const toggleSelectAll = () => {
    selectAllAssets(!selectedAllAssets);
  };

  const sortOptions = selectOptions.sort.filter(
    (item) =>
      item.value === "newest" ||
      item.value === "oldest" ||
      item.value === "alphabetical"
  );

  return assets.length > 0 ? (
    <>
      <AssetSubheader
        mode={"asset"}
        amountSelected={selectedAssets.length}
        activeSortFilter={activeSortFilter}
        deletedAssets={true}
      />
      <div className={styles.infowrapper}>
        <div className={styles.header}>
          <h2>Deleted Assets</h2>
          <div></div>
          <span className={styles.header__content}>
            Deleted assets are retained for 60 days before permanent removal.
            Admin can recover deleted assets within 60 days
          </span>
        </div>
        <div className={styles.subHeader}>
          {selectedAllAssets && (
            <span
              className={styles["select-only-shown-items-text"]}
              onClick={toggleSelectAll}
            >
              Select only 25 assets shown
            </span>
          )}
          <div className={styles.newbtn}>
            <Button
              type="button"
              text="Select All"
              className="container secondary"
              onClick={selectAll}
            />
          </div>
          <div className={styles["sort-wrapper"]}>
            <Select
              label={"Sort By"}
              options={sortOptions}
              value={activeSortFilter.sort}
              styleType="filter filter-schedule"
              onChange={(selected) => setSortFilterValue(selected)}
              placeholder="Sort By"
            />
          </div>
        </div>
      </div>
      <DeletedAssets toggleSelected={toggleSelected} loadMore={loadMore} />
      <AssetOps getAssets={getAssets} />
    </>
  ) : (
    <p>No deleted assets at the moment.</p>
  );
};

export default DeletedAssetsLibrary;
