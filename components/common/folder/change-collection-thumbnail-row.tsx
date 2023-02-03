import React from "react";

import IconClickable from "../buttons/icon-clickable";
import redDeleteIconSrc from "../../../assets/Icons/Utilities/Delete/icn-utilities-delete-red.svg";
import Button from "../buttons/button";

import styles from "../../common/modals/change-thumnail-modal.module.css";
import classes from "./change-collection-thumbnail-row.module.css";

import { Assets } from "../../../assets";

const ChangeCollectionThumbnailRow = ({
  index,
  imgSrc,
  imgName,
  onUpload,
  isUploading,
  onDelete,
  fileInputRef,
  onChangeThisOnly,
}) => {
  console.log("fileInputRef: ", fileInputRef);
  return (
    <div className={classes["row-wrapper"]}>
      {index !== "0" && <p>{index}</p>}
      <div className={classes["img-preview-wrapper"]}>
        <img src={imgSrc} alt={"preview"} className={classes["img-preview"]} />
        {imgName && imgName !== "undefined" && <p>{imgName}</p>}
      </div>
      <IconClickable src={redDeleteIconSrc} onClick={onDelete} />
      <p>or</p>
      <label onChange={onUpload} htmlFor={`upload-file-${index}`}>
        <input
          name=""
          type="file"
          id={`upload-file-${index}`}
          hidden
          ref={fileInputRef}
        />
        Upload Image
      </label>
      <Button
        onClick={onChangeThisOnly}
        text="Change this image only"
        type="button"
      />
    </div>
  );
};

export default ChangeCollectionThumbnailRow;
