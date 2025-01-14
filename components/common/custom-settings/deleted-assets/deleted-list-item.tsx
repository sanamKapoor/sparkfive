import { format } from "date-fns";
import filesize from "filesize";
import { useEffect, useState } from "react";
import { AssetOps, Utilities } from "../../../../assets";
import { getParsedExtension } from "../../../../utils/asset";
import styles from "./deleted-list-item.module.css";

import { extensionToType } from "../../../../utils/deleted-assets";
import AssetImg from "../../asset/asset-img";
import IconClickable from "../../buttons/icon-clickable";

const DEFAULT_DETAIL_PROPS = { visible: false, side: "detail" };

const DeletedListItem = ({
  assetItem: {
    asset,
    thumbailUrl,
    realUrl,
    isUploading,
    isSelected = false,
    isLoading = false,
  },
  index,
  sortAttribute,
  toggleSelected = () => {},
  openDeleteAsset = () => {},
  openRecoverAsset = () => {},
  setCurrentSortAttribute = (attribute) => {},
}) => {
  const dateFormat = "MMM do, yyyy";

  const [overlayProperties] = useState(DEFAULT_DETAIL_PROPS);

  useEffect(() => {
    if (overlayProperties.visible) {
      document.body.classList.add("no-overflow");
    } else {
      document.body.classList.remove("no-overflow");
    }

    return () => document.body.classList.remove("no-overflow");
  }, [overlayProperties.visible]);

  const getSortAttributeClassName = (attribute) =>
    sortAttribute.replace("-", "") === attribute && styles["active"];
  const setSortAttribute = (attribute) => {
    if (attribute === sortAttribute) {
      setCurrentSortAttribute("-" + attribute);
    } else {
      setCurrentSortAttribute(
        sortAttribute.startsWith("-") ? attribute : "-" + attribute
      );
    }
  };
  const arrowIcon = sortAttribute.startsWith("-")
    ? Utilities.sort
    : Utilities.sortUp;

  return (
    <>
      <div className={styles.list}>
        {index === 0 && (
          <div className={styles.header}>
            <div className={styles["headers-content"]}>
              <h4></h4>
              <h4 onClick={() => setSortAttribute("asset.name")}>
                Name
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.name")}`}
                />
              </h4>
              <h4></h4>
              <h4 onClick={() => setSortAttribute("asset.deleted-at")}>
                Date Deleted
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.deleted-at")}`}
                />
              </h4>
              <h4 onClick={() => setSortAttribute("asset.size")}>
                Size
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.size")}`}
                />
              </h4>
              <h4 onClick={() => setSortAttribute("asset.extension")}>
                File Ext
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.extension")}`}
                />
              </h4>
              <h4>Dimensions</h4>
            </div>
          </div>
        )}
        <div className={`${styles.item} ${isSelected && styles.selected}`}>
          <div className={styles.info}>
            <div
              className={`${styles.cell} ${styles["selectable-wrapper"]} ${
                isSelected && styles["selected-wrapper"]
              }`}
            >
              {!isLoading && (
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
            </div>
            <div className={styles.cell}>
              <div className={styles.thumbnail_name}>
                <div
                  className={`${styles.thumbnail} ${isLoading && "loadable"}`}
                >
                  {thumbailUrl ? (
                    <AssetImg
                      assetImg={thumbailUrl}
                      type={asset.type}
                      isDeletedItem
                    />
                  ) : (
                    <img
                      className={styles.defaultIcon}
                      src={extensionToType(asset.extension, false)}
                    />
                  )}
                </div>
                <div
                  className={`${styles.name} ${styles.assetDesc} ${
                    isLoading && "loadable"
                  }`}
                >
                  {asset.name}
                </div>
              </div>
            </div>
            <div className={styles.cell}>
              {!isLoading && !isUploading && (
                <div className={styles.actions}>
                  <span className={styles.span}>
                    <IconClickable
                      additionalClass={styles["action-recover"]}
                      src={AssetOps.moveGray}
                      tooltipText={"Recover"}
                      tooltipId={"Recover"}
                      onClick={openRecoverAsset}
                    />
                  </span>
                  <span className={styles.span}>
                    <IconClickable
                      additionalClass={styles["action-delete"]}
                      src={AssetOps.deleteGray}
                      tooltipText={"Delete"}
                      tooltipId={"Delete"}
                      onClick={openDeleteAsset}
                    />
                  </span>
                </div>
              )}
            </div>
            <div className={styles.cell}>
              <div
                className={`${styles.field_name} ${styles.dateHide} ${
                  isLoading && "loadable"
                }`}
              >
                {asset?.deletedAt &&
                  format(new Date(asset.deletedAt), dateFormat)}
              </div>
            </div>
            <div className={styles.cell}>
              <div className={styles.field_name}>
                {asset.size && filesize(asset.size)}
              </div>
            </div>
            <div className={styles.cell}>
              <div className={styles.field_name}>
                {!isLoading && getParsedExtension(asset.extension)}
              </div>
            </div>
            <div className={styles.cell}>
              <div className={styles.field_name}>
                {asset.dimensionWidth &&
                  asset.dimensionHeight &&
                  `${asset.dimensionWidth} x ${asset.dimensionHeight}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletedListItem;
