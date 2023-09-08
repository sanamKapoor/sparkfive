import { useContext, useEffect, useRef, useState } from "react";
import { TeamContext, UserContext } from "../../../context";
import teamApi from "../../../server-api/team";
import userApi from "../../../server-api/user";
import toastUtils from "../../../utils/toast";
import styles from "./photo-upload.module.css";

import { Utilities } from "../../../assets";

const ALLOWED_TYPES = "image/png, image/jpeg";

// Components
import {
  FAILED_TO_UPLOAD_PHOTO,
  PHOTO_UPDATED,
} from "../../../constants/messages";
import { PROFILE_PIC_HELP_TEXT } from "../../../constants/strings";
import ButtonIcon from "../buttons/button-icon";
import Spinner from "../spinners/spinner";

interface IPhotoUploadProps {
  userPhoto?: string;
  description?: string;
  type?: "user" | "team";
}

const PhotoUpload: React.FC<IPhotoUploadProps> = ({
  userPhoto = "",
  description = PROFILE_PIC_HELP_TEXT,
  type = "user",
}) => {
  const [currentPhoto, setCurrentPhoto] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const { setUser } = useContext(UserContext);
  const { getTeam } = useContext(TeamContext);

  const fileBrowserRef = useRef(undefined);

  useEffect(() => {
    if (userPhoto) {
      setCurrentPhoto(userPhoto);
    }
  }, [userPhoto]);

  const openUpload = () => {
    fileBrowserRef.current.click();
  };

  const onFileChange = async (e) => {
    await saveChanges(e.target.files[0]);
    fileBrowserRef.current.value = "";
  };

  const cancelPreview = () => {
    setCurrentPhoto(userPhoto);
  };

  const saveChanges = async (uploadImg) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("photo", uploadImg);
      let updateFn = userApi.uploadPhoto;
      if (type === "team") updateFn = teamApi.uploadPhoto;
      const { data } = await updateFn(formData);
      if (type === "user") setUser(data);
      else getTeam();
      toastUtils.success(PHOTO_UPDATED);
    } catch (err) {
      cancelPreview();
      console.log(err);
      toastUtils.error(FAILED_TO_UPLOAD_PHOTO);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!isUploading ? (
        <img
          className={`${currentPhoto ? styles.current : styles["no-photo"]} ${
            styles[type]
          }`}
          src={currentPhoto || Utilities.memberProfile}
        />
      ) : (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      <div className={styles.uploadText}>
        <ButtonIcon
          icon={Utilities.addAlt}
          text="UPLOAD PHOTO"
          onClick={openUpload}
          additionalClass={styles.uploadPhotoProfile}
         
        />
        <p className={styles.description}>{description}</p>
      </div>
      <input
        id="file-input-id"
        ref={fileBrowserRef}
        style={{ display: "none" }}
        type="file"
        onChange={onFileChange}
        accept={ALLOWED_TYPES}
      />
    </div>
   
  );
};

export default PhotoUpload;
