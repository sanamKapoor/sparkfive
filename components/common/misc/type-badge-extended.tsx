import {
  ProjectType,
  ProjectTypeChannel,
  ProjectTypes,
  Utilities,
} from "../../../assets";
import styles from "./type-badge-extended.module.css";

// Components
import UserPhoto from "../../common/user/user-photo";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "./toggleable-absolute-wrapper";

const TypeBadgeExtended = ({
  type,
  socialChannel,
  name,
  photo,
  isMultiple = false,
  time,
  projectTask,
  dropdownOptions = [],
}) => {
  let icon = ProjectTypes[type];
  if (type !== "campaign" && type !== "task") {
    icon = ProjectType[type];
  }
  let projectName = null;
  if (type === "task") {
    projectName = `${projectTask} > `;
  }

  return (
    <div
      className={`${styles[type]} ${styles.container} ${
        isMultiple && styles.multiple
      } type-badge`}
    >
      {isMultiple ? (
        <>
          <UserPhoto sizePx={22} photoUrl={photo} />
          <div className={`${styles.name} name`}>{name}</div>
          <div className={"type-icon"}>
            <img
              src={
                socialChannel
                  ? ProjectTypeChannel[socialChannel.toLowerCase()]
                  : icon
              }
            />
          </div>
        </>
      ) : (
        <>
          <div className={styles.row}>
            <div className={`${styles.name} ${styles["name-extended"]} name`}>
              {name}
            </div>
            {dropdownOptions.length > 0 && (
              <ToggleableAbsoluteWrapper
                wrapperClass={`${styles["more-task"]}`}
                contentClass={styles.dropdown}
                Wrapper={({ children }) => (
                  <>
                    <img src={Utilities.more} />
                    {children}
                  </>
                )}
                Content={() => {
                  return <Dropdown options={dropdownOptions} />;
                }}
              />
            )}
          </div>
          <div className={styles.hour}>
            {time && <span>{time.toLowerCase()}</span>}
          </div>
          <div className={styles.icons}>
            <UserPhoto sizePx={22} photoUrl={photo} />
            <img
              src={
                socialChannel
                  ? ProjectTypeChannel[socialChannel.toLowerCase()]
                  : icon
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TypeBadgeExtended;
