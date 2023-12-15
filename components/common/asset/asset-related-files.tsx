import update from "immutability-helper";
import fileDownload from "js-file-download";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "react-sweet-progress/lib/style.css";
import ReactTooltip from "react-tooltip";
import { AssetOps, Utilities } from "../../../assets";
import { AssetContext, LoadingContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import downloadUtils from "../../../utils/download";
import toastUtils from "../../../utils/toast";
import Button from "../buttons/button";
import BaseModal from "../modals/base";
import ConfirmModal from "../modals/confirm-modal";
import styles from "./asset-related-files.module.css";
import AssetThumbail from "./asset-thumbail";

import IconClickable from "../buttons/icon-clickable";
import AssetRelatedFileUpload from "./asset-related-files-upload";
import React from "react";

const NextArrow = ({ onClick }) => (
  <img
    className={styles.arrow}
    src={Utilities.circleArrowRight}
    alt="Arrow next"
    onClick={onClick}
  />
);

const PrevArrow = ({ onClick }) => (
  <img
    className={styles.arrow}
    src={Utilities.circleArrowLeft}
    alt="Arrow previous"
    onClick={onClick}
  />
);

const AssetRelatedFIles = ({
  assets,
  associateFileId,
  onChangeRelatedFiles,
  onAddRelatedFiles,
  closeOverlay,
  outsideDetailOverlay = false,
}) => {
  const {
    updateDownloadingStatus,
    setActiveOperation,
    setOperationAssets,
    setDetailOverlayId,
  } = useContext(AssetContext);

  const { setIsLoading } = useContext(LoadingContext);

  const [activeAssetId, setActiveAssetId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [disassociateModal, setDisassociateModal] = useState(false);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: false,
    variableWidth: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1445,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const downloadAsset = (assetItem) => {
    downloadUtils.downloadFile(assetItem.realUrl, assetItem.asset.name);
  };

  const openDeleteAsset = (id) => {
    setActiveAssetId(id);
    setDeleteModalOpen(true);
  };

  const openDisassociateModal = (id) => {
    setActiveAssetId(id);
    setDisassociateModal(true);
  };

  const deleteAsset = async (id) => {
    try {
      setIsLoading(true);

      await assetApi.updateAsset(id, {
        updateData: {
          status: "deleted",
          stage: "draft",
          deletedAt: new Date(new Date().toUTCString()).toISOString(),
        },
      });
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === id
      );
      if (assetIndex !== -1)
        onChangeRelatedFiles(
          update(assets, {
            $splice: [[assetIndex, 1]],
          })
        );

      setIsLoading(false);
      toastUtils.success("Assets deleted successfully");
    } catch (err) {
      setIsLoading(false);
      // TODO: Error handling
      toastUtils.error("Could not delete assets, please try again later.");
    }
  };

  const disassociateAsset = async (id) => {
    try {
      setIsLoading(true);
      await assetApi.disassociate([associateFileId, id]);
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === id
      );
      if (assetIndex !== -1)
        onChangeRelatedFiles(
          update(assets, {
            $splice: [[assetIndex, 1]],
          })
        );

      setIsLoading(false);
      toastUtils.success("Assets disassociated successfully");
    } catch (err) {
      // TODO: Error handling
      setIsLoading(false);
      toastUtils.error(
        "Could not disassociate assets, please try again later."
      );
    }
  };

  const downloadAllRelatedAssets = async () => {
    try {
      let payload = {
        assetIds: [],
      };
      let totalDownloadingAssets = 0;
      let filters = {
        estimateTime: 1,
      };

      totalDownloadingAssets = assets.length;
      payload.assetIds = assets.map((assetItem) => assetItem.asset.id);

      // Show processing bar
      updateDownloadingStatus("zipping", 0, totalDownloadingAssets);
      let api = assetApi;

      const { data } = await api.downloadAll(payload, filters);
      // Download file to storage
      fileDownload(data, "assets.zip");

      updateDownloadingStatus("done", 0, 0);
    } catch (e) {
      console.error(e);
      updateDownloadingStatus(
        "error",
        0,
        0,
        "Internal Server Error. Please try again."
      );
    }
  };

  const shareAllRelatedAssets = () => {
    setActiveOperation("share");
  };

  useEffect(() => {
    setOperationAssets(assets);
  }, [assets]);

  return (
    <>
      <div className={styles.container}>
        <div
          data-tip
          data-for={"upload"}
          className={
            assets.length > 0
              ? styles["upload-wrapper"]
              : styles["upload-wrapper-no-asset"]
          }
        >
          {assets.length > 0 && <h3>Related Files</h3>}
          <IconClickable
            src={AssetOps.upload}
            onClick={() => setUploadModalOpen(true)}
          />
          <ReactTooltip
            id={"upload"}
            delayShow={300}
            effect="solid"
            place={"right"}
          >
            Upload related files
          </ReactTooltip>
        </div>

        <BaseModal
          showCancel={false}
          closeButtonOnly
          additionalClasses={[styles["modal-upload"]]}
          closeModal={() => setUploadModalOpen(false)}
          modalIsOpen={uploadModalOpen}
          confirmText=""
          confirmAction={() => {}}
        >
          <AssetRelatedFileUpload
            currentRelatedAssets={assets}
            associateFileId={associateFileId}
            onUploadFinish={onAddRelatedFiles}
          />
        </BaseModal>

        {assets.length > 0 && (
          <>
            <div className={styles.slider}>
              <Slider {...settings}>
                {assets.map((assetItem, index) => (
                  <div className={`${styles["grid-item-new"]}`}>
                      <AssetThumbail
                    {...assetItem}
                    key={index}
                    onView={(id) => {
                      setDetailOverlayId(undefined);
                      if (outsideDetailOverlay) {
                        closeOverlay(assetItem);
                      } else {
                        closeOverlay(null, assetItem);
                      }
                    }}
                    showAssetOption={false}
                    showViewButtonOnly={true}
                    showAssetRelatedOption={true}
                    downloadAsset={() => downloadAsset(assetItem)}
                    openDeleteAsset={() => openDeleteAsset(assetItem.asset.id)}
                    onDisassociate={() => {
                      openDisassociateModal(assetItem.asset.id);
                    }}
                    detailOverlay={false}
                  />

                  </div>
                
                ))}
              </Slider>
            </div>
            <div className={styles["buttons-wrapper"]}>
              <Button
                text="Download All Related Files"
                type="button"
                className="container secondary"
                onClick={downloadAllRelatedAssets}
              />
              <Button
                text="Share All Related Files"
                type="button"
                className="container primary"
                onClick={shareAllRelatedAssets}
              />
            </div>
          </>
        )}
      </div>

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

      {/* Associate modal */}
      <ConfirmModal
        closeModal={() => setDisassociateModal(false)}
        confirmAction={() => {
          disassociateAsset(activeAssetId);
          setActiveAssetId("");
          setDisassociateModal(false);
        }}
        confirmText={"Disassociate"}
        message={
          <div>
            Are you sure you want to <strong>Disassociate</strong> this asset?
          </div>
        }
        modalIsOpen={disassociateModal}
      />
    </>
  );
};

export default AssetRelatedFIles;
