import { useState } from "react";
import Search from "../attributes/search-input";

import styles from "./asset-related-files-search.module.css";

import assetApi from "../../../server-api/asset";
import AssetIcon from "./asset-icon";
import AssetImg from "./asset-img";

export default function AssetRelatedFilesSearch({ onSelect }) {
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showList, setShowList] = useState(false);

  const search = async (value) => {
    if (value || showList) {
      const queryParams = {
        term: value,
        page: 1,
      };
      try {
        setShowList(true);
        setSearching(true);

        const { data } = await assetApi.searchAssets(queryParams);
        if (data.results) {
          setOptions(data.results);
        } else {
          setOptions([]);
        }

        setSearching(false);
      } catch (e) {
        setSearching(false);
      }
    }
  };

  const onClear = () => {
    setSearching(false);
    setShowList(false);
  };

  const onSelectItem = (asset) => {
    setSearching(false);
    setShowList(false);

    onSelect(asset);
  };

  return (
    <div className={styles.container}>
      <Search
        placeholder={"Search file to choose for association"}
        onChange={search}
        onClear={onClear}
        onlyInput={true}
        styleType={styles["search-input"]}
        inputContainerStyle={styles["input-container"]}
      />

      {showList && (
        <div className={styles["search-results"]}>
          {searching && (
            <div className={styles["search-loading"]}>Searching ....</div>
          )}
          {!searching &&
            options.map(({ asset, thumbailUrl }, index) => {
              return (
                <div
                  className={styles["search-item"]}
                  key={index}
                  onClick={() => {
                    onSelectItem(asset);
                  }}
                >
                  <div className={styles["search-item-thumbnail"]}>
                    {thumbailUrl ? (
                      <AssetImg
                        assetImg={thumbailUrl}
                        type={asset.type}
                        name={asset.name}
                      />
                    ) : (
                      <AssetIcon
                        noMargin
                        extension={asset.extension}
                        onList={true}
                      />
                    )}
                  </div>
                  <div>{asset.name}</div>
                </div>
              );
            })}

          {!searching && options.length === 0 && (
            <div className={styles["search-loading"]}>No result</div>
          )}
        </div>
      )}
    </div>
  );
}
