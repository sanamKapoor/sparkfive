import React from "react";

import IconClickable from "../buttons/icon-clickable";
import redDeleteIconSrc from "../../../assets/Icons/Utilities/Delete/icn-utilities-delete.svg";
import classes from "./change-collection-thumbnail-row.module.css";

const ChangeCollectionThumbnailRow = ({
  index,
  imgSrc,
  imgName,
  onUpload,
  onDelete,
  fileInputRef,
  onChangeThisOnly,
  changeThisImgText,
}) => {
  return (
    <div className={classes["row-wrapper"]}>
      {index !== "0" && <p>{index}</p>}
      <div className={classes["img-preview-wrapper"]}>
        <div className={classes["img-box"]}>
          <img
            src={imgSrc}
            alt={"preview"}
            className={classes["img-preview"]}
          />
        </div>
        {imgName && imgName !== "undefined" && (
          <p className={classes["img-name"]}>{imgName}</p>
        )}
      </div>
      <IconClickable src={redDeleteIconSrc} onClick={onDelete} />
      <p>or</p>
      
      <button
        type="button"
        onClick={onChangeThisOnly}
        className={classes["change-this-btn"]}
      >
        {changeThisImgText}
      </button>
      <label
        onChange={onUpload}
        htmlFor={`upload-file-${index}`}
        className={classes["upload-label"]}
      >
        <input
          name=""
          type="file"
          id={`upload-file-${index}`}
          hidden
          ref={fileInputRef}
        />
        Upload Image
      </label>
    </div>
  );
};

export default ChangeCollectionThumbnailRow;
