import styles from "./search-item.module.css";
import { Utilities } from "../../../assets";
import Router from "next/router";
import { format } from "date-fns";
import Highlighter from "react-highlight-words";
import { getAssociatedCampaigns } from "../../../utils/asset";
import { useState } from "react";
import { getParsedExtension } from "../../../utils/asset";

// Components
import AssetImg from "../../common/asset/asset-img";
import AssetVideo from "../../common/asset/asset-video";
import AssetApplication from "../../common/asset/asset-application";
import AssetText from "../../common/asset/asset-text";
import DetailOverlay from "../../common/asset/detail-overlay";
import IconClickable from "../../common/buttons/icon-clickable";
import AssetIcon from "../../common/asset/asset-icon";

const SearchItem = ({
  assetItem,
  term,
  openShareAsset,
  openDeleteAsset,
  toggleSelected,
  enabledSelect = false,
  isShare,
}) => {
  const {
    asset,
    thumbailUrl,
    realUrl,
    isLoading = false,
    isSelected,
  } = assetItem;
  const [visibleOverlay, setVisibleOVerlay] = useState(false);

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
          className={`${styles["image-wrapper"]} ${isLoading && "loadable"} ${enabledSelect && styles["image-selectable"]
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
          {/* {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />}
          {asset.type === 'video' && <AssetVideo asset={asset} realUrl={realUrl} additionalClass={styles['video-wrapper']} />}
          {asset.type === 'application' && <AssetApplication extension={asset.extension} onList={true} />}
          {asset.type === 'text' && <AssetText extension={asset.extension} onList={true} />} */}
        </div>
        <div
          className={`${styles.name} ${isLoading && "loadable"}`}
          onClick={() => (!isLoading ? setVisibleOVerlay(true) : () => { })}
        >
          <Highlighter
            highlightClassName={"search-highlight"}
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={asset.name}
          />
        </div>
        <div className={styles.tag}>
          {!isLoading && (
            asset?.tags && asset.tags.length > 0 ? (
              asset.tags.map(({ name }) => (
                <span>{name}</span>
              ))
            ) : (
              "No Tags"
            )
          )}
        </div>
        <div className={`${styles.extension} ${isLoading && "loadable"}`}>
          <Highlighter
            highlightClassName={"search-highlight"}
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={getParsedExtension(asset.extension) || 'na'}
          />
        </div>
        <div className={styles.folder}>
          {!isLoading && (
            asset && asset.folders && asset.folders.length > 0 ? (
              asset.folders.map((folder) => (
                <span>{folder.name}</span>
              ))
            ) : (
              "No Collection"
            )
          )}
        </div>
      </li>
      {visibleOverlay && (
        <DetailOverlay
          thumbailUrl={thumbailUrl}
          isShare={isShare}
          initialParams={{}}
          asset={asset}
          realUrl={realUrl}
          openShareAsset={openShareAsset}
          openDeleteAsset={openDeleteAsset}
          closeOverlay={() => setVisibleOVerlay(false)}
        />
      )}
    </>
  );
};

export default SearchItem;
