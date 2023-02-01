import ReactModal from "react-modal";
import styles from "./change-thumnail-modal.module.css";
import toastUtils from "../../../utils/toast";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import { useContext, useEffect, useRef, useState } from "react";

// Components
import Button from "../buttons/button";
import React from "react";
import { LoadingContext, AssetContext, FilterContext } from "../../../context";
import { AssetOps, Utilities } from "../../../assets";
import Autocomplete from "react-autocomplete";
import AssetIcon from "../asset/asset-icon";
import IconClickable from "../buttons/icon-clickable";
import ChangeCollectionThumbnailRow from "../folder/change-collection-thumbnail-row";
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
  const fileBrowseForFirstIndex = useRef(undefined);
  const fileBrowseForSecondtIndex = useRef(undefined);
  const fileBrowseForThirdtIndex = useRef(undefined);
  const fileBrowseForFourtIndex = useRef(undefined);
  const [FileBrowser, setFileBrowser] = useState({
    1: fileBrowseForFirstIndex,
    2: fileBrowseForSecondtIndex,
    3: fileBrowseForThirdtIndex,
    4: fileBrowseForFourtIndex,
  });
  const [IsUploading, setIsUploading] = useState(false);
  const [imagePath, setImagePath] = useState(null);
  const [imagePreview, setImagePreview] = useState(false);
  const [imageName, setImageName] = useState("");
  const [fileForUpload, setFileForUpload] = useState("");
  const [fileForUploadOfFourThumbView, setFileForUploadOfFourThumbView] =
    useState({});

  const [value, setValue] = useState("");
  const [valueOfFourThumbnailView, setValueOfFourThumbnailView] = useState({});
  const [searchData, setSearchData] = useState({});
  const [searchDataForFourThumbView, setSearchDataForFourThumbView] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  const [searching, setSearching] = useState(false);
  const [searchingForFourThumbView, setSearchingForFourThumbView] = useState(
    {}
  );
  const [isSearched, setIsSearched] = useState(false);
  const [extension, setExtentions] = useState("");
  const [isSearchedForFourThumbView, setIsSearchedForFourThumbView] = useState(
    {}
  );

  const [isImage, setIsImage] = useState(false);
  const [checkBoxForFourThumbView, setCheckBoxForFourThumbView] =
    useState(true);
  const [checkBoxForSingleThumbView, setCheckBoxForSingleThumbView] =
    useState(false);
  const [isUrl, setisUrl] = useState("");
  const [urlsForFourThumbView, setUrlsForFourThumbView] = useState({});
  const [imagePathForFourThumbView, setImagePathForFourThumbView] = useState(
    {}
  );
  const [imagePreviewForFourThumbView, setImagePreviewForFourThumbView] =
    useState({});
  const [imageNameForFourThumbView, setImageNameForFourThumbView] = useState(
    {}
  );
  const [extentionsForFourThumbView, setExtentionsForFourThumbView] = useState(
    {}
  );
  const [isImageForFourThumbView, setIsImageForFourThumbView] = useState({});
  const { setIsLoading } = useContext(LoadingContext);
  const { setFolders } = useContext(AssetContext);
  const { activeSortFilter } = useContext(FilterContext);

  const defaultModalView = "MULTI_THUMBNAIL_VIEW";

  const initialModalView =
    !modalData?.thumbnailPath && !modalData?.thumbnailExtension
      ? defaultModalView
      : "ONE_THUMBNAIL_VIEW";

  const [modalView, setModalView] = useState(initialModalView);

  useEffect(() => {
    setModalView(initialModalView);
  }, [modalData]);

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
    setSearchingForFourThumbView({});
    setImageName("");
    setFileForUpload("");
    setSearchData([]);
    setIsSearched(false);
    setIsSearchedForFourThumbView({});
    setCheckBoxForFourThumbView(true);
    setCheckBoxForSingleThumbView(false);
  }, [cleareProps]);

  const onFileChange = async (e, index = 0) => {
    await saveChanges(e.target.files[0], index);
  };

  const onChangeEvent = async (e, index = 0) => {
    if (index != 0) {
      setValueOfFourThumbnailView({ ...valueOfFourThumbnailView, [index]: e });
    } else {
      setValue(e);
    }
    if (e.length >= 2) {
      onSearch(e, index);
    } else if (e.length == 0) {
      setIsSearched(false);
      setIsSearchedForFourThumbView({
        ...isSearchedForFourThumbView,
        [index]: false,
      });
      setSearchData([]);
      setSearchDataForFourThumbView({
        ...searchDataForFourThumbView,
        [index]: [],
      });
      setSearching(false);
      setSearchingForFourThumbView({
        ...searchingForFourThumbView,
        [index]: false,
      });
    }
  };

  const onSelectImage = async (e, index = 0) => {
    if (e) {
      if (checkBoxForFourThumbView) {
        setUrlsForFourThumbView({ ...urlsForFourThumbView, [index]: e });
        setImagePathForFourThumbView({
          ...imagePathForFourThumbView,
          [index]: e.split(",")[1],
        });
        setImagePreviewForFourThumbView({
          ...imagePreviewForFourThumbView,
          [index]: true,
        });
        setImageNameForFourThumbView({
          ...imageNameForFourThumbView,
          [index]: e.split(",")[0],
        });
      } else {
        setisUrl(e);
        setImagePath(e.split(",")[1]);
        setImagePreview(true);
        setImageName(e.split(",")[0]);
      }
    }
  };

  const onSearch = async (searchKey, index) => {
    if (index) {
      setSearchingForFourThumbView({
        ...searchingForFourThumbView,
        [index]: true,
      });
    } else {
      setSearching(true);
    }

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
        if (checkBoxForFourThumbView) {
          setIsSearchedForFourThumbView({
            ...isSearchedForFourThumbView,
            [index]: true,
          });
          setSearchDataForFourThumbView({
            ...searchDataForFourThumbView,
            [index]: data.results,
          });
        } else {
          setIsSearched(true);
          setSearchData(data.results);
        }
        if (index) {
          setSearchingForFourThumbView({
            ...searchingForFourThumbView,
            [index]: false,
          });
        } else {
          setSearching(false);
        }
      }
    } catch (error) {
      console.log("error", error);
      if (index) {
        setSearchingForFourThumbView({
          ...searchingForFourThumbView,
          [index]: false,
        });
      } else {
        setSearching(false);
      }
    }
  };

  //remove file if file not valid
  const onRemove = (index = 0) => {
    setImagePreview(false);
    setImageName("");
    setFileForUpload("");
    setisUrl("");
    setExtentions("");
    setIsSearched(false);
    setIsImage(false);

    if (index) {
      setIsSearchedForFourThumbView({
        ...isSearchedForFourThumbView,
        [index]: false,
      });
      setUrlsForFourThumbView({ ...urlsForFourThumbView, [index]: "" });
      setImagePathForFourThumbView({
        ...imagePathForFourThumbView,
        [index]: "",
      });
      setImagePreviewForFourThumbView({
        ...imagePreviewForFourThumbView,
        [index]: false,
      });
      const valueData = valueOfFourThumbnailView;
      delete valueData[index];
      setValueOfFourThumbnailView({ ...valueData });
      setSearchDataForFourThumbView({
        ...searchDataForFourThumbView,
        [index]: [],
      });
      const fileForUploadData = fileForUploadOfFourThumbView;
      delete fileForUploadData[index];
      setFileForUploadOfFourThumbView({ ...fileForUploadData });
      const extentionData = extentionsForFourThumbView;
      delete extentionData[index];
      setExtentionsForFourThumbView({ ...extentionData });
      const imageData = imageNameForFourThumbView;
      delete imageData[index];
      setImageNameForFourThumbView({ ...imageData });
    } else {
      setUrlsForFourThumbView({});
      setImagePathForFourThumbView({});
      setImagePreviewForFourThumbView({});
      setImageNameForFourThumbView({});
      setValueOfFourThumbnailView({});
      setExtentionsForFourThumbView({});
      setSearchDataForFourThumbView({
        1: [],
        2: [],
        3: [],
        4: [],
      });
      setFileForUploadOfFourThumbView({});
      setIsSearchedForFourThumbView({});
    }

    if (
      fileBrowserRef &&
      fileBrowserRef.current &&
      fileBrowserRef.current.value
    ) {
      fileBrowserRef.current.value = "";
    }

    if (
      fileBrowseForFirstIndex &&
      fileBrowseForFirstIndex.current &&
      fileBrowseForFirstIndex.current.value
    ) {
      fileBrowseForFirstIndex.current.value = "";
    }

    if (
      fileBrowseForSecondtIndex &&
      fileBrowseForSecondtIndex.current &&
      fileBrowseForSecondtIndex.current.value
    ) {
      fileBrowseForSecondtIndex.current.value = "";
    }

    if (
      fileBrowseForThirdtIndex &&
      fileBrowseForThirdtIndex.current &&
      fileBrowseForThirdtIndex.current.value
    ) {
      fileBrowseForThirdtIndex.current.value = "";
    }

    if (
      fileBrowseForFourtIndex &&
      fileBrowseForFourtIndex.current &&
      fileBrowseForFourtIndex.current.value
    ) {
      fileBrowseForFourtIndex.current.value = "";
    }
  };

  //Upload image and validate
  const saveChanges = async (uploadImg, index) => {
    try {
      const fileId = index ? "myimage" + index : "myimage";
      var reader = new FileReader();
      var imgtag: any = document.getElementById(fileId);
      imgtag.title = uploadImg.name;
      reader.onload = (event: any) => {
        if (uploadImg.type.includes("image")) {
          imgtag.src = event.target.result;
          imgtag.onerror = () => {
            onRemove();
            toastUtils.error("Please upload correct image.");
            if (checkBoxForFourThumbView) {
              const extentionData = extentionsForFourThumbView;
              delete extentionData[index];
              setExtentionsForFourThumbView({ ...extentionData });
            } else {
              setExtentions("");
            }
          };
          imgtag.onload = () => {
            if (checkBoxForFourThumbView) {
              const extentionData = extentionsForFourThumbView;
              delete extentionData[index];
              setExtentionsForFourThumbView({ ...extentionData });
              setImagePreviewForFourThumbView({
                ...imagePreviewForFourThumbView,
                [index]: true,
              });
              setImageNameForFourThumbView({
                ...imageNameForFourThumbView,
                [index]: uploadImg.name,
              });
            } else {
              setImagePreview(true);
              setImageName(uploadImg.name);
              setExtentions("");
            }
          };
        } else {
          if (checkBoxForFourThumbView) {
            setImagePreviewForFourThumbView({
              ...imagePreviewForFourThumbView,
              [index]: true,
            });
            setIsImageForFourThumbView({
              ...isImageForFourThumbView,
              [index]: uploadImg.type.includes("image"),
            });
            setImageNameForFourThumbView({
              ...imageNameForFourThumbView,
              [index]: uploadImg.name,
            });
            setExtentionsForFourThumbView({
              ...extentionsForFourThumbView,
              [index]: uploadImg.type.split("/")[1],
            });
          } else {
            setImagePreview(true);
            setIsImage(uploadImg.type.includes("image"));
            setImageName(uploadImg.name);
            setExtentions(uploadImg.type.split("/")[1]);
          }
        }
      };
      reader.readAsDataURL(uploadImg);
      if (checkBoxForFourThumbView) {
        setFileForUploadOfFourThumbView({
          ...fileForUploadOfFourThumbView,
          [index]: uploadImg,
        });
      } else {
        setFileForUpload(uploadImg);
      }
    } catch (err) {
      console.log("errerr", err);
      onRemove();
      toastUtils.error("Could not update photo, please try again later.");
    } finally {
      setIsUploading(false);
      if (checkBoxForFourThumbView) {
        setSearchDataForFourThumbView({
          ...searchDataForFourThumbView,
          [index]: [],
        });
      } else {
        setSearchData([]);
      }
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
              thumbnails: { thumbnails: null },
              thumbnailStorageId: data[0].asset.storageId,
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
      sortField: activeSortFilter.sort?.field || "createdAt",
      sortOrder: activeSortFilter.sort?.order || "desc",
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
            thumbnails: { thumbnails: null },
            thumbnailStorageId: files[3],
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

  const saveClick4 = async () => {
    try {
      let isValidated = false;
      let uploadedFiles = Object.keys(fileForUploadOfFourThumbView).filter(
        (ele) => fileForUploadOfFourThumbView[ele]
      );
      let urls = Object.keys(urlsForFourThumbView).filter(
        (ele) => urlsForFourThumbView[ele]
      );
      if ([...new Set([...uploadedFiles, ...urls])].length < 4) {
        toastUtils.error("Please select all thumbnails.");
        return;
      } else {
        setIsLoading(true);
        setIsUploading(true);
        const formData = new FormData();
        let isUpload = false;
        Object.keys(fileForUploadOfFourThumbView).forEach((ele, index) => {
          if (fileForUploadOfFourThumbView[ele]) {
            isUpload = true;
            formData.append("thumbnail", fileForUploadOfFourThumbView[ele]);
          }
        });
        const fileUrls = Object.keys(urlsForFourThumbView).map((ele) => ({
          filePath: urlsForFourThumbView[ele].split(",")[1],
          extension: urlsForFourThumbView[ele].split(",")[2],
          index: ele,
          storageId: urlsForFourThumbView[ele].split(",")[3],
        }));
        let response;
        if (Object.keys(extentionsForFourThumbView).length) {
          let ext: any = [];
          Object.keys(extentionsForFourThumbView).forEach((ele) => {
            if (extentionsForFourThumbView[ele]) {
              ext.push({
                filePath: "",
                extension: extentionsForFourThumbView[ele],
                index: ele,
              });
            }
          });
          fileUrls.push(...ext);
        }
        if (isUpload) {
          const { data } = await assetApi.uploadThumbnail(formData, {
            folderId: modalData.id,
          });
          let ext: any = [];
          Object.keys(fileForUploadOfFourThumbView).forEach((ele, index) => {
            if (fileForUploadOfFourThumbView[ele]) {
              ext.push({
                filePath: data[index].thumbailUrl,
                storageId: data[index].asset.storageId,
                extension: data[index].asset.extension,
                index: ele,
              });
            }
          });
          fileUrls.push(...ext);
        }

        var unique = fileUrls
          .filter(({ extension, filePath }) => extension || filePath)
          .filter(
            (arr, index, self) =>
              index ===
              self.findIndex(
                (t) => t.index === arr.index && t.index === arr.index
              )
          );
        if (unique.length == 4) {
          await folderApi.updateFolder(
            modalData.id + `?folderId=${modalData.id}`,
            {
              thumbnailPath: null,
              thumbnailExtension: null,
              thumbnails: { thumbnails: unique },
            }
          );
          getFolders();
        } else {
          setIsUploading(false);
          setIsLoading(false);
          toastUtils.error("Please select all thumbnails.");
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

  const openFile = async (index) => {
    // Open file picker
    // onRemove();
    if (index == 1) fileBrowseForFirstIndex.current.click();
    else if (index == 2) fileBrowseForSecondtIndex.current.click();
    else if (index == 3) fileBrowseForThirdtIndex.current.click();
    else if (index == 4) fileBrowseForFourtIndex.current.click();
    else fileBrowserRef.current.click();
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
        <div className={styles.header_checkbox}>
          <div style={{ width: "100%", maxWidth: "300px" }}>
            <p>
              Search for file to use as the thumbnail or copy and paste the
              filename
            </p>
          </div>
          <div className={styles.checkbox4}>
            <IconClickable
              src={
                modalView === "MULTI_THUMBNAIL_VIEW"
                  ? Utilities.radioButtonEnabled
                  : Utilities.radioButtonNormal
              }
              additionalClass={styles["select-icon"]}
              onClick={() => {
                // setCheckBoxForFourThumbView(!checkBoxForFourThumbView);
                // setCheckBoxForSingleThumbView(checkBoxForFourThumbView);
                setModalView("MULTI_THUMBNAIL_VIEW");
                // onRemove();
              }}
            />
            <label
              style={{ paddingLeft: "5px", position: "relative", top: "-2px" }}
            >
              4 Thumbnail Preview
            </label>
          </div>
          <div className={styles.checkbox1}>
            <IconClickable
              src={
                modalView === "ONE_THUMBNAIL_VIEW"
                  ? Utilities.radioButtonEnabled
                  : Utilities.radioButtonNormal
              }
              additionalClass={styles["select-icon"]}
              onClick={() => {
                // setCheckBoxForSingleThumbView(!checkBoxForSingleThumbView);
                // setCheckBoxForFourThumbView(checkBoxForSingleThumbView);
                // onRemove();
                setModalView("ONE_THUMBNAIL_VIEW");
              }}
            />
            <label
              style={{ paddingLeft: "5px", position: "relative", top: "-1px" }}
            >
              1 Thumbnail Preview
            </label>
          </div>
        </div>
        <div>
          {modalView === "ONE_THUMBNAIL_VIEW" ? (
            <ChangeCollectionThumbnailRow
              index={1}
              imgSrc={modalData?.thumbnailPath}
              imgName="my-image.png"
              onUpload={openFile}
              isUploading={IsUploading}
            />
          ) : (
            <>
              <ChangeCollectionThumbnailRow
                index={1}
                // imgSrc={}
                imgName="my-image.png"
                onUpload={openFile}
                isUploading={IsUploading}
              />
              <ChangeCollectionThumbnailRow
                index={2}
                // imgSrc={}
                imgName="my-image.png"
                onUpload={openFile}
                isUploading={IsUploading}
              />
              <ChangeCollectionThumbnailRow
                index={3}
                // imgSrc={}
                imgName="my-image.png"
                onUpload={openFile}
                isUploading={IsUploading}
              />
              <ChangeCollectionThumbnailRow
                index={4}
                // imgSrc={}
                imgName="my-image.png"
                onUpload={openFile}
                isUploading={IsUploading}
              />
            </>
          )}
        </div>
        <div className="row">
          <div className="col-12" style={{ width: "100%" }}>
            <div style={{ display: "flex", margin: "10px 26%" }}>
              <Button
                text="Save"
                onClick={saveClick4}
                type="button"
                styleType="primary"
                className={`${styles.button} ${
                  imagePreview ? styles.margin_t : ""
                } ${styles.mr}`}
                disabled={IsUploading}
              />
              <Button
                text="Cancel"
                onClick={(e) => {
                  onRemove();
                  closeModal();
                }}
                type="button"
                className={`${styles.button} ${
                  imagePreview ? styles.margin_t : ""
                } ${styles.mr} ${styles.cancel}`}
                disabled={IsUploading}
              />
            </div>
          </div>
        </div>
        {/*checkBoxForSingleThumbView && (
          <>
            <div
              className={styles.disaplay_box}
              style={{ padding: "15px 0px" }}
            >
              {!imagePreview && (
                <Autocomplete
                  getItemValue={(item) =>
                    [
                      item.name,
                      item.value,
                      item.extension,
                      item.storageId,
                    ].join(",")
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
                          storageId: ele.asset.storageId,
                        }))
                  }
                  value={value}
                  renderItem={(item, isHighlighted) => {
                    if (item.name == "0") {
                      return (
                        <div
                          className={styles.disaplay_box_item}
                          style={{
                            pointerEvents: "none",
                            cursor: "not-allowed",
                          }}
                        >
                          <br />
                          <span className={styles.heading}>Searching...</span>
                        </div>
                      );
                    } else if (item.name == "1") {
                      return (
                        <div
                          className={styles.disaplay_box_item}
                          style={{
                            pointerEvents: "none",
                            cursor: "not-allowed",
                          }}
                        >
                          <br />
                          <span className={styles.heading}>
                            No Result Found.
                          </span>
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
                  onChange={(e) => onChangeEvent(e.target.value, 0)}
                  onSelect={(e) => onSelectImage(e, 0)}
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
                    left: "auto",
                    top: "auto",
                    zIndex: "500",
                    position: "fixed",
                    width: "100%",
                  }}
                />
              )}
              <div
                className={`${styles.preview} ${
                  imagePreview ? styles.input : ""
                }`}
              >
                {!isUrl && (
                  <img
                    id="myimage"
                    className={styles.img_file}
                    style={{
                      display:
                        imagePreview && !isImage && !extension
                          ? "block"
                          : "none",
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
                } ${styles.save_button}`}
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
              {/* <div className={styles.div}>
                <p className={styles.paragrap}>
                  Or upload the image you want to use as thumbnail
                </p>
              </div> */}
        {/* <Button
                text="Upload Image"
                onClick={openFile}
                className={`${styles.button} ${styles.custom_button}`}
                disabled={IsUploading}
                type="button"
                styleType="primary"
              />
            </div>
          </>
        )} */}

        {/* {checkBoxForFourThumbView && (
          <>
            {[1, 2, 3, 4].map((ele, index) => (
              <div className="row" key={index} style={{ padding: "15px 21px" }}>
                {imagePreviewForFourThumbView &&
                  !imagePreviewForFourThumbView[ele] && (
                    <div className="col-6 row-div">
                      <p
                        style={{
                          display: "inline-flex",
                          width: "10px",
                          marginRight: "10px",
                        }}
                      >
                        {ele}
                      </p>{" "}
                      <div style={{ display: "inline-flex" }}>
                        <Autocomplete
                          getItemValue={(item) =>
                            [
                              item.name,
                              item.value,
                              item.extension,
                              item.storageId,
                            ].join(",")
                          }
                          items={
                            searchingForFourThumbView &&
                            searchingForFourThumbView[ele]
                              ? [{ name: "0", value: "0" }]
                              : searchDataForFourThumbView[ele] &&
                                searchDataForFourThumbView[ele].length == 0 &&
                                isSearchedForFourThumbView &&
                                isSearchedForFourThumbView[ele]
                              ? [{ name: "1", value: "1" }]
                              : searchDataForFourThumbView[ele] &&
                                searchDataForFourThumbView[ele].map(
                                  (ele: any) => ({
                                    name: ele.asset.name,
                                    value: ele.thumbailUrl,
                                    extension: ele.asset.extension,
                                    storageId: ele.asset.storageId,
                                  })
                                )
                          }
                          value={valueOfFourThumbnailView[ele]}
                          renderItem={(item, isHighlighted) => {
                            if (item.name == "0") {
                              return (
                                <div
                                  className={styles.disaplay_box_item}
                                  style={{
                                    pointerEvents: "none",
                                    cursor: "not-allowed",
                                  }}
                                >
                                  <br />
                                  <span className={styles.heading}>
                                    Searching...
                                  </span>
                                </div>
                              );
                            } else if (item.name == "1") {
                              return (
                                <div
                                  className={styles.disaplay_box_item}
                                  style={{
                                    pointerEvents: "none",
                                    cursor: "not-allowed",
                                  }}
                                >
                                  <br />
                                  <span className={styles.heading}>
                                    No Result Found.
                                  </span>
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
                                  <span className={styles.heading}>
                                    {item.name}
                                  </span>
                                </div>
                              );
                            }
                          }}
                          onChange={(e) => onChangeEvent(e.target.value, ele)}
                          onSelect={(e) => onSelectImage(e, ele)}
                          disablePortal={false}
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
                            left: "auto",
                            top: "auto",
                            zIndex: "500",
                            position: "fixed",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                  )}
                {imagePreviewForFourThumbView &&
                  !imagePreviewForFourThumbView[ele] && (
                    <div className={`${styles["or-class"]}`}>or</div>
                  )}
                {imagePreviewForFourThumbView &&
                  !imagePreviewForFourThumbView[ele] && (
                    <div className="col-4">
                      <Button
                        text="Upload Image"
                        onClick={(e) => openFile(ele)}
                        disabled={IsUploading}
                        type="button"
                        className={`${styles.m4}`}
                      />
                    </div>
                  )}
                <div
                  className={`${styles.preview} ${
                    imagePreviewForFourThumbView &&
                    imagePreviewForFourThumbView[ele]
                      ? styles.input
                      : ""
                  }`}
                >
                  {urlsForFourThumbView && !urlsForFourThumbView[ele] && (
                    <img
                      id={"myimage" + ele}
                      className={styles.img_file}
                      style={{
                        display:
                          imagePreviewForFourThumbView &&
                          imagePreviewForFourThumbView[ele] &&
                          isImageForFourThumbView &&
                          !isImageForFourThumbView[ele] &&
                          extentionsForFourThumbView &&
                          !extentionsForFourThumbView[ele]
                            ? "block"
                            : "none",
                      }}
                    />
                  )}
                  {isImageForFourThumbView &&
                    !isImageForFourThumbView[ele] &&
                    extentionsForFourThumbView &&
                    extentionsForFourThumbView[ele] && (
                      <AssetIcon
                        extension={extentionsForFourThumbView[ele]}
                        style={{ width: "5rem", padding: "10px" }}
                      />
                    )}
                  {urlsForFourThumbView &&
                    urlsForFourThumbView[ele] &&
                    urlsForFourThumbView[ele].split(",")[1] && (
                      <img
                        src={urlsForFourThumbView[ele].split(",")[1]}
                        className={styles.img_file}
                        style={{
                          display:
                            imagePreviewForFourThumbView &&
                            imagePreviewForFourThumbView[ele]
                              ? "block"
                              : "none",
                        }}
                      />
                    )}
                  {urlsForFourThumbView &&
                    urlsForFourThumbView[ele] &&
                    !urlsForFourThumbView[ele].split(",")[1] && (
                      <AssetIcon
                        extension={urlsForFourThumbView[ele].split(",")[2]}
                        style={{ width: "5rem", padding: "10px" }}
                      />
                    )}
                  {imagePreviewForFourThumbView &&
                    imagePreviewForFourThumbView[ele] && (
                      <label>{imageNameForFourThumbView[ele]}</label>
                    )}
                  {imagePreviewForFourThumbView &&
                    imagePreviewForFourThumbView[ele] && (
                      <img
                        src={AssetOps.deleteRed}
                        alt=""
                        onClick={(e) => onRemove(ele)}
                        className={styles.deleteIcon}
                      />
                    )}
                  <input
                    id="file-input-id"
                    ref={FileBrowser[ele]}
                    style={{ display: "none" }}
                    type="file"
                    onChange={(e) => onFileChange(e, ele)}
                  />
                </div>
              </div>
            ))}
              </div>
            </div>
          </>
        )}*/}
      </div>
    </ReactModal>
  );
};

export default ChangeThumbnail;
