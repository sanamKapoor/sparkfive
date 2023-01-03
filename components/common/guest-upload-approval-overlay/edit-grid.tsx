import { useState } from "react";
import ReactTooltip from "react-tooltip";

import styles from "./edit-grid.module.css";
import { Utilities } from "../../../assets";


// Components
import AssetImg from "../asset/asset-img";
import AssetVideo from "../asset/asset-video";
import AssetApplication from "../asset/asset-application";
import AssetText from "../asset/asset-text";
import IconClickable from "../buttons/icon-clickable";
import ImagePreviewModal from "../modals/image-preview-modal";


import AssetIcon from "../../common/asset/asset-icon";

const getStatusClass = (status: string) => {
  switch (status) {
    case "approved": {
      return "green";
    }

    case "pending": {
      return "yellow";
    }

    case "rejected": {
      return "red";
    }
  }
};

const EditGrid = ({ assets, toggleSelectedEdit }) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState({ asset: {}});

  const showPreviewImage = (asset) => {
    setPreviewAsset(asset);
    setPreviewModalOpen(true);
  };

  return (
    <div className={styles["list-wrapper"]}>
      <ul className={`${styles["grid-list"]}`}>
        {assets.map(
          (item, index) => {
            const {  asset, thumbailUrl, realUrl, isEditSelected } = item
            return (
            <li key={asset.id || index}>
              <>
                <div className={`${styles.container}`}>
                  <div className={styles["image-wrapper"]}>
                    {asset.type === "image" && (
                      <AssetImg
                        assetImg={thumbailUrl}
                        type={asset.type}
                        name={asset.name}
                        onClick={() => {
                          showPreviewImage(item);
                        }}
                      />
                    )}
                    {asset.type === "video" && (
                      <AssetVideo
                        asset={asset}
                        realUrl={realUrl}
                        additionalClass={styles["video-wrapper"]}
                        bulkSize={true}
                        onClick={() => {
                          showPreviewImage(item);
                        }}
                      />
                    )}
                    {asset.type !== "image" &&
                      asset.type !== "video" &&
                      thumbailUrl && (
                        <AssetImg
                          assetImg={thumbailUrl}
                          type={asset.type}
                          name={asset.name}
                          onClick={() => {
                            showPreviewImage(item);
                          }}
                        />
                      )}
                    {asset.type !== "image" &&
                      asset.type !== "video" &&
                      !thumbailUrl && (
                        <AssetIcon padding extension={asset.extension} onClick={() => {
                          showPreviewImage(item);
                        }}/>
                      )}

                    {/* {asset.type === 'application' && <AssetApplication
                    extension={asset.extension}
                    bulkSize={true}
                    onClick={()=>{showPreviewImage(realUrl)}}
                />}
                {asset.type === 'text' && <AssetText
                    extension={asset.extension}
                    bulkSize={true}
                    onClick={()=>{showPreviewImage(realUrl)}}
              /> */}
                    <>
                      <div
                        id={`button-${index}`}
                        className={`${styles["selectable-wrapper"]} ${
                          isEditSelected && styles["selected-wrapper"]
                        }`}
                        onClick={() => toggleSelectedEdit(asset.id)}
                      >
                        <IconClickable
                          src={
                            isEditSelected
                              ? Utilities.radioButtonEnabled
                              : Utilities.radioButtonNormal
                          }
                          additionalClass={styles["select-icon"]}
                        />
                      </div>
                    </>
                  </div>
                </div>
                <div
                  data-tip
                  data-for={`asset-${asset.id}`}
                  className={styles["text-wrapper"]}
                >
                  {asset.name}
                </div>
                <div
                  className={`${styles["status-text"]} ${
                    styles[getStatusClass(asset.status)]
                  }`}
                >
                  {asset.status}
                </div>
                <ReactTooltip
                  id={`asset-${asset.id}`}
                  delayShow={300}
                  effect="solid"
                >
                  {asset.name}
                </ReactTooltip>
              </>
            </li>
          )}
        )}
      </ul>

      <ImagePreviewModal
        asset={previewAsset}
        modalIsOpen={previewModalOpen}
        closeModal={() => {
          setPreviewModalOpen(false);
        }}
      />
    </div>
  );
};

export default EditGrid;
