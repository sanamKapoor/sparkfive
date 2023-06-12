import { useContext, useEffect, useState } from 'react'
import { AssetOps, Utilities } from '../../../assets'
import IconClickable from '../buttons/icon-clickable'
import Dropdown from '../inputs/dropdown'
import ToggleableAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'
import ConfirmModal from '../modals/confirm-modal'
import AssetAddition from './asset-addition'
import styles from './asset-related-files-list.module.css'
import { format } from 'date-fns'
import fileSize from 'filesize'
import AssetIcon from './asset-icon'
import { AssetContext, LoadingContext } from '../../../context'
import assetApi from "../../../server-api/asset"
import fileDownload from "js-file-download";
import downloadUtils from "../../../utils/download"
import update from 'immutability-helper';
import toastUtils from '../../../utils/toast'

const AssetRelatedFilesList = ({relatedAssets, associateFileId, onChangeRelatedFiles}) => {
    const {activeOperation, setActiveOperation, updateDownloadingStatus} = useContext(AssetContext);

    const { setIsLoading } = useContext(LoadingContext);

    const [activeAssetId, setActiveAssetId] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [disassociateModal, setDisassociateModal] = useState(false)

    const downloadAllRelatedAssets = async () => {
      try {
        let payload = {
          assetIds: [],
        };
        let totalDownloadingAssets = 0;
        let filters = {
          estimateTime: 1,
        };

        totalDownloadingAssets = relatedAssets.length;
        payload.assetIds = relatedAssets.map((assetItem) => assetItem.asset.id);

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

      // downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
    };

    const shareAllRelatedAssets = () => {
      setActiveOperation("share");
    };

      const downloadAsset = (assetItem) => {
        downloadUtils.downloadFile(assetItem.realUrl, assetItem.asset.name);
      };

      const openDisassociateModal = (id) => {
        setActiveAssetId(id);
        setDisassociateModal(true);
      };

      const openDeleteAsset = (id) => {
          setActiveAssetId(id);
          setDeleteModalOpen(true);
      };

          const disassociateAsset = async (id) => {
            try {
              setIsLoading(true);
              await assetApi.disassociate([associateFileId, id]);
              const assetIndex = relatedAssets.findIndex(
                (assetItem) => assetItem.asset.id === id
              );
              if (assetIndex !== -1)
                onChangeRelatedFiles(
                  update(relatedAssets, {
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


    const deleteAsset = async (id) => {
        try {
            setIsLoading(true)

            await assetApi.updateAsset(id, {
                updateData: {
                    status: "deleted",
                    stage: "draft",
                    deletedAt: new Date(new Date().toUTCString()).toISOString(),
                },
            })
            const assetIndex = relatedAssets.findIndex(
                (assetItem) => assetItem.asset.id === id
            )
            if (assetIndex !== -1)
                onChangeRelatedFiles(
                    update(relatedAssets, {
                        $splice: [[assetIndex, 1]],
                    })
                )

            setIsLoading(false)
            toastUtils.success("Assets deleted successfully")
        } catch (err) {
            setIsLoading(false)
            // TODO: Error handling
            toastUtils.error("Could not delete assets, please try again later.")
        }
    }


    return (
      <div className={styles.container}>
        <div className={styles.head}>
          <h2>Related Files</h2>
          <div className={styles.actions}>
            <IconClickable
              src={AssetOps.download}
              onClick={downloadAllRelatedAssets}
            />
            <IconClickable
              src={AssetOps.share}
              onClick={shareAllRelatedAssets}
            />
            <div className={styles.actionsPlus}>
              <AssetAddition />
            </div>
          </div>
        </div>

        {relatedAssets?.length > 0 ? (
          <ul>
            {relatedAssets?.map((asset, i) => (
              <li className={styles.item} key={i}>
                <div className={styles["item-wrapper"]}>
                  <div className={styles.thumbnail}>
                    {asset.thumbailUrl && (
                      <img
                        src={asset.thumbailUrl || Assets.unknown}
                        alt={name}
                      />
                    )}
                    {!asset.thumbailUrl && (
                      <AssetIcon
                        extension={asset?.asset?.extension}
                        onList={true}
                      />
                    )}
                  </div>
                  <div className={styles["info-wrapper"]}>
                    <div>
                      <div className={styles.name}>{asset?.asset?.name}</div>
                      <div className={styles.dimension}>
                        {" "}
                        {asset?.asset?.dimensionWidth &&
                          asset?.asset?.dimensionWidth &&
                          `${asset?.asset?.dimensionWidth} x ${asset?.asset?.dimensionHeight}`}
                      </div>
                      <div className={styles.info}>
                        {format(
                          new Date(asset?.asset?.createdAt),
                          "dd/MM/yyyy"
                        )}
                        <span></span>
                        {fileSize(asset?.asset?.size)}
                      </div>
                    </div>

                    <>
                      <ToggleableAbsoluteWrapper
                        contentClass={styles["item-actions"]}
                        wrapperClass={styles["item-actions-wrapper"]}
                        Wrapper={({ children }) => (
                          <>
                            <IconClickable src={Utilities.more} />
                            {children}
                          </>
                        )}
                        Content={() => (
                          <div className={styles.more}>
                            <Dropdown
                              options={[
                                {
                                  label: "Download",
                                  onClick: () => downloadAsset(asset),
                                },
                                {
                                  label: "Dissociate",
                                  onClick: () =>
                                    openDisassociateModal(asset?.asset?.id),
                                },
                                {
                                  label: "Delete",
                                  onClick: () =>
                                    openDeleteAsset(asset?.asset?.id),
                                },
                              ]}
                            />
                          </div>
                        )}
                      />

                      <ConfirmModal
                        closeModal={() => setDeleteModalOpen(false)}
                        confirmAction={() => {
                          deleteAsset(asset?.asset?.id);
                          setActiveAssetId("");
                          setDeleteModalOpen(false);
                        }}
                        confirmText={"Yes"}
                        message={<span>Are you sure you want to Delete?</span>}
                        modalIsOpen={deleteModalOpen}
                      />

                      <ConfirmModal
                        closeModal={() => setDisassociateModal(false)}
                        confirmAction={() => {
                          disassociateAsset(asset?.asset?.id);
                          setActiveAssetId("");
                          setDisassociateModal(false);
                        }}
                        confirmText={"Disassociate"}
                        message={
                          <div>
                            Are you sure you want to{" "}
                            <strong>Disassociate</strong> this asset?
                          </div>
                        }
                        modalIsOpen={disassociateModal}
                      />
                    </>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No related assets available</p>
        )}
      </div>
    );
}

export default AssetRelatedFilesList