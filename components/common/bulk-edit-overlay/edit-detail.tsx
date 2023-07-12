import { useContext, useEffect, useState } from "react";
import styles from "./edit-detail.module.css";
import { Utilities } from "../../../assets";

import IconClickable from "../buttons/icon-clickable";
import AssetImg from "../asset/asset-img";
import assetApi from "../../../server-api/asset";
import tagApi from "../../../server-api/tag";
import projectApi from "../../../server-api/project";
import campaignApi from "../../../server-api/campaign";
import folderApi from "../../../server-api/folder";
import EditSidePanel from "./edit-side-panel";
import AssetPdf from "../asset/asset-pdf";
import AssetIcon from "../asset/asset-icon";

const EditDetail = ({
  onClose,
  currentIndex,
  setCurrentIndex,
  currentAsset: asset,
  totalLength,
  setCurrentAsset,
}) => {
  const [inputTags, setInputTags] = useState([]);
  const [inputFolders, setInputFolders] = useState([]);
  const [inputCustomFields, setInputCustomFields] = useState([]);

  const [inputCampaigns, setInputCampaigns] = useState([]);

  const [inputProjects, setInputProjects] = useState([]);


  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects();
      const campaignsResponse = await campaignApi.getCampaigns();
      const folderResponse = await folderApi.getFoldersSimple();
      const tagsResponse = await tagApi.getTags();
      const customFieldsResponse = await attributeApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputProjects(projectsResponse.data);
      setInputCampaigns(campaignsResponse.data);
      setInputFolders(folderResponse.data);
      setInputTags(tagsResponse.data);
      setInputCustomFields(customFieldsResponse.data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  useEffect(() => {
    getInputData();
  }, []);

  const handlePrevNav = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < 1 ? totalLength : prevIndex - 1
    );
  };

  const handleNextNav = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalLength ? 1 : prevIndex + 1
    );
  };


  const updateAsset = async (inputData) => {
    try {
      // Optimistic data set
      //   setCurrentAsset({
      //     ...assetDetail,
      //     ...inputData.updateData,
      //   });
      const { data } = await assetApi.updateAsset(asset?.asset?.id, inputData);
      //   setAssetDetail(data);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.name}>{asset?.asset.fileName}</div>
        <div className={styles["image-wrapper"]}>
          {asset?.asset.type === "image" && (
            <AssetImg
              imgClass="img-preview"
              name={asset?.asset.name}
              assetImg={
                asset?.asset.extension === "tiff" ||
                asset?.asset.extension === "tif" ||
                asset?.asset.extension === "svg" ||
                asset?.asset.extension === "svg+xml" ||
                asset?.asset.extension === "heif" ||
                asset?.asset.extension === "heic" ||
                asset?.asset.extension === "cr2" ||
                asset?.asset.extension === "ai"
                  ? asset?.thumbailUrl
                  : asset?.realUrl
              }
            />
          )}
          {asset?.asset.type !== "image" &&
            asset?.asset.type !== "video" &&
            asset?.thumbailUrl &&
            (asset?.asset.extension.toLowerCase() === "pdf" ? (
              <AssetPdf asset={asset?.asset} />
            ) : (
              <AssetImg
                name={asset?.asset.name}
                assetImg={asset?.thumbailUrl}
                imgClass="img-preview"
              />
            ))}
          {asset?.asset.type !== "image" &&
            asset?.asset.type !== "video" &&
            !asset?.thumbailUrl && (
              <AssetIcon extension={asset?.asset.extension} />
            )}
          {asset?.asset.type === "video" && (
            <video controls>
              <source
                src={asset?.previewUrl ?? asset?.realUrl}
                type={
                  asset?.previewUrl
                    ? "video/mp4"
                    : `video/${asset?.asset?.extension}`
                }
              />
              Sorry, your browser doesn't support video playback.
            </video>
          )}
        </div>
        <div className={styles.arrows}>
          <span>
            {(currentIndex % totalLength) + 1} of {totalLength}
          </span>
          <div>
            <span className={styles["arrow-prev"]}>
              <IconClickable
                src={Utilities.arrowPrev}
                onClick={handlePrevNav}
              />
            </span>
            <span className={styles["arrow-next"]}>
              <IconClickable
                src={Utilities.arrowNext}
                onClick={handleNextNav}
              />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.side}>
        <div className={styles.editClose}>
          <IconClickable src={Utilities.bigblueClose} onClick={onClose} />
        </div>
        <div className={styles["second-section"]}>
          <EditSidePanel
            asset={asset?.asset}
            updateAsset={updateAsset}
            setAssetDetail={(a) => {
              const updateCurrentAsset = Object.assign({}, {...asset, asset: a});
              setCurrentAsset(updateCurrentAsset)
            }}
            isShare={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EditDetail;
