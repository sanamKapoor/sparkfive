import { useContext, useEffect, useRef, useState } from "react";
import { TeamContext, UserContext } from "../../../context";
import teamApi from "../../../server-api/team";
import userApi from "../../../server-api/user";
import toastUtils from "../../../utils/toast";
import styles from "./photo-upload.module.css";

import { Utilities } from "../../../assets";

const ALLOWED_TYPES = "image/png, image/jpeg";

// Components
import Button from "../buttons/button";
import ButtonIcon from "../buttons/button-icon";
import Spinner from "../spinners/spinner";

const PhotoUpload = ({
  userPhoto = "",
  explainText = "Your Avatar appears in your team comments and notifications",
  type = "user",
}) => {
  const [currentPhoto, setCurrentPhoto] = useState(undefined);
  const [uploadedImage, setUploadedImage] = useState(undefined);
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
    setUploadedImage(undefined);
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
      toastUtils.success(`Photo updated.`);
      setUploadedImage(undefined);
    } catch (err) {
      cancelPreview();
      console.log(err);
      toastUtils.error("Could not update photo, please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!isUploading && (
        <img
          className={`${currentPhoto ? styles.current : styles["no-photo"]} ${
            styles[type]
          }`}
          src={currentPhoto || Utilities.memberProfile}
        />
      )}
      {isUploading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      <div>
        {uploadedImage ? (
          <>
            <Button
              text="Cancel"
              type="button"
              styleType="secondary"
              onClick={cancelPreview}
            />
            <Button
              text="Save Changes"
              type="button"
              styleType="primary"
              onClick={saveChanges}
            />
          </>
        ) : (
          <ButtonIcon
            icon={Utilities.addAlt}
            text="UPLOAD PHOTO"
            onClick={openUpload}
          />
        )}
        <p className={styles.description}>{explainText}</p>
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
