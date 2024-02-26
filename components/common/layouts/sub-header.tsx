import { Utilities } from "../../../assets";
import styles from "./sub-header.module.css";

const SubHeader = ({
  pageTitle,
  children,
  editable = false,
  additionalClass = "",
  onAltEditionClick = () => {},
}) => {
  return (
    <section
      id={"sub-header"}
      className={`${styles.container} ${additionalClass}`}
    >
      <div className={styles["header-wrapper"]}>
        <h1 className={styles.title}>
          <span>{pageTitle}</span>
        </h1>
        {editable && (
          <img
            onClick={onAltEditionClick}
            className={styles.edit}
            src={Utilities.editWhite}
          />
        )}
      </div>
      {children && <div className="m-t-20">{children}</div>}
    </section>
  );
};

export default SubHeader;
