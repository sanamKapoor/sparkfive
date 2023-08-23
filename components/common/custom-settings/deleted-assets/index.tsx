import update from "immutability-helper";
import { useContext } from "react";
import { AssetContext, FilterContext } from "../../../../context";
import assetApi from "../../../../server-api/asset";
import { getAssetsFilters, getAssetsSort } from "../../../../utils/asset";

// Components
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
  } = useContext(AssetContext);

  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

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

  const mapWithToggleSelection = (asset) => ({ ...asset, toggleSelected });

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

  return (
    <DeletedAssets
      activeSortFilter={activeSortFilter}
      setActiveSortFilter={setActiveSortFilter}
      toggleSelected={toggleSelected}
      loadMore={loadMore}
    />
  );
};

export default DeletedAssetsLibrary;
