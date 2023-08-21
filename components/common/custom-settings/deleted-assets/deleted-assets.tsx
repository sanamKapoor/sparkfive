import update from "immutability-helper";
import { useContext, useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import { AssetContext } from "../../../../context";
import assetsApi from "../../../../server-api/asset";
import toastUtils from "../../../../utils/toast";
import urlUtils from "../../../../utils/url";
import styles from "./deleted-assets.module.css";

// Components
import { AssetOps } from "../../../../assets";
import useSortedAssets from "../../../../hooks/use-sorted-assets";
import selectOptions from "../../../../utils/select-options";
import DetailOverlay from "../../asset/detail-overlay";
import Button from "../../buttons/button";
import IconClickable from "../../buttons/icon-clickable";
import Select from "../../inputs/select";
import ConfirmModal from "../../modals/confirm-modal";
import DeletedListItem from "./deleted-list-item";

const DeletedAssets = ({
  activeView = "grid",
  isShare = false,
  onFilesDataGet = (files) => {},
  toggleSelected,
  mode = "assets",
  activeSortFilter,
  setActiveSortFilter,
  deleteFolder = (id) => {},
  itemSize = "regular",
  activeFolder = "",
  type = "",
  itemId = "",
  getFolders = () => {},
  loadMore = () => {},
  viewFolder = (id) => {},
  sharePath = "",
  openFilter,
}) => {
  const {
    assets,
    setAssets,
    setActiveOperation,
    setOperationAsset,
    nextPage,
    setOperationFolder,
    folders,
    selectAllAssets,
  } = useContext(AssetContext);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recoverModalOpen, setRecoverModalOpen] = useState(false);
  const [activeAssetId, setActiveAssetId] = useState("");

  const [initAsset, setInitAsset] = useState(undefined);

  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] =
    useSortedAssets(assets, "-asset.deleted-at");

  useEffect(() => {
    const { assetId } = urlUtils.getQueryParameters();
    if (assetId) getInitialAsset(assetId);
  }, []);

  const getInitialAsset = async (id) => {
    try {
      const { data } = await assetsApi.getById(id);
      setInitAsset(data);
    } catch (err) {
      console.log(err);
    }
  };

  const openDeleteAsset = (id) => {
    setActiveAssetId(id);
    setDeleteModalOpen(true);
  };

  const openRecoverAsset = (id) => {
    setActiveAssetId(id);
    setRecoverModalOpen(true);
  };

  const deleteAsset = async (id) => {
    try {
      await assetsApi.deleteAsset(id);
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === id
      );
      setAssets(
        update(assets, {
          $splice: [[assetIndex, 1]],
        })
      );
      toastUtils.success("Assets deleted successfully");
    } catch (err) {
      // TODO: Error handling
      toastUtils.error("Could not delete assets, please try again later.");
    }
  };

  const recoverAsset = async (id) => {
    try {
      await assetsApi.updateAsset(id, {
        updateData: { status: "approved", deletedAt: null },
      });
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === id
      );
      if (assetIndex !== -1)
        setAssets(
          update(assets, {
            $splice: [[assetIndex, 1]],
          })
        );
      toastUtils.success("Assets recover successfully");
    } catch (err) {
      // TODO: Error handling
      toastUtils.error("Could not recover assets, please try again later.");
    }
  };

  const beginAssetOperation = ({ asset = null, folder = null }, operation) => {
    if (asset) setOperationAsset(asset);
    if (folder) setOperationFolder(folder);
    setActiveOperation(operation);
  };

  const showLoadMore = assets.length > 0;
  const loadingAssetsFolders =
    assets.length > 0 && assets[assets.length - 1].isLoading;

  const selectAll = () => {
    selectAllAssets();
    setAssets(assets.map((assetItem) => ({ ...assetItem, isSelected: true })));
  };

  const setSortFilterValue = (key, value) => {
    let sort = key === "sort" ? value : activeSortFilter.sort;

    setActiveSortFilter({
      ...activeSortFilter,
      [key]: value,
      sort,
    });
  };

  console.log("activeSortFilter ", activeSortFilter);
  return (
    <section className={`${styles.container} ${openFilter && styles.filter}`}>
      <div className={styles.header}>
        <h3>Deleted Assets</h3>
        <p>
          Deleted assets are retained for 60 days before permanent removal.
          Admin can recover deleted assets within 60 days
        </p>
      </div>

      <div className={styles.header_actions}>
        <IconClickable
          src={AssetOps.moveGray}
          additionalClass={styles["action-recover"]}
        />
        <IconClickable
          src={AssetOps.deleteGray}
          additionalClass={styles["action-delete"]}
        />

        <Button
          text="Deselect All"
          type="button"
          onClick={() => alert("deselect all")}
        />
        <Button
          text="Select All"
          type="button"
          className="container secondary"
          onClick={selectAll}
        />
        <div className={styles.select}>
          <Select
            label={"Sort By"}
            options={selectOptions.sort}
            value={activeSortFilter.sort}
            styleType="filter filter-schedule"
            onChange={(selected) => setSortFilterValue("sort", selected)}
            placeholder="Sort By"
          />
        </div>
      </div>
      <ul className={styles["list-wrapper"]}>
        {sortedAssets.map((assetItem, index) => {
          return (
            <li
              className={styles["regular-item"]}
              key={assetItem.asset.id || index}
            >
              <DeletedListItem
                isShare={isShare}
                type={type}
                assetItem={assetItem}
                index={index}
                toggleSelected={() => toggleSelected(assetItem.asset.id)}
                openDeleteAsset={() => openDeleteAsset(assetItem.asset.id)}
                openRecoverAsset={() => openRecoverAsset(assetItem.asset.id)}
                setCurrentSortAttribute={setCurrentSortAttribute}
                sortAttribute={currentSortAttribute}
              />
            </li>
          );
        })}
      </ul>
      {showLoadMore && nextPage !== -1 && (
        <>
          {nextPage > 2 ? (
            <>
              {!loadingAssetsFolders && (
                <Waypoint onEnter={loadMore} fireOnRapidScroll={false} />
              )}
            </>
          ) : (
            <>
              {!loadingAssetsFolders && (
                <div className={styles["button-wrapper"]}>
                  <Button
                    text="Load More"
                    type="button"
                    className="container primary"
                    onClick={loadMore}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Delete modal */}
      <ConfirmModal
        closeModal={() => setDeleteModalOpen(false)}
        confirmAction={() => {
          deleteAsset(activeAssetId);
          setActiveAssetId("");
          setDeleteModalOpen(false);
        }}
        confirmText={"Delete"}
        message={
          <span>
            Are you sure you want to &nbsp;<strong>Delete</strong>&nbsp; this
            asset?
          </span>
        }
        modalIsOpen={deleteModalOpen}
      />

      <ConfirmModal
        closeModal={() => setRecoverModalOpen(false)}
        confirmAction={() => {
          recoverAsset(activeAssetId);
          setActiveAssetId("");
          setRecoverModalOpen(false);
        }}
        confirmText={"Recover"}
        message={
          <span>
            Are you sure you want to &nbsp;<strong>Recover</strong>&nbsp; this
            asset?
          </span>
        }
        modalIsOpen={recoverModalOpen}
      />

      {/* Overlay exclusive to page load assets */}
      {initAsset && (
        <DetailOverlay
          isShare={isShare}
          sharePath={sharePath}
          asset={initAsset.asset}
          realUrl={initAsset.realUrl}
          initialParams={{ side: "comments" }}
          openShareAsset={() =>
            beginAssetOperation({ asset: initAsset }, "share")
          }
          openDeleteAsset={() => openDeleteAsset(initAsset.asset.id)}
          closeOverlay={() => setInitAsset(undefined)}
          thumbailUrl={undefined}
        />
      )}
    </section>
  );
};

export default DeletedAssets;
