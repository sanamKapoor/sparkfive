import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Utilities } from '../../assets';
import AssetIcon from '../common/asset/asset-icon';
import AssetImg from '../common/asset/asset-img';
import Button from '../common/buttons/button';
import IconClickable from '../common/buttons/icon-clickable';
import styles from './share-item.module.css';


import { events, shareLinkEvents } from '../../constants/analytics';
import useAnalytics from '../../hooks/useAnalytics'
import { UserContext } from "../../context";
import cookiesApi from "../../utils/cookies";

const ShareItem = ({
  asset,
  thumbailUrl,
  isSelected = false,
  toggleSelected = () => { },
  sharedCode = ""
}) => {
  const [visibleOverlay, setVisibleOVerlay] = useState(false);
  const router = useRouter();

  const { trackLinkEvent } = useAnalytics();

  useEffect(() => {
    if (visibleOverlay) {
      document.body.classList.add("no-overflow");
    } else {
      document.body.classList.remove("no-overflow");
    }
  }, [visibleOverlay]);


  const viewDetails = (value) => {
    setVisibleOVerlay(true)
    trackLinkEvent(shareLinkEvents.VIEW_SHARED_ASSET, {
      assetId: asset.id,
      email: cookiesApi.get('shared_email') || null,
      teamId: cookiesApi.get('teamId') || null,
    });
    router.push({
      pathname: `/share/assetDetail/${asset.id}`,
      query: { isShare: true, sharePath: "", sharedCode, headerName: "", activeFolder: "", availableNext: "", activeSubFolders: "" }
    });
  }

  return (
    <>
      <div
        className={`${styles.container} ${isSelected ? styles.selected : ""}`}
      >
        <div className={styles["image-wrapper"]}>
          {thumbailUrl ? (
            <AssetImg
              assetImg={thumbailUrl}
              type={asset?.type}
              name={asset?.name}
              opaque={false}
            />
          ) : (
            <AssetIcon extension={asset?.extension} />
          )}

          <div
            className={`${styles["selectable-wrapper"]} ${isSelected && styles["selected-wrapper"]
              }`}
          >
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
          </div>
          <div className={styles["image-button-wrapper"]}>
            <Button
              className={"container primary"}
              text={"View Details"}
              type={"button"}
              onClick={() => viewDetails(true)}
              data-drag="false"
            />
          </div>
        </div>
        <div className={styles.info}>
          <div className={`normal-text ${styles["text-wrap"]}`}>
            {asset.name}
          </div>
          <div className={styles["details-wrapper"]}>
            <div className="secondary-text">
              {format(new Date(asset.createdAt), "MMM d, yyyy, p")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareItem;

