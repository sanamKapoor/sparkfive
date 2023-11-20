import React, { useContext, useEffect, useState } from "react";

import { sideNavFirstList } from "../../constants/firstList-sidenav";
import { AssetContext, FilterContext } from "../../context";
import assetApi from "../../server-api/asset";
import { getAssetsFilters, getAssetsSort } from "../../utils/asset";
import styles from "./nested-sidenav-firstlist.module.css";

const NestedFirstlist = ({
  headingClick,
}: {
  headingClick?: (name, description) => void;
}) => {
  const { activeFolder, nextPage, addedIds } = useContext(AssetContext);

  const { activeSortFilter, searchFilterParams, term } =
    useContext(FilterContext);

  const [listingData, setListingData] = useState({
    image: "",
    allAsset: "",
    video: "",
  });

  const getAssets = async (replace = true) => {
    try {
      //TODO: confirm if activeFolder is not required here
      const { data } = await assetApi.getAssetsCountDropdown({
        ...getAssetsFilters({
          replace,
          // activeFolder,
          addedIds,
          nextPage,
          userFilterObject: activeSortFilter,
        }),
        term,
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

  useEffect(() => {
    getAssets(true);
  }, []);

  return (
    <div className={styles["sidenav-list1"]}>
      <ul>
        {sideNavFirstList.map((item, index) => (
          <li
            onClick={() => headingClick(item.name, item.description)}
            className={`${styles["list1-description"]} ${
              styles["border-bottom"]
            }  ${
              activeSortFilter?.mainFilter === item.name ? styles["active"] : ""
            }`}
            key={index}
          >
            <div className={styles["list1-left-contents"]}>
              <div className={styles.icon}>
                <img src={item.icon} alt={item.description} />
              </div>
              <div className={styles["icon-description"]}>
                <span title={item.toString()}>{item.description}</span>
              </div>
            </div>
            <div className={styles["list1-right-contents"]}>
              <span>{listingData[item.countValue] || ""}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(NestedFirstlist);
