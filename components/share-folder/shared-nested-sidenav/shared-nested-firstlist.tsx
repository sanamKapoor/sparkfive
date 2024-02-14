import React, { useContext, useEffect, useMemo, useState } from 'react';

import { sideNavFirstList } from '../../../constants/firstList-sidenav';
import { FilterContext, UserContext } from '../../../context';
import shareCollectionApi from '../../../server-api/share-collection';
import styles from './shared-nested-firstlist.module.css';

const NestedFirstlist = ({
    sharePath
}: {
    sharePath: string
}) => {
    const { activeSortFilter } =
        useContext(FilterContext);
    const { advancedConfig } = useContext(UserContext) as any;
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
            let totalAssetCount = 0
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
        return tabs
    }, [hideFilterElements]);

    useEffect(() => {
        getAssets();
    }, []);

    return (
        <div className={styles["sidenav-list1"]}>
            <ul>
                {setTabsVisibility.map((item, index) => (
                    <li
                        className={`${styles["list1-description"]} ${styles["border-bottom"]
                            }  ${activeSortFilter?.mainFilter === item.name ? styles["active"] : ""
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
