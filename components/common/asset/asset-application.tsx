import { Assets } from "../../../assets";
import styles from "./asset-application.module.css";

const { msword, msexcel, msppt, pdf, html, unknown } = Assets;
const AssetApplication = ({
  assetImg,
  extension,
  onList = false,
  bulkSize = false,
  onClick,
}) => {
  return (
    <>
      {extension === "pdf" ? (
        !assetImg ? (
          <div
            onClick={onClick}
            className={`${styles.container} ${onList && styles.small} ${
              bulkSize && styles["bulk-size"]
            }`}
          >
            <img src={pdf} className={styles.icon} />
          </div>
        ) : (
          <img
            onClick={onClick}
            src={assetImg}
            className={`${styles.asset} ${onList && styles.small} ${
              bulkSize && styles["bulk-size"]
            }`}
          />
        )
      ) : extension === "doc" || extension === "docx" ? (
        <div
          onClick={onClick}
          className={`${styles.container} ${onList && styles.small} ${
            bulkSize && styles["bulk-size"]
          }`}
        >
          <img src={assetImg || msword} className={styles.icon} />
        </div>
      ) : extension === "ppt" || extension === "vnd.ms-powerpoint" ? (
        <div
          onClick={onClick}
          className={`${styles.container} ${onList && styles.small} ${
            bulkSize && styles["bulk-size"]
          }`}
        >
          <img src={assetImg || msppt} className={styles.icon} />
        </div>
      ) : extension === "vnd.ms-excel" ||
        extension === "xlsx" ||
        extension === "xls" ? (
        <div
          onClick={onClick}
          className={`${styles.container} ${onList && styles.small} ${
            bulkSize && styles["bulk-size"]
          }`}
        >
          <img src={assetImg || msexcel} className={styles.icon} />
        </div>
      ) : extension === "html" ? (
        <div
          onClick={onClick}
          className={`${styles.container} ${onList && styles.small} ${
            bulkSize && styles["bulk-size"]
          }`}
        >
          <img src={assetImg || html} className={styles.icon} />
        </div>
      ) : (
        <div
          onClick={onClick}
          className={`${styles.container} ${onList && styles.small} ${
            bulkSize && styles["bulk-size"]
          }`}
        >
          <img src={assetImg || unknown} className={styles.icon} />
        </div>
      )}
    </>
  );
};

export default AssetApplication;
