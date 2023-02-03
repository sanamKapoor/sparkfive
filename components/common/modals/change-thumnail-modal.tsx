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
import { AssetOps, Utilities, Assets } from "../../../assets";
import Autocomplete from "react-autocomplete";
import AssetIcon from "../asset/asset-icon";
import IconClickable from "../buttons/icon-clickable";
import ChangeCollectionThumbnailRow from "../folder/change-collection-thumbnail-row";
ReactModal.defaultStyles = {};

import axios from "axios";
import SearchThumbnail from "../inputs/search-thumbnail";

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

  //TODO: update data in context folders only when user clicks on save, otherwise keep local state updated

  /** --------------------------- NEW WORK IS STARTING HERE ----------------------------------- */
  const defaultModalView = "MULTI_THUMBNAIL_VIEW";

  const initialModalView =
    !modalData?.thumbnailPath && !modalData?.thumbnailExtension
      ? defaultModalView
      : "ONE_THUMBNAIL_VIEW";

  const initialThumbnailsData = modalData?.thumbnails?.thumbnails
    ? modalData?.thumbnails?.thumbnails.map((thumb) => {
        return {
          index: thumb.index,
          name: decodeURI(thumb.storageId?.split("/").at(-1)),
          src: thumb.filePath ? thumb.filePath : Assets.empty,
          isEmpty: false,
          isChanging: false,
        };
      })
    : ["1", "2", "3", "4"].map((index) => {
        return {
          index,
          name: "",
          src: "",
          isEmpty: true,
          isChanging: false,
        };
      });

  const initialLocalThumbnail = modalData?.thumbnailPath
    ? {
        index: "0",
        name: modalData?.storageId
          ? decodeURI(modalData.storageId?.split("/").at(-1))
          : "",
        src: modalData?.thumbnailPath,
        isEmpty: false,
        isChanging: false,
      }
    : {
        index: "0",
        name: "",
        src: "",
        isEmpty: true,
        isChanging: false,
      };

  const [modalView, setModalView] = useState(initialModalView);
  const [localThumbnails, setLocalThumbnails] = useState(initialThumbnailsData);
  const [localThumbnail, setLocalThumbnail] = useState(initialLocalThumbnail);

  const [uploadFile, setUploadFile] = useState("");
  const [uploadFiles, setUploadFiles] = useState(["", "", "", ""]);

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

  useEffect(() => {
    setModalView(initialModalView);
    setLocalThumbnails(initialThumbnailsData);
    setLocalThumbnail(initialLocalThumbnail);
  }, [modalData]);

  const openFile = async (index) => {
    if (index == 1) fileBrowseForFirstIndex.current.click();
    else if (index == 2) fileBrowseForSecondtIndex.current.click();
    else if (index == 3) fileBrowseForThirdtIndex.current.click();
    else if (index == 4) fileBrowseForFourtIndex.current.click();
    else fileBrowserRef.current.click();
  };

  const handleDeleteThumbnail = (e, index) => {
    if (index === "0") {
      setLocalThumbnail({
        ...localThumbnail,
        name: "",
        src: "",
        isEmpty: true,
        isChanging: false,
      });
    } else {
      const localThumbnailsCopy = [...localThumbnails];
      const findThumbnail = localThumbnails.findIndex(
        (thumb) => thumb.index === index
      );
      if (findThumbnail !== -1) {
        localThumbnailsCopy[findThumbnail] = {
          index,
          src: "",
          name: "",
          isEmpty: true,
          isChanging: false,
        };
      }

      setLocalThumbnails(localThumbnailsCopy);
    }
  };

  const handleUploadThumbnail = (e, index) => {
    openFile(index);
    if (index === "0") {
      setUploadFile(e.target.files[0]);
      setLocalThumbnail({
        ...localThumbnail,
        name: e.target.files[0].name,
        src: URL.createObjectURL(e.target.files[0]),
        isEmpty: false,
        isChanging: false,
      });
    } else {
      const uploadFilesCopy = [...uploadFiles];
      uploadFilesCopy.splice(index, 1, e.target.files[0]);

      setUploadFiles(uploadFilesCopy);

      const localThumbnailsCopy = [...localThumbnails];
      const findThumbnail = localThumbnails.findIndex((thumb) => {
        console.log(thumb.index === index);
        return thumb.index === index;
      });

      if (findThumbnail !== -1) {
        localThumbnailsCopy[findThumbnail] = {
          index,
          name: e.target.files[0].name,
          src: URL.createObjectURL(e.target.files[0]),
          isEmpty: false,
          isChanging: false,
        };
      }
      setLocalThumbnails(localThumbnailsCopy);
    }
  };

  const handleChangeThisOnly = (e, index) => {
    if (index === "0") {
      setLocalThumbnail({ ...localThumbnail, isChanging: true });
    } else {
      const localThumbnailsCopy = [...localThumbnails];
      const findThumbnail = localThumbnails.findIndex(
        (thumb) => thumb.index === index
      );
      if (findThumbnail !== -1) {
        localThumbnailsCopy[findThumbnail] = {
          ...localThumbnails[findThumbnail],
          isChanging: true,
        };
      }

      setLocalThumbnails(localThumbnailsCopy);
    }
  };

  const handleCancel = () => {
    // close the Modal
    closeModal();
  };

  const handleSave = async () => {
    try {
      if (modalView === "ONE_THUMBNAIL_VIEW") {
        console.log("uploaded file: ", uploadFile);
        if (localThumbnail.isEmpty) {
          toastUtils.error("Please select a thumbnail!");
        } else {
          const formData = new FormData();
          formData.append("thumbnail", uploadFile);
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
      } else if (modalView === "MULTI_THUMBNAIL_VIEW") {
      }
    } catch (error) {
      console.log("error: ", error);
      toastUtils.error("Could not update photo, please try again later.");
    }
  };

  console.log("localThumbnails: ", localThumbnails);
  console.log("single local thumbnail: ", localThumbnail);
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
      style={{
        content: {
          maxWidth: "702px",
          width: "90%",
        },
      }}
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
          <div>
            <p>
              Search for file to use as the thumbnail or copy and paste the
              filename
            </p>
          </div>
          <div className={styles.checkbox_option}>
            <div className={styles.checkbox4}>
              <IconClickable
                src={
                  modalView === "MULTI_THUMBNAIL_VIEW"
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => {
                  setModalView("MULTI_THUMBNAIL_VIEW");
                }}
              />
              <label style={{ paddingLeft: "13px" }}>4 Thumbnail Preview</label>
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
                  setModalView("ONE_THUMBNAIL_VIEW");
                }}
              />
              <label style={{ paddingLeft: "13px" }}>1 Thumbnail Preview</label>
            </div>
          </div>
        </div>
        <div>
          {modalView === "ONE_THUMBNAIL_VIEW" ? (
            localThumbnail.isEmpty || localThumbnail.isChanging ? (
              <SearchThumbnail
                index={localThumbnail.index}
                onUpload={(e) => handleUploadThumbnail(e, localThumbnail.index)}
                fileInputRef={fileBrowserRef}
                folderId={modalData.id}
                thumbnailState={localThumbnail}
                setThumbnailState={setLocalThumbnail}
              />
            ) : (
              <ChangeCollectionThumbnailRow
                index={localThumbnail.index}
                imgSrc={localThumbnail.src}
                imgName={localThumbnail.name}
                onUpload={(e) => handleUploadThumbnail(e, localThumbnail.index)}
                onDelete={(e) => handleDeleteThumbnail(e, localThumbnail.index)}
                onChangeThisOnly={(e) =>
                  handleChangeThisOnly(e, localThumbnail.index)
                }
                fileInputRef={fileBrowserRef}
              />
            )
          ) : (
            <>
              {localThumbnails.map((thumbnail) => {
                return thumbnail.isEmpty || thumbnail.isChanging ? (
                  <SearchThumbnail
                    index={thumbnail.index}
                    onUpload={(e) => handleUploadThumbnail(e, thumbnail.index)}
                    fileInputRef={FileBrowser[thumbnail.index]}
                    thumbnailState={localThumbnails}
                    setThumbnailState={setLocalThumbnails}
                  />
                ) : (
                  <ChangeCollectionThumbnailRow
                    index={thumbnail.index}
                    imgSrc={thumbnail.src}
                    imgName={thumbnail.name}
                    onUpload={(e) => handleUploadThumbnail(e, thumbnail.index)}
                    isUploading={IsUploading}
                    onDelete={(e) => handleDeleteThumbnail(e, thumbnail.index)}
                    fileInputRef={FileBrowser[thumbnail.index]}
                    onChangeThisOnly={(e) =>
                      handleChangeThisOnly(e, thumbnail.index)
                    }
                  />
                );
              })}
            </>
          )}
          <div className="row">
            <div className="col-12" style={{ width: "100%" }}>
              <div style={{ display: "flex", margin: "10px 26%" }}>
                <Button
                  text="Save"
                  onClick={handleSave}
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
        </div>
      </div>
    </ReactModal>
  );
};

export default ChangeThumbnail;
