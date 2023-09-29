import redDeleteIconSrc from "../../../assets/Icons/Utilities/Delete/icn-utilities-delete.svg";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
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
      <div className={classes["img-wrapper-container"]}>
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
        <div className={classes["del-icon-wrapper"]}>
          <IconClickable
            src={redDeleteIconSrc}
            onClick={onDelete}
            additionalClass={classes["delete-icon"]}
          />
          <p>or</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={onChangeThisOnly}
        className="change-this-btn"
        text={changeThisImgText}
      />
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
