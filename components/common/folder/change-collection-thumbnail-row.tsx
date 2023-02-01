import React from "react";

import IconClickable from "../buttons/icon-clickable";
import redDeleteIconSrc from "../../../assets/Icons/Utilities/Delete/icn-utilities-delete-red.svg";
import Button from "../buttons/button";

import styles from "../../common/modals/change-thumnail-modal.module.css";
import classes from "./change-collection-thumbnail-row.module.css";

const ChangeCollectionThumbnailRow = ({
  index,
  imgSrc,
  imgName,
  onUpload,
  isUploading,
}) => {
  return (
    <div className={classes["row-wrapper"]}>
      <p>{index}</p>
      <div className={classes["img-preview-wrapper"]}>
        <img src={imgSrc} alt={imgName} className={classes["img-preview"]} />
        <p>{imgName}</p>
      </div>
      <IconClickable src={redDeleteIconSrc} />
      <p>or</p>
      <Button
        text="Upload Image"
        onClick={onUpload}
        className={`${styles.button} ${styles.custom_button}`}
        disabled={isUploading}
        type="button"
        styleType="primary"
      />
      <p>Change this image only</p>
    </div>
  );
};

export default ChangeCollectionThumbnailRow;
