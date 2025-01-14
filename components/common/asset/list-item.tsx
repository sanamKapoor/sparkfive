import { format } from "date-fns";
import filesize from "filesize";
import update from "immutability-helper";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AssetOps, Utilities } from "../../../assets";
import { getParsedExtension, removeExtension } from "../../../utils/asset";
import gridStyles from "./asset-grid.module.css";
import styles from "./list-item.module.css";

// Components
import {
  ASSET_NAME_UPDATED,
  FAILED_TO_UPDATE_ASSET_NAME,
} from "../../../constants/messages";
import { AssetContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import toastUtils from "../../../utils/toast";
import IconClickable from "../buttons/icon-clickable";
import AssetIcon from "./asset-icon";
import AssetImg from "./asset-img";
import AssetOptions from "./asset-options";
import DetailOverlay from "./detail-overlay";

import RenameModal from "../../common/modals/rename-modal";

const DEFAULT_DETAIL_PROPS = { visible: false, side: "detail" };

const ListItem = ({
  sharePath,
  isShare,
  type,
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
  activeFolder = "",
  toggleSelected = () => {},
  openDeleteAsset = () => {},
  openMoveAsset = () => {},
  openShareAsset = () => {},
  openCopyAsset = () => {},
  openArchiveAsset = () => {},
  downloadAsset = () => {},
  openRemoveAsset = () => {},
  setCurrentSortAttribute = (attribute) => {},
  isNameEditable = false,
  focusedItem,
  setFocusedItem,
}) => {
  const dateFormat = "MMM do, yyyy";

  const [overlayProperties, setOverlayProperties] =
    useState(DEFAULT_DETAIL_PROPS);

  const isAssetACopy = asset.name.endsWith(" - COPY");
  const assetName = removeExtension(asset.name);

  const [fileName, setFileName] = useState(assetName);
  const [isEditing, setIsEditing] = useState(false);

  const [assetRenameModalOpen, setAssetRenameModalOpen] = useState(false);

  const { assets, setAssets } = useContext(AssetContext);

  useEffect(() => {
    setFileName(assetName);
  }, [assetName]);

  useEffect(() => {
    if (overlayProperties.visible) {
      document.body.classList.add("no-overflow");
    } else {
      document.body.classList.remove("no-overflow");
    }

    return () => document.body.classList.remove("no-overflow");
  }, [overlayProperties.visible]);

  const openComments = () => {
    setOverlayProperties({ visible: true, side: "comments" });
  };

  const getSortAttributeClassName = (attribute) =>
    sortAttribute.replace("-", "") === attribute && styles["active"];
  const setSortAttribute = (attribute) => {
    if (attribute === sortAttribute) {
      setCurrentSortAttribute("-" + attribute);
    } else {
      setCurrentSortAttribute(sortAttribute.startsWith("-") ? "" : attribute);
    }
  };
  const arrowIcon = sortAttribute.startsWith("-")
    ? Utilities.arrowUpGrey
    : Utilities.arrowGrey;

  const handleAssetNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const updateAssetNameOnBlur = async () => {
    setFocusedItem(null);
    setIsEditing(false);
    //fire api only if name is changed
    if (fileName && assetName !== fileName) {
      try {
        const data = await assetApi.updateAsset(asset.id, {
          updateData: {
            name: isAssetACopy
              ? fileName + "." + asset.extension + " - COPY"
              : fileName + "." + asset.extension,
          },
          associations: {},
        });

        if (data) {
          setAssets(
            assets.map((item) => {
              if (item.asset.id === data.data.id) {
                return {
                  ...item,
                  asset: { ...item.asset, name: data.data.name },
                };
              } else {
                return item;
              }
            })
          );
        }

        toastUtils.success(ASSET_NAME_UPDATED);
      } catch (e) {
        toastUtils.error(FAILED_TO_UPDATE_ASSET_NAME);
      }
    } else {
      setFileName(assetName);
    }
  };

  const handleOnFocus = () => {
    setIsEditing(true);
  };

  const handleClick = () => {
    setOverlayProperties({
      ...DEFAULT_DETAIL_PROPS,
      visible: !overlayProperties.visible,
    });
  };

  const confirmAssetRename = async (newValue) => {
    try {
      const activeAsset = assets.find((asst) => asst?.asset?.id === asset?.id);

      const editedName = `${newValue}.${activeAsset?.extension}`;
      await assetApi.updateAsset(asset?.id, {
        updateData: { name: editedName },
      });
      const modAssetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === asset?.id
      );
      setAssets(
        update(assets, {
          [modAssetIndex]: {
            asset: {
              name: { $set: editedName },
            },
          },
        })
      );
      toastUtils.success("Asset name updated");
    } catch (err) {
      toastUtils.error("Could not update asset name");
    }
  };

  return (
    <>
      <div className={styles.list}>
        {index === 0 && (
          <div className={styles.header}>
            <div className={styles["headers-content"]}>
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
              <h4
                className={styles.size}
                onClick={() => setSortAttribute("asset.size")}
              >
                Size
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.size")}`}
                />
              </h4>
              <h4
                className={styles["date-created"]}
                onClick={() => setSortAttribute("asset.created-at")}
              >
                Uploaded Date
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.created-at")}`}
                />
              </h4>
              <h4
                className={styles["date-modified"]}
                onClick={() => setSortAttribute("asset.created-at")}
              >
                Date Modified
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.created-at")}`}
                />
              </h4>

              <h4
                className={styles.extension}
                onClick={() => setSortAttribute("asset.extension")}
              >
                Extension
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${
                    styles["sort-icon"]
                  } ${getSortAttributeClassName("asset.extension")}`}
                />
              </h4>

              <h4 className={styles.dimension}>Dimensions</h4>
            </div>
          </div>
        )}
        <div
          className={`${styles.item} ${
            isSelected ? styles["item--selected"] : ""
          }`}
          onClick={toggleSelected}
        >
          <div className={styles.photo}>
            <div
              style={{ display: "none" }}
              className={`${styles["selectable-wrapper"]} ${
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
            <div
              className={
                isNameEditable
                  ? `${styles.thumbnail} ${
                      isLoading && "loadable"
                    } cursor: pointer`
                  : `${styles.thumbnail} ${isLoading && "loadable"}`
              }
              onClick={isNameEditable ? handleClick : () => {}}
            >
              {thumbailUrl ? (
                <AssetImg
                  assetImg={thumbailUrl}
                  type={asset.type}
                  name={asset.name}
                />
              ) : (
                <AssetIcon extension={asset.extension} onList={true} />
              )}
            </div>
            <div
              className={
                !isNameEditable
                  ? `${styles.name} ${isLoading && "loadable"}`
                  : `${styles.name} ${isLoading && "loadable"} cursor: default`
              }
              onClick={!isNameEditable ? handleClick : () => {}}
            >
              {isNameEditable &&
              isEditing &&
              focusedItem &&
              focusedItem === asset.id ? (
                <input
                  autoFocus
                  className={`normal-text ${gridStyles["editable-input"]} ${styles["wrap-text"]}`}
                  value={fileName}
                  onChange={handleAssetNameChange}
                  onBlur={updateAssetNameOnBlur}
                />
              ) : (
                <span
                  id="editable-preview"
                  className={`${gridStyles["editable-preview"]}`}
                  onClick={handleOnFocus}
                >
                  {fileName}.{asset.extension}
                  {isAssetACopy && ` - COPY`}
                </span>
              )}
            </div>
          </div>

          <div className={`${styles.field_name} ${styles.actions}`}>
            <img
              className={styles.edit}
              src={AssetOps.editGray}
              alt="edit"
              onClick={(e) => {
                e.stopPropagation();
                setAssetRenameModalOpen(true);
              }}
            />
            {!isLoading && !isUploading && (
              <div className={styles.options}>
                <AssetOptions
                  itemType={type}
                  asset={asset}
                  realUrl={realUrl}
                  thumbailUrl={thumbailUrl}
                  openArchiveAsset={openArchiveAsset}
                  openDeleteAsset={openDeleteAsset}
                  openMoveAsset={openMoveAsset}
                  isShare={isShare}
                  downloadAsset={downloadAsset}
                  openShareAsset={openShareAsset}
                  openCopyAsset={openCopyAsset}
                  openComments={openComments}
                  openRemoveAsset={openRemoveAsset}
                />
              </div>
            )}
          </div>
          <div className={`${styles.field_name} ${styles.size}`}>
            {parseInt(asset.size) !== 0 && asset.size && filesize(asset.size)}
          </div>
          <div
            className={`${styles.field_name} ${isLoading && "loadable"} ${
              styles["date-created"]
            }`}
          >
            {format(new Date(asset.createdAt), dateFormat)}
          </div>
          <div
            className={`${styles.field_name} ${isLoading && "loadable"} ${
              styles["date-modified"]
            }`}
          >
            {format(new Date(asset.createdAt), dateFormat)}
          </div>

          <div className={`${styles.field_name} ${styles.extension}`}>
            {!isLoading && getParsedExtension(asset.extension)}
          </div>

          <div className={`${styles.field_name} ${styles.dimension}`}>
            {asset?.dimensionWidth &&
              asset?.dimensionWidth &&
              `${asset?.dimensionWidth}x${asset?.dimensionHeight}`}
          </div>
        </div>
      </div>
      {overlayProperties.visible && (
        <DetailOverlay
          sharePath={sharePath}
          isShare={isShare}
          asset={asset}
          realUrl={
            asset.extension === "tiff" || asset.extension === "tif"
              ? thumbailUrl
              : realUrl
          }
          thumbailUrl={thumbailUrl}
          activeFolder={activeFolder}
          initialParams={overlayProperties}
          openShareAsset={openShareAsset}
          openDeleteAsset={openDeleteAsset}
          closeOverlay={() =>
            setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: false })
          }
        />
      )}

      <RenameModal
        closeModal={() => setAssetRenameModalOpen(false)}
        modalIsOpen={assetRenameModalOpen}
        renameConfirm={confirmAssetRename}
        type={"Asset"}
        initialValue={assetName}
      />
    </>
  );
};

export default ListItem;
