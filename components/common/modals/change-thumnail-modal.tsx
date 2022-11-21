import ReactModal from "react-modal";
import styles from "./change-thumnail-modal.module.css";
import toastUtils from "../../../utils/toast";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";

import { useContext, useEffect, useRef, useState } from "react";

// Components
import Button from "../buttons/button";
import React from "react";
import { LoadingContext, AssetContext } from "../../../context";
import { AssetOps } from "../../../assets";
import Autocomplete from "react-autocomplete";
import AssetIcon from "../asset/asset-icon";
ReactModal.defaultStyles = {};

// Used for the upload thumbnail for collection
const ChangeThumbnail = ({
  modalIsOpen,
  modalData,
  closeModal = false,
  cleareProps,
  textWidth = false,
  noHeightMax = false,
  additionalClasses = [""],
  closeButtonOnly = false,
}) => {
  const fileBrowserRef = useRef(undefined);
  const [IsUploading, setIsUploading] = useState(false);
  const [imagePath, setImagePath] = useState(null);
  const [imagePreview, setImagePreview] = useState(false);
  const [imageName, setImageName] = useState("");
  const [fileForUpload, setFileForUpload] = useState("");
  const [value, setValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [extension, setExtentions] = useState("");
  const [isImage, setIsImage] = useState(false);

  const [isUrl, setisUrl] = useState("");

  const ALLOWED_TYPES = "image/*";
  const { setIsLoading } = useContext(LoadingContext);
  const { setFolders } = useContext(AssetContext);

  useEffect(() => {
    const cols: any = document.getElementsByTagName("html");
    if (modalIsOpen) {
      for (let i = 0; i < cols.length; i++) {
        cols[i].style.overflow = "hidden";
      }
    } else {
      for (let i = 0; i < cols.length; i++) {
        cols[i].style.overflow = "auto";
      }
    }
  }, [modalIsOpen]);

  useEffect(() => {
    onRemove();
    setValue("");
    setIsUploading(false);
    setImagePath(null);
    setImagePreview(false);
    setSearching(false);
    setImageName("");
    setFileForUpload("");
    setSearchData([]);
    setIsSearched(false);
  }, [cleareProps]);

  const onFileChange = async (e) => {
    await saveChanges(e.target.files[0]);
  };

  const onChangeEvent = async (e) => {
    setValue(e.target.value);
    if (e.target.value.length >= 2) {
      onSearch(e.target.value);
    } else if (e.target.value.length == 0) {
      setIsSearched(false);
      setSearchData([]);
      setSearching(false);
    }
  };

  const onSelectImage = async (e) => {
    if (e) {
      setisUrl(e);
      setImagePath(e.split(",")[1]);
      setImagePreview(true);
      setImageName(e.split(",")[0]);
    }
  };

  const onSearch = async (searchKey) => {
    setSearching(true);
    const queryParams = {
      term: searchKey,
      page: 1,
      sharePath: searchKey,
      advSearchFrom: "folders.name",
      folderId: modalData.id,
    };
    try {
      const { data } = await assetApi.searchAssets(queryParams);
      if (data) {
        setIsSearched(true);
        setSearchData(data.results);
        setSearching(false);
      }
    } catch (error) {
      console.log("error", error);
      setSearching(false);
    }
  };

  //remove file if file not valid
  const onRemove = () => {
    setImagePreview(false);
    setImageName("");
    setFileForUpload("");
    setisUrl("");
    setExtentions("");
    setIsSearched(false);
    setIsImage(false);
    if (
      fileBrowserRef &&
      fileBrowserRef.current &&
      fileBrowserRef.current.value
    ) {
      fileBrowserRef.current.value = "";
    }
  };

  //Upload image and validate
  const saveChanges = async (uploadImg) => {
    try {
      var reader = new FileReader();
      var imgtag: any = document.getElementById("myimage");
      imgtag.title = uploadImg.name;
      reader.onload = (event: any) => {
        if (uploadImg.type.includes("image")) {
          imgtag.src = event.target.result;
          imgtag.onerror = () => {
            onRemove();
            toastUtils.error("Please upload correct image.");
            setExtentions("");
          };
          imgtag.onload = () => {
            setImagePreview(true);
            setImageName(uploadImg.name);
            setExtentions("");
          };
        } else {
          setImagePreview(true);
          setIsImage(uploadImg.type.includes("image"));
          setImageName(uploadImg.name);
          setExtentions(uploadImg.type.split("/")[1]);
        }
      };
      reader.readAsDataURL(uploadImg);
      setFileForUpload(uploadImg);
    } catch (err) {
      console.log("errerr", err);
      onRemove();
      toastUtils.error("Could not update photo, please try again later.");
    } finally {
      setIsUploading(false);
      setSearchData([]);
    }
  };

  //called by save button
  const saveClick = async () => {
    try {
      setIsLoading(true);
      setIsUploading(true);
      const formData = new FormData();
      formData.append("thumbnail", fileForUpload);
      if (extension) {
        await folderApi.updateFolder(
          modalData.id + `?folderId=${modalData.id}`,
          {
            thumbnailPath: "",
            thumbnailExtension: extension,
          }
        );
        getFolders();
      } else {
        const { data } = await assetApi.uploadThumbnail(formData, {
          folderId: modalData.id,
        });
        if (data) {
          await folderApi.updateFolder(
            modalData.id + `?folderId=${modalData.id}`,
            {
              thumbnailPath: data[0].realUrl,
              thumbnailExtension: data[0].asset.extension,
            }
          );
          getFolders();
        }
      }
    } catch (err) {
      console.log("errerrerr", err);
      onRemove();
      toastUtils.error("Could not update photo, please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  //Refresh data after thumbnail changed
  const getFolders = async () => {
    let query = {
      page: 1,
      sortField: "createdAt",
      sortOrder: "desc",
    };
    const { data } = await folderApi.getFolders(query);
    setFolders(data, true, true);
    onRemove();
    setIsLoading(false);
    toastUtils.success(`Thumbnail updated.`);
    setIsUploading(false);
    closeModal();
  };

  //Link thumbnail URL for a collection
  const saveLinkChanges = async () => {
    try {
      const files = isUrl ? isUrl.split(",") : [];
      if (files.length > 0) {
        setIsLoading(true);
        setIsUploading(true);
        await folderApi.updateFolder(
          modalData.id + `?folderId=${modalData.id}`,
          {
            thumbnailPath: imagePath,
            thumbnail_extension: files[2],
          }
        );
        setImagePath(null);
        setisUrl("");
        getFolders();
      } else {
        onRemove();
        toastUtils.error("Please enter valid Image url.");
      }
    } catch (err) {
      onRemove();
      toastUtils.error("Could not update photo, please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  const openFile = async (e) => {
    // Open file picker
    fileBrowserRef.current.click();
  };

  return (
    <ReactModal
      isOpen={modalIsOpen}
      className={`${styles.modal} ${
        noHeightMax && styles["no-height-max"]
      } ${additionalClasses.join(" ")}`}
      overlayClassName={styles.overlay}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      shouldFocusAfterRender={false}
      ariaHideApp={false}
    >
      <div
        className={`${styles.text} ${
          closeButtonOnly ? styles["no-border"] : ""
        } ${textWidth && styles["full-width"]}`}
      >
        {<p className={styles["overflow-text"]}>Change Thumbnail</p>}
        <span className={styles.close} onClick={closeModal}>
          x
        </span>
      </div>
      <div style={{ padding: "10px 20px" }}>
        <div style={{ width: "100%", maxWidth: "300px" }}>
          <p>
            Search for file to use as the thumbnail or copy and paste the
            filename
          </p>
        </div>
        <div className={styles.disaplay_box}>
          {!imagePreview && (
            <Autocomplete
              getItemValue={(item) =>
                [item.name, item.value, item.extension].join(",")
              }
              items={
                searching
                  ? [{ name: "0", value: "0" }]
                  : searchData.length == 0 && isSearched
                  ? [{ name: "1", value: "1" }]
                  : searchData.map((ele: any) => ({
                      name: ele.asset.name,
                      value: ele.thumbailUrl,
                      extension: ele.asset.extension,
                    }))
              }
              value={value}
              renderItem={(item, isHighlighted) => {
                if (item.name == "0") {
                  return (
                    <div
                      className={styles.disaplay_box_item}
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                    >
                      <br />
                      <span className={styles.heading}>Searching...</span>
                    </div>
                  );
                } else if (item.name == "1") {
                  return (
                    <div
                      className={styles.disaplay_box_item}
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                    >
                      <br />
                      <span className={styles.heading}>No Result Found.</span>
                    </div>
                  );
                } else {
                  return (
                    <div className={styles.disaplay_box_item}>
                      {item.value !== "" ? (
                        <img
                          src={item.value}
                          alt=""
                          className={styles.imgicon}
                        />
                      ) : (
                        <div className={styles.imgicon}>
                          <AssetIcon extension={item.extension} />
                        </div>
                      )}
                      <span className={styles.heading}>{item.name}</span>
                    </div>
                  );
                }
              }}
              onChange={onChangeEvent}
              onSelect={onSelectImage}
              menuStyle={{
                minWidth: "180px",
                borderRadius: "3px",
                boxShadow: "#f7ebdc",
                background: "#f7ebdc",
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "185px",
                maxWidth: "358px",
                margin: "0px 10px 0px 0px",
              }}
            />
          )}
          <div
            className={`${styles.preview} ${imagePreview ? styles.input : ""}`}
          >
            {!isUrl && (
              <img
                id="myimage"
                className={styles.img_file}
                style={{
                  display:
                    imagePreview && !isImage && !extension ? "block" : "none",
                }}
              />
            )}
            {!isImage && extension && (
              <AssetIcon
                extension={extension}
                style={{ width: "5rem", padding: "10px" }}
              />
            )}
            {isUrl && isUrl.split(",")[1] && (
              <img
                src={isUrl.split(",")[1]}
                className={styles.img_file}
                style={{ display: imagePreview ? "block" : "none" }}
              />
            )}
            {isUrl && !isUrl.split(",")[1] && (
              <AssetIcon
                extension={isUrl.split(",")[2]}
                style={{ width: "5rem", padding: "10px" }}
              />
            )}
            {imagePreview && <label>{imageName}</label>}
            {imagePreview && (
              <img
                src={AssetOps.deleteRed}
                alt=""
                onClick={onRemove}
                className={styles.deleteIcon}
              />
            )}
          </div>
          <Button
            text="Save"
            onClick={imagePreview && !isUrl ? saveClick : saveLinkChanges}
            type="button"
            styleType="primary"
            className={`${styles.button} ${
              imagePreview ? styles.margin_t : ""
            }`}
            disabled={IsUploading}
          />
          <input
            id="file-input-id"
            ref={fileBrowserRef}
            style={{ display: "none" }}
            type="file"
            onChange={onFileChange}
          />
        </div>
        <div className={styles.padding_div}>
          <div className={styles.div}>
            <p className={styles.paragrap}>
              Or upload the image you want to use as thumbnail
            </p>
          </div>
          <Button
            text="Upload Image"
            onClick={openFile}
            className={styles.button}
            disabled={IsUploading}
            type="button"
            styleType="primary"
          />
        </div>
      </div>
    </ReactModal>
  );
};

export default ChangeThumbnail;
