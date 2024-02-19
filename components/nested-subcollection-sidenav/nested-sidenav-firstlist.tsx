import React, { useContext, useEffect, useMemo, useState } from "react";

import { sideNavFirstList } from "../../constants/firstList-sidenav";
import { AssetContext, FilterContext, UserContext } from "../../context";
import assetApi from "../../server-api/asset";
import { getAssetsFilters, getAssetsSort } from "../../utils/asset";
import styles from "./nested-sidenav-firstlist.module.css";

const NestedFirstlist = ({
  headingClick,
}: {
  headingClick?: (name, description) => void;
}) => {
  const { nextPage, addedIds, listUpdateFlag } = useContext(AssetContext);

  const { activeSortFilter, searchFilterParams, term } =
    useContext(FilterContext);
  const { advancedConfig } = useContext(UserContext) as any;

  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);

  const [listingData, setListingData] = useState({
    image: "",
    allAsset: "",
    video: "",
  });

  const getAssets = async (replace = true) => {
    try {
      const filters: { type?: string, [key: string]: any } = getAssetsFilters({
        replace,
        // activeFolder,
        addedIds,
        nextPage,
        userFilterObject: activeSortFilter,
      });
      if (filters && filters.type) {
        delete filters.type;
      }

      //TODO: confirm if activeFolder is not required here
      const { data } = await assetApi.getAssetsCountDropdown({
        ...filters,
        // term,
        ...searchFilterParams,
        ...getAssetsSort(activeSortFilter),
      });

      const dataInfo = {
        image: (0).toString(),
        video: (0).toString(),
        allAsset: data?.total.toString() || (0).toString(),
      };

      if (data?.assetsListingCount) {
        for (const content of data.assetsListingCount) {
          if (content.key === "image") {
            dataInfo.image = content.doc_count.toString();
          }
          if (content.key === "video") {
            dataInfo.video = content.doc_count.toString();
          }
        }
      }
      setListingData(dataInfo); // Update the listingData with the received data
    } catch (err) {
      // TODO: Handle error
      console.log(err);
    }
  };

  const setTabsVisibility = useMemo(() => {
    const filterElements = hideFilterElements;
    const tabs = sideNavFirstList.filter((tab) => {
      let tabName = tab.hiddenKeyName.toLowerCase();
      let shouldShow = true;
      if (filterElements && filterElements.hasOwnProperty(tabName)) {
        shouldShow = !filterElements[tabName];
      }
      return shouldShow;
    });
    return tabs
  }, [hideFilterElements]);

  useEffect(() => {
    getAssets(true);
  }, []);

  useEffect(() => {
    listUpdateFlag ? getAssets(true) : null;
  }, [listUpdateFlag]);

  return (
    <div data-drag="false" className={styles["sidenav-list1"]}>
      <ul data-drag="false">
        {setTabsVisibility.map((item, index) => (
          <li
          data-drag="false"
            onClick={() => headingClick(item.name, item.description)}
            className={`${styles["list1-description"]} ${styles["border-bottom"]
              }  ${activeSortFilter?.mainFilter === item.name ? styles["active"] : ""
              }`}
            key={index}
          >
            <div data-drag="false" className={styles["list1-left-contents"]}>
              <div data-drag="false" className={styles.icon}>
                <img data-drag="false" src={item.icon} alt={item.description} />
              </div>
              <div data-drag="false" className={styles["icon-description"]}>
                <span data-drag="false" title={item.toString()}>{item.description}</span>
              </div>
            </div>
            <div className={styles["list1-right-contents"]}>
              <span data-drag="false">{listingData[item.countValue] || ""}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(NestedFirstlist);
