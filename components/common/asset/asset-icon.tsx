import { extensionToType } from "../../../utils/deleted-assets";
import styles from "./asset-icon.module.css";

const AssetIcon = ({
  extension,
  onList = false,
  bulkSize = false,
  isCollection = false,
  onClick = undefined,
  noMargin = false,
  padding = false,
  style = {},
  imgClass = {},
  activeFilter = "",
}) => {
  return (
    <div
    data-drag="false"
      onClick={onClick}
      className={`${styles.container} ${!noMargin && onList && styles.small} ${noMargin && styles.noMargin
        } ${bulkSize && styles["bulk-size"]} ${isCollection && styles.collection
        }`}
    >
      <img
    data-drag="false"
        className={`${styles.icon} ${styles[imgClass]} ${styles[activeFilter]}`}
        style={style}
        src={extensionToType(extension, isCollection)}
      />
    </div>
  );
};

export default AssetIcon;
