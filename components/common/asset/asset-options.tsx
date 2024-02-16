import { Utilities } from "../../../assets";
import styles from "./asset-options.module.css";

import { ASSET_DOWNLOAD, ASSET_EDIT } from "../../../constants/permissions";

// Components
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

import { useContext } from "react";
import { UserContext } from "../../../context";
import React from "react";

import { events, shareLinkEvents } from '../../../constants/analytics';
import useAnalytics from '../../../hooks/useAnalytics'
import cookiesApi from "../../../utils/cookies";

const AssetOptions = ({
  itemType = "",
  asset,
  realUrl,
  thumbailUrl,
  downloadAsset,
  openMoveAsset,
  openCopyAsset,
  openArchiveAsset,
  openDeleteAsset,
  openShareAsset,
  openComments,
  openRemoveAsset,
  dissociateAsset,
  activeView,
  isShare = false,
  isAssetRelated = false,
  renameAsset
}) => {

  const { hasPermission, user } = useContext(UserContext);

  const isAdmin = () => {
    return user?.role?.id === "admin" || user?.role?.id === "super_admin";
  };

  const { trackEvent, trackLinkEvent } = useAnalytics();

  const options = [
    {
      label: "Download",
      onClick: () => {
        if(isShare){
          trackLinkEvent(
            shareLinkEvents.DOWNLOAD_SHARED_ASSET,
            {
              email: cookiesApi.get('shared_email') || null,
              teamId: cookiesApi.get('teamId') || null,
              assetId: asset.id,
            });
        } else {
          trackEvent(events.DOWNLOAD_ASSET, {
            assetId: asset.id,
          });
        }
        downloadAsset();
      },
      permissions: [ASSET_DOWNLOAD],
    },
    {
      label: "Share",
      onClick: () => {
        trackEvent(events.SHARE_ASSET, {
          assetId: asset.id,
        });
        openShareAsset();
      },
    },
  ];

  const assetRelatedOptions: any = [
    {
      label: "Download",
      onClick: downloadAsset,
      permissions: [ASSET_DOWNLOAD],
    },
  ];

  if (isAdmin()) {
    assetRelatedOptions.push({
      label: "Disassociate",
      onClick: dissociateAsset,
    });
  }

  if (hasPermission([ASSET_EDIT])) {
    assetRelatedOptions.push({ label: "Delete", onClick: openDeleteAsset });
    options.push({ label: "Comment", onClick: openComments });
    options.push({ label: "Copy", onClick: openCopyAsset });
    options.push({ label: "Rename Asset", onClick: renameAsset });
    options.push({ label: "Add to", onClick: openMoveAsset });
    options.push({
      label: asset.stage !== "archived" ? "Archive" : "Unarchive",
      onClick: openArchiveAsset,
    });
    options.push({ label: "Delete", onClick: openDeleteAsset });
  }

  if (itemType) {
    options.push({ label: "Remove", onClick: openRemoveAsset });
  }
  // if (itemType) {
  //   options.push({ label: "Remove", onClick: openRemoveAsset });
  // }

  return (
    <ToggleableAbsoluteWrapper
      contentClass={styles["asset-actions"]}
      wrapperClass={`${activeView === "list" ? styles["list-actions-wrapper"] : styles["asset-actions-wrapper"]
        }`}
      Wrapper={({ children }) => (

        <>
          <IconClickable data-drag="false" SVGElement={Utilities.more} additionalClass={styles.thumbnailDots} />
          {children}
        </>
      )}
      Content={() => (
        <div className={styles.more}>
          <Dropdown
            options={
              isShare
                ? [{ label: "Download", onClick: downloadAsset }]
                : isAssetRelated
                  ? assetRelatedOptions
                  : options
            }
          />
        </div>
      )}
    />
  );
};

export default AssetOptions;
