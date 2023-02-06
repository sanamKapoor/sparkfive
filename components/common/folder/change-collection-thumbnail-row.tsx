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
        <div className={classes['img-box']}><img src={imgSrc} alt={"preview"} className={classes["img-preview"]} /></div>
        {imgName && imgName !== "undefined" && <p style={{
            margin: '4px 0 0 0', 
            fontSize: '10px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: 'inherit'}}>{imgName}</p>}
      </div>
      <IconClickable src={redDeleteIconSrc} onClick={onDelete} />
      <p>or</p>
      <label onChange={onUpload} htmlFor={`upload-file-${index}`} style={{display: 'flex', alignItems: 'center', border: '1px solid #dedad4', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.38)', padding: '8px 16px', fontWeight: 600, cursor: 'pointer'}}>
        <input
          name=""
          type="file"
          id={`upload-file-${index}`}
          hidden
          ref={fileInputRef}
        />
        Upload Image
      </label>
      <button 
        type="button" 
        onClick={onChangeThisOnly} 
        style={{
          cursor: 'pointer',
          padding: '0',
          textDecoration: 'underline',
          color: '#08135E',
          fontWeight: 600,
          backgroundColor: 'transparent'}}>Change this Image Only</button>        
    </div>
  );
};

export default ChangeCollectionThumbnailRow;
