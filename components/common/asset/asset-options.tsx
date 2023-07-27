import { Utilities } from "../../../assets";
import styles from "./asset-options.module.css";

import { ASSET_DOWNLOAD } from "../../../constants/permissions";

// Components
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

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
  const options = [
    {
      label: "Download",
      onClick: downloadAsset,
      permissions: [ASSET_DOWNLOAD],
    },
    { label: "Comment", onClick: openComments },
    { label: "Add to", onClick: openMoveAsset },
    { label: "Copy", onClick: openCopyAsset },
    {
      label: asset.stage !== "archived" ? "Archive" : "Unarchive",
      onClick: openArchiveAsset,
    },
    { label: "Delete", onClick: openDeleteAsset },
    { label: "Share", onClick: openShareAsset },
  ];

  const assetRelatedOptions = [
    {
      label: "Download",
      onClick: downloadAsset,
      permissions: [ASSET_DOWNLOAD],
    },
    { label: "Disassociate", onClick: dissociateAsset },
    { label: "Delete", onClick: openDeleteAsset },
  ];

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
