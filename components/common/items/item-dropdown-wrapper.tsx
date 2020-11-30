import styles from "./item-dropdown-wrapper.module.css";
import { Utilities } from "../../../assets";

const ItemDropdownWrapper = ({
  image,
  title,
  data = null,
  optionOnClick = () => { },
  hasOption = false,
  overrideIcon = false,
  children,
  styleType = false,
  childrenOnSide = false,
  OverrideIconComp = () => <></>,
}) => (
    <>
      <div className={styles["container"]} onClick={optionOnClick}>
        {overrideIcon ? (
          <OverrideIconComp />
        ) : (
            <>
              {image && <img className={styles["icon-left"]} src={image} />}
            </>
          )}
        <div className={styles["data-dropdown"]}>
          <span
            className={`${styleType ? styles["data-text"] : styles["text-placeholder"]}`}
          >
            {data}
          </span>
          {childrenOnSide && children}
        </div>
        {hasOption && (
          <div className={styles["icon-container"]}>
            <img src={Utilities.arrowDark} />
          </div>
        )}
      </div>
      {!childrenOnSide && children}
    </>
  );

export default ItemDropdownWrapper;