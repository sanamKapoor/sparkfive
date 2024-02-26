import styles from "./image-preview-modal.module.css";

// Components
import AssetIcon from "../asset/asset-icon";
import AssetImg from "../asset/asset-img";
import AssetPdf from "../asset/asset-pdf";
import Base from "./base";

const ImagePreviewModal = ({ modalIsOpen, closeModal, asset }) => {
  const {
    asset: { type, name, extension },
    realUrl,
    thumbailUrl,
  } = asset;

  return (
    <Base
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      headText={``}
      confirmAction={async () => {
        closeModal();
      }}
    >
      <div className={styles["modal-wrapper"]}>
        <div className={`${styles.text} ${styles["close-modal-btn"]}`}>
          <p></p>
          <span
            className={`${styles.close} ${styles["confirm-modal-text"]}`}
            onClick={closeModal}
          >
            x
          </span>
        </div>

        {type === "image" && (
          <AssetImg
            imgClass="img-preview"
            name={name}
            assetImg={
              extension === "tiff" ||
              extension === "tif" ||
              extension === "svg" ||
              extension === "svg+xml"
                ? thumbailUrl
                : realUrl
            }
          />
        )}

        {type !== "image" &&
          type !== "video" &&
          thumbailUrl &&
          (extension.toLowerCase() === "pdf" ? (
            <AssetPdf asset={asset.asset} />
          ) : (
            <AssetImg
              name={name}
              assetImg={thumbailUrl}
              imgClass="img-preview"
            />
          ))}
        {type !== "image" && type !== "video" && !thumbailUrl && (
          <AssetIcon extension={extension} />
        )}
        {type === "video" && (
          <video controls className={styles["video-preview"]}>
            <source src={realUrl} type={`video/${extension}`} />
            Sorry, your browser doesn't support video playback.
          </video>
        )}
      </div>
    </Base>
  );
};

export default ImagePreviewModal;
