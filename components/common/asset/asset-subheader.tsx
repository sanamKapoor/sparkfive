// Components
import AssetHeaderOps from "../../common/asset/asset-header-ops";

const AssetSubheader = ({
  amountSelected = 0,
  activeSortFilter,
  mode,
  deletedAssets = false,
}) => {
  return (
    <>
      {amountSelected > 0 && (
        <AssetHeaderOps
          isUnarchive={activeSortFilter.mainFilter === "archived"}
          isFolder={mode === "folders"}
          iconColor="White"
          deletedAssets={deletedAssets}
        />
      )}
    </>
  );
};

export default AssetSubheader;
