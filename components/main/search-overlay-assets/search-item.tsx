import { useState } from "react";
import Highlighter from "react-highlight-words";
import { Utilities } from "../../../assets";
import { getParsedExtension } from "../../../utils/asset";
import styles from "./search-item.module.css";

// Components
import AssetIcon from "../../common/asset/asset-icon";
import AssetImg from "../../common/asset/asset-img";
import DetailOverlay from "../../common/asset/detail-overlay";
import IconClickable from "../../common/buttons/icon-clickable";
const DEFAULT_DETAIL_PROPS = { visible: false, side: "detail" };

const SearchItem = ({
  assetItem,
  term,
  openShareAsset,
  openDeleteAsset,
  toggleSelected,
  enabledSelect = false,
  isShare,
  activeFolder = "",
  onCloseDetailOverlay = (assetData) => {},
}) => {
  const {
    asset,
    thumbailUrl,
    realUrl,
    isLoading = false,
    isSelected,
  } = assetItem;
  const [visibleOverlay, setVisibleOVerlay] = useState(false);
  const [overlayProperties] = useState(DEFAULT_DETAIL_PROPS);

  const searchWords = term.split(" ");

  return (
    <>
      <li className={`search-item ${styles["search-item"]}`}>
        {!isLoading && enabledSelect && (
          <>
            {isSelected ? (
              <IconClickable
                src={Utilities.radioButtonEnabled}
                additionalClass={styles["select-icon"]}
                onClick={toggleSelected}
              />
            ) : (
              <IconClickable
                src={Utilities.radioButtonNormal}
                additionalClass={styles["select-icon"]}
                onClick={toggleSelected}
              />
            )}
          </>
        )}
        <div
          className={`${styles["image-wrapper"]} ${isLoading && "loadable"} ${
            enabledSelect && styles["image-selectable"]
          }`}
        >
          {thumbailUrl ? (
            <AssetImg
              assetImg={thumbailUrl}
              type={asset.type}
              name={asset.name}
            />
          ) : (
            <AssetIcon noMargin extension={asset.extension} onList={true} />
          )}
        </div>
        <div
          className={`${styles.name} ${isLoading && "loadable"}`}
          onClick={() => (!isLoading ? setVisibleOVerlay(true) : () => {})}
        >
          <Highlighter
            highlightClassName={"search-highlight"}
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={asset.name}
          />
        </div>
        <div className={styles.tag}>
          {!isLoading &&
            (asset?.tags && asset.tags.length > 0
              ? asset.tags.map(({ name }) => <span>{name}</span>)
              : "No Tags")}
        </div>
        <div className={`${styles.extension} ${isLoading && "loadable"}`}>
          <Highlighter
            highlightClassName={"search-highlight"}
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={getParsedExtension(asset.extension) || "na"}
          />
        </div>
        <div className={styles.folder}>
          {!isLoading &&
            (asset && asset.folders && asset.folders.length > 0
              ? asset.folders.map((folder) => <span>{folder.name}</span>)
              : "No Collection")}
        </div>
      </li>
      {visibleOverlay && (
        <DetailOverlay
          isShare={isShare}
          sharePath={isShare}
          initialParams={overlayProperties}
          thumbailUrl={thumbailUrl}
          asset={asset}
          realUrl={
            asset.extension === "tiff" || asset.extension === "tif"
              ? thumbailUrl
              : realUrl
          }
          openShareAsset={openShareAsset}
          openDeleteAsset={openDeleteAsset}
          closeOverlay={(value, assetData) => {
            setVisibleOVerlay(false);
            onCloseDetailOverlay(assetData);
          }}
          activeFolder={activeFolder}
        />
      )}
    </>
  );
};

export default SearchItem;
