import { useContext } from "react";
import { GeneralImg } from "../../../assets";
import { AssetContext, FilterContext, ShareContext, UserContext } from "../../../context";
import styles from "./share-folder-layout.module.css";

import AssetHeaderOps from "../asset/asset-header-ops";

const ShareFolderLayout = ({ children, advancedLink = false ,headerZIndex}) => {
  const headerStyle = {
    zIndex: typeof headerZIndex !== 'undefined' ? headerZIndex : '1500',
  };
  const { folderInfo, activePasswordOverlay } = useContext(ShareContext);
  const { assets, folders, subFoldersAssetsViewList, subFoldersViewList } = useContext(AssetContext);
  const { activeSortFilter } = useContext(FilterContext);
  const { logo } = useContext(UserContext);

  const selectedAssets = assets.filter((asset) => asset.isSelected);
  const selectedFolders = folders.filter((folder) => folder.isSelected);
  const selectedSubFoldersAndAssets = {
    assets: subFoldersAssetsViewList.results.filter(
      (asset: any) => asset.isSelected
    ),
    folders: subFoldersViewList.results.filter((folder: any) => folder.isSelected),
  };
  const amountSelected = activeSortFilter.mainFilter === "SubCollectionView" ? selectedSubFoldersAndAssets.folders.length || selectedSubFoldersAndAssets.assets.length :
    activeSortFilter.mainFilter === "folders"
      ? selectedFolders.length
      : selectedAssets.length;

  return (
    <>
      {!activePasswordOverlay && (
        <header className={styles.header} id={"share-header"} style={headerStyle}>
          <div className={styles["image-wrapper"]}>
            <img className={styles["logo-img"]} src={folderInfo?.teamIcon || logo} />
          </div>
        </header>
      )}
      {amountSelected > 0 && (
        <div className={styles["ops-wrapper"]}>
          <AssetHeaderOps
            isShare={true}
            advancedLink={advancedLink}
            activeMode={activeSortFilter.mainFilter === "SubCollectionView" ?
              "SubCollectionView" : activeSortFilter.mainFilter === "folders" ? "folders" : "assets"}
            isFolder={activeSortFilter.mainFilter === "folders"}
            selectedFolders={selectedFolders}
            selectedSubFoldersAndAssets={selectedSubFoldersAndAssets}
          />
        </div>
      )}
      {children}
      <footer className={styles.footer}></footer>
    </>
  );
};

export default ShareFolderLayout;
