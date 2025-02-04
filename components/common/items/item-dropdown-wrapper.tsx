import { Utilities } from "../../../assets";
import styles from "./item-dropdown-wrapper.module.css";

const ItemDropdownWrapper = ({
  image,
  title,
  data = null,
  optionOnClick = () => {},
  hasOption = false,
  overrideIcon = false,
  children,
  isShare = false,
  styleType = false,
  childrenOnSide = false,
  OverrideIconComp = () => <></>,
}) => (
  <>
    <div className={styles["container"]} onClick={optionOnClick}>
      {overrideIcon ? (
        <OverrideIconComp />
      ) : (
        <>{image && <img className={styles["icon-left"]} src={image} />}</>
      )}
      <div className={styles["data-dropdown"]}>
        <span
          className={`${
            styleType ? styles["data-text"] : styles["text-placeholder"]
          }`}
        >
          {data}
        </span>
        {childrenOnSide && children}
      </div>
      {hasOption && !isShare && (
        <div className={styles["icon-container"]}>
          <img src={Utilities.arrowDark} />
        </div>
      )}
    </div>
    {!childrenOnSide && children}
  </>
);

export default ItemDropdownWrapper;
