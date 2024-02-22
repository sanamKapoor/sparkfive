import React, { useContext, useEffect, useMemo, useState } from "react";

import { sideNavFirstList } from "../../../constants/firstList-sidenav";
import { AssetContext, FilterContext, UserContext, ShareContext } from "../../../context";
import shareCollectionApi from "../../../server-api/share-collection";
import styles from "./shared-sidebar-firstlist.module.css";
import ReusableHeading from "../../nested-subcollection-sidenav/nested-heading";
import { Utilities } from "../../../assets";

const NestedFirstlist = ({ sharePath }: { sharePath: string }) => {
  const { activeSortFilter } = useContext(FilterContext);
  const { advancedConfig } = useContext(UserContext) as any;
  const { sidebarOpen, setSidebarOpen } = useContext(AssetContext)
  const { folderInfo } = useContext(ShareContext)
  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);
  const [listingData, setListingData] = useState({
    image: "",
    allAsset: "",
    video: "",
  });

  const getAssets = async () => {
    try {
      const assetCount = await shareCollectionApi.getAssetCount({ sharePath });
      const dataInfo = {
        image: (0).toString(),
        video: (0).toString(),
        allAsset: (0).toString(),
      };
      let totalAssetCount = 0;
      if (assetCount?.data?.assetCountByType) {
        for (const content of assetCount?.data.assetCountByType) {
          if (content.type === "image") {
            dataInfo.image = content.count.toString();
          }
          if (content.type === "video") {
            dataInfo.video = content.count.toString();
          }
          totalAssetCount += Number(content.count);
        }
      }
      dataInfo.allAsset = totalAssetCount.toString();
      setListingData(dataInfo); // Update the listingData with the received data
    } catch (err) {
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
    return tabs;
  }, [hideFilterElements]);

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <>
      <div data-drag="false" className={styles["shared-sidenav-list1"]}>
        <div style={{ padding: "12px 0 0 0" }}>
          <ReusableHeading
            data-drag="false"
            customStyle={{ padding: "padding: 10px 23px 0px;", cursor: "pointer" }}
            text={`${folderInfo?.companyName}`}
            icon={
              <img
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                }}
                src={Utilities.toggleLight}
              />
            }
          />
        </div>

        <div data-drag="false" className={styles["sidenav-list1"]}>
          <ul data-drag="false">
            {setTabsVisibility.map((item, index) => (
              <li
                data-drag="false"
                className={`${styles["list1-description"]} ${styles["border-bottom"]}  ${activeSortFilter?.mainFilter === item.name ? styles["active"] : ""
                  }`}
                key={index}
              >
                <div data-drag="false" className={styles["list1-left-contents"]}>
                  <div className={styles.icon}>
                    <img data-drag="false" src={item.icon} alt={item.description} />
                  </div>
                  <div className={styles["icon-description"]}>
                    <span data-drag="false" title={item.toString()}>{item.description}</span>
                  </div>
                </div>
                <div data-drag="false" className={styles["list1-right-contents"]}>
                  <span data-drag="false">{listingData[item.countValue] || ""}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default React.memo(NestedFirstlist);
