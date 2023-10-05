import { format } from "date-fns";
import fileSize from "filesize";
import fileDownload from "js-file-download";
import { useContext, useState } from "react";
import { AssetOps, Utilities } from "../../../assets";
import { AssetContext, LoadingContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";
import ConfirmModal from "../modals/confirm-modal";
import AssetIcon from "./asset-icon";
import styles from "./asset-related-files-list.module.css";

const AssetRelatedFilesList = ({
  currentAsset,
  relatedAssets,
  associateFileId,
  onChangeRelatedFiles,
  onAddRelatedFiles,
}) => {
  const {
    setActiveOperation,
    updateDownloadingStatus,
  } = useContext(AssetContext);

  const { setIsLoading } = useContext(LoadingContext);

  const [activeAssetId, setActiveAssetId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [disassociateModal, setDisassociateModal] = useState(false);

  const downloadAllRelatedAssets = async () => {
    try {
      let payload = {
        assetIds: [],
      };
      let totalDownloadingAssets = 0;
      let filters = {
        estimateTime: 1,
      };

      totalDownloadingAssets = relatedAssets.length + 1;
      payload.assetIds = relatedAssets.map((assetItem) => assetItem.asset.id);

      payload.assetIds.push(associateFileId);
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

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h2>Related Files</h2>
        <div className={styles.actions}>
          <IconClickable
            src={AssetOps.download}
            onClick={downloadAllRelatedAssets}
          />
          <IconClickable src={AssetOps.share} onClick={shareAllRelatedAssets} />
          <div className={styles.actionsPlus}>
            <AssetAddition />
          </div>
        </div>
      </div>

      <ul>
        {relatedAssets?.map((asset, i) => (
          <li className={styles.item} key={i}>
            <div className={styles["item-wrapper"]}>
              <div className={styles.thumbnail}>
                {asset.thumbailUrl && (
                  <img src={asset.thumbailUrl || Assets.unknown} alt={name} />
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
                    {format(new Date(asset?.asset?.createdAt), "dd/mm/yyyy")}
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
                        <Dropdown options={options} />
                      </div>
                    )}
                  />

                  <ConfirmModal
                    closeModal={() => setDeleteModalOpen(false)}
                    confirmAction={() => alert("confirm")}
                    confirmText={"Yes"}
                    message={<span>Are you sure you want to Delete?</span>}
                    modalIsOpen={deleteModaOpen}
                  />
                </>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetRelatedFilesList;
