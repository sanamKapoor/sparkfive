import { useContext } from "react";
import { GeneralImg } from "../../../assets";
import { AssetContext, FilterContext, ShareContext, UserContext } from "../../../context";
import styles from "./share-folder-layout.module.css";

import AssetHeaderOps from "../asset/asset-header-ops";

const ShareFolderLayout = ({ children, advancedLink = false }) => {
  const { folderInfo, activePasswordOverlay } = useContext(ShareContext);
  const { assets, folders } = useContext(AssetContext);
  const { activeSortFilter } = useContext(FilterContext);
  const { logo } = useContext(UserContext);

  const selectedAssets = assets.filter((asset) => asset.isSelected);
  const selectedFolders = folders.filter((folder) => folder.isSelected);

  const amountSelected = activeSortFilter.mainFilter === "folders" ? selectedFolders.length : selectedAssets.length;

  return (
    <>
      {!activePasswordOverlay && (
        <header className={styles.header} id={"share-header"}>
          <div className={styles["image-wrapper"]}>
            <img className={styles["logo-img"]} src={folderInfo?.teamIcon || logo} />
          </div>
          <h1 className={styles["collection-name"]}>{folderInfo?.folderName}</h1>
        </header>
      )}
      {amountSelected > 0 && (
        <div className={styles["ops-wrapper"]}>
          <AssetHeaderOps
            isShare={true}
            advancedLink={advancedLink}
            isFolder={activeSortFilter.mainFilter === "folders"}
          />
        </div>
      )}
      {children}
      <footer className={styles.footer}></footer>
    </>
  );
};

export default ShareFolderLayout;
