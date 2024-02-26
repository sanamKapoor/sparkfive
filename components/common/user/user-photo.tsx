import ReactTooltip from "react-tooltip";
import { Utilities } from "../../../assets";
import styles from "./user-photo.module.css";

const UserPhoto = ({
  photoUrl = "",
  extraClass = "",
  sizePx = 27,
  NoPhotoElement = Utilities.memberProfile,
  tooltipId = "",
  tooltipText = "",
}) => (
  <>
    {photoUrl && (
      <img
        data-tip
        data-for={tooltipId}
        className={`${photoUrl ? styles.current : styles["no-photo"]} ${extraClass}`}
        src={photoUrl}
        style={{ width: sizePx, height: sizePx }}
      />
    )}
    {!photoUrl && (
      <NoPhotoElement
        data-tip
        data-for={tooltipId}
        className={`${styles["no-photo"]} ${extraClass}`}
        style={{ width: sizePx, height: sizePx }}
      />
    )}
    {tooltipText && (
      <ReactTooltip id={tooltipId} delayShow={500} effect="solid">
        {tooltipText}
      </ReactTooltip>
    )}
  </>
);

export default UserPhoto;
