//TODO: check from es-dev

import update from "immutability-helper";
import { useContext, useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import { AssetContext } from "../../../../context";
import assetsApi from "../../../../server-api/asset";
import toastUtils from "../../../../utils/toast";
import urlUtils from "../../../../utils/url";
import styles from "./deleted-assets.module.css";

// Components
import useSortedAssets from "../../../../hooks/use-sorted-assets";
import Button from "../../buttons/button";
import ConfirmModal from "../../modals/confirm-modal";
import DeletedListItem from "./deleted-list-item";

const DeletedAssets = ({ toggleSelected, loadMore = () => {} }) => {
  const { assets, setAssets, nextPage } = useContext(AssetContext);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recoverModalOpen, setRecoverModalOpen] = useState(false);
  const [activeAssetId, setActiveAssetId] = useState("");

  const [initAsset, setInitAsset] = useState(undefined);

  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] =
    useSortedAssets(assets, "-assets.deleted-at");

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

  const showLoadMore = assets.length > 0;
  const loadingAssetsFolders =
    assets.length > 0 && assets[assets.length - 1].isLoading;

  return (
    <section className={`${styles.container}`}>
      <ul className={styles["list-wrapper"]}>
        {sortedAssets.map((assetItem, index) => {
          return (
            <li
              className={styles["regular-item"]}
              key={assetItem.asset.id || index}
            >
              <DeletedListItem
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
    </section>
  );
};

export default DeletedAssets;
