import styles from "./list-item.module.css";
import { Utilities, Assets, AssetOps } from "../../../assets";
import gridStyles from "./asset-grid.module.css";
import filesize from "filesize";
import { format } from "date-fns";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import { getParsedExtension, removeExtension } from "../../../utils/asset";


// Components
import AssetImg from "./asset-img";
import IconClickable from "../buttons/icon-clickable";
import DetailOverlay from "./detail-overlay";
import AssetOptions from "./asset-options";
import AssetIcon from "./asset-icon";
import CollectionBadge from '../collection/collection-badge';
import React from 'react';
import assetApi from "../../../server-api/asset";
import toastUtils from "../../../utils/toast";
import {
  FAILED_TO_UPDATE_ASSET_NAME,
  ASSET_NAME_UPDATED,
} from "../../../constants/messages";
import { AssetContext } from "../../../context";

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
  const dateFormat = "MMM do, yyyy h:mm a";

  const [overlayProperties, setOverlayProperties] =
    useState(DEFAULT_DETAIL_PROPS);

  const assetName = removeExtension(asset.name);

  const [fileName, setFileName] = useState(assetName);
  const [isEditing, setIsEditing] = useState(false);

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
          updateData: { name: fileName + "." + asset.extension },
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
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("asset.name")}`}
                />
              </h4>
              {/*<h4>Stage</h4>*/}
              <h4></h4>
              <h4 className={styles.size} onClick={() => setSortAttribute("asset.size")}>
                Size
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("asset.size")}`}
                />
              </h4>
              <h4 className={styles["date-created"]} onClick={() => setSortAttribute("asset.created-at")}>
                Create Date
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("asset.created-at")}`}
                />
              </h4>
              <h4 className={styles["date-modified"]} onClick={() => setSortAttribute("asset.created-at")}>
                Date Modified
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("asset.created-at")}`}
                />
              </h4>

              <h4 className={styles.extension} onClick={() => setSortAttribute("asset.extension")}>
                Extension
                <IconClickable
                  src={arrowIcon}
                  additionalClass={`${styles["sort-icon"]
                    } ${getSortAttributeClassName("asset.extension")}`}
                />
              </h4>

              <h4 className={styles.dimension}>Dimensions</h4>
              
              <h4 className={styles.collection}>Collection</h4>

            </div>
          </div>
        )}
        <div className={`${styles.item} ${isSelected ? styles["item--selected"] : ""}`} onClick={toggleSelected}>
          <div className={styles.photo}>
            <div
              style={{ display: 'none' }}
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
              {/* {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />}
              {asset.type === 'video' &&
                <video preload='metadata'>
                  <source src={realUrl}
                    type={`video/${asset.extension}`} />
                </video>
              }
              {asset.type === 'application' && <AssetApplication extension={asset.extension} onList={true} />}
              {asset.type === 'text' && <AssetText extension={asset.extension} onList={true} />} */}
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
                </span>
              )}
            </div>
          </div>

            <div className={`${styles.field_name} ${styles.actions}`}>
              <img className={styles.edit} src={AssetOps.editGray} alt="edit" />
              {!isLoading && !isUploading && (
                <div className={styles.options}>
                  <AssetOptions
                    itemType={type}
                    asset={asset}
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
            <div className={`${styles.field_name} ${isLoading && "loadable"} ${styles["date-created"]}`}>
              {format(new Date(asset.createdAt), dateFormat)}
            </div>
            <div className={`${styles.field_name} ${isLoading && "loadable"} ${styles["date-modified"]}`}>
              {format(new Date(asset.createdAt), dateFormat)}
            </div>
            {/*<div className={styles.status}>*/}
            {/*  {isUploading && 'Uplaoding...'}*/}
            {/*  {!isLoading && !isUploading && <StatusBadge status={asset.stage} />}*/}
            {/*</div>*/}

            <div className={`${styles.field_name} ${styles.extension}`}>
              {!isLoading && getParsedExtension(asset.extension)}
            </div>

            <div className={`${styles.field_name} ${styles.dimension}`}>
              {asset?.dimensionWidth && asset?.dimensionWidth && `${asset?.dimensionWidth}x${asset?.dimensionHeight}`}
            </div>

            <div className={`${styles.field_name} ${styles.collection}`}>
              {asset?.folders.map(folder => <CollectionBadge collection={folder?.name} />)}
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
    </>
  );
};

export default ListItem;
