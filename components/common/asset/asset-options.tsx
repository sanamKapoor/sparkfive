import { Utilities } from "../../../assets";
import styles from "./asset-options.module.css";

import { ASSET_DOWNLOAD, ASSET_EDIT } from "../../../constants/permissions";

// Components
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

import { useContext } from "react";
import { UserContext } from "../../../context";

const AssetOptions = ({
  itemType = "",
  asset,
  downloadAsset,
  openMoveAsset,
  openCopyAsset,
  openArchiveAsset,
  openDeleteAsset,
  openShareAsset,
  openComments,
  openRemoveAsset,
  dissociateAsset,
  isShare = false,
  isAssetRelated = false,
}) => {
  const { hasPermission, user } = useContext(UserContext);

  const isAdmin = () => {
    return user?.role?.id === "admin" || user?.role?.id === "super_admin";
  };

  const options = [
    {
      label: "Download",
      onClick: downloadAsset,
      permissions: [ASSET_DOWNLOAD],
    },
    { label: "Share", onClick: openShareAsset },
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
    options.push({ label: "Add to", onClick: openMoveAsset });
    options.push({ label: "Copy", onClick: openCopyAsset });
    options.push({
      label: asset.stage !== "archived" ? "Archive" : "Unarchive",
      onClick: openArchiveAsset,
    });
    options.push({ label: "Delete", onClick: openDeleteAsset });
  }

  if (itemType) {
    options.push({ label: "Remove", onClick: openRemoveAsset });
  }
  if (itemType) {
    options.push({ label: "Remove", onClick: openRemoveAsset });
  }

  return (
    <ToggleableAbsoluteWrapper
      contentClass={styles["asset-actions"]}
      wrapperClass={styles["asset-actions-wrapper"]}
      Wrapper={({ children }) => (
        <>
          <IconClickable
            src={Utilities.more}
            additionalClass={styles.thumbnailDots}
          />
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
