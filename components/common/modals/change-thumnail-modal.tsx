import { useContext, useEffect, useRef, useState } from "react";
import ReactModal from "react-modal";
import blueClose from "../../../assets/Icons/Utilities/Close/blue-close.svg";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import toastUtils from "../../../utils/toast";
import styles from "./change-thumnail-modal.module.css";
// Components
import { Assets, Utilities } from "../../../assets";
import { AssetContext, FilterContext, LoadingContext } from "../../../context";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";

import { defaultChangeThumbnailModalView } from "../../../constants/asset-associate";
import {
  ALL_THUMBNAILS_REQUIRED,
  ERR_IN_UPDATING_THUMBNAIL,
  THUMBNAIL_REQUIRED,
  THUMBNAIL_UPDATED,
} from "../../../constants/messages";
import ChangeCollectionThumbnailRow from "../folder/change-collection-thumbnail-row";
import SearchThumbnail from "../inputs/search-thumbnail";

ReactModal.defaultStyles = {};

// Used for the upload thumbnail for collection
const ChangeThumbnail = ({
  modalIsOpen,
  modalData,
  closeModal = false,
  textWidth = false,
  noHeightMax = false,
  additionalClasses = [""],
  closeButtonOnly = false,
}) => {
  const initialModalView =
    !modalData?.thumbnailPath && !modalData?.thumbnailExtension
      ? defaultChangeThumbnailModalView
      : "ONE_THUMBNAIL_VIEW";

  const initialThumbnailsData = modalData?.thumbnails?.thumbnails
    ? modalData?.thumbnails?.thumbnails.map((thumb) => {
        const name = decodeURI(thumb.storageId?.split("/").at(-1));

        return {
          index: thumb.index,
          name: thumb.name,
          src: thumb.filePath ? thumb.filePath : Assets.empty,
          isEmpty: false,
          isChanging: false,
          mode: "",
          data: thumb,
        };
      })
    : ["1", "2", "3", "4"].map((index) => {
        return {
          index,
          name: "",
          src: "",
          isEmpty: true,
          isChanging: false,
          mode: "",
          data: null,
        };
      });

  const initialLocalThumbnail = modalData?.thumbnailPath
    ? {
        index: "0",
        name: modalData?.thumbnailName,
        src: modalData?.thumbnailPath,
        isEmpty: false,
        isChanging: false,
        mode: "",
        data: null,
      }
    : {
        index: "0",
        name: "",
        src: "",
        isEmpty: true,
        isChanging: false,
        mode: "",
        data: null,
      };

  const [modalView, setModalView] = useState(initialModalView);
  const [localThumbnails, setLocalThumbnails] = useState(initialThumbnailsData);
  const [localThumbnail, setLocalThumbnail] = useState(initialLocalThumbnail);

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

  const { setIsLoading } = useContext(LoadingContext);
  const { setFolders, folders } = useContext(AssetContext);
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
    setModalView(initialModalView);
    setLocalThumbnails(initialThumbnailsData);
    setLocalThumbnail(initialLocalThumbnail);
  }, [modalData]);

  //Refresh data after thumbnail changed
  const getFolders = async () => {
    let query = {
      page: 1,
      sortField: activeSortFilter.sort?.field || "createdAt",
      sortOrder: activeSortFilter.sort?.order || "desc",
    };
    const { data } = await folderApi.getFolders(query);
    setFolders(data, true, true);
    toastUtils.success(THUMBNAIL_UPDATED);
    setIsLoading(false);
    closeModal();
  };

  const openFile = async (index) => {
    if (index == 1) fileBrowseForFirstIndex.current?.click();
    else if (index == 2) fileBrowseForSecondtIndex.current?.click();
    else if (index == 3) fileBrowseForThirdtIndex.current?.click();
    else if (index == 4) fileBrowseForFourtIndex.current?.click();
    else fileBrowserRef.current?.click();
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
    const file = e.target.files[0];
    openFile(index);

    if (index === "0") {
      setLocalThumbnail({
        ...localThumbnail,
        name: file.name,
        src: URL.createObjectURL(file),
        isEmpty: false,
        isChanging: false,
        mode: "UPLOAD",
        data: file,
      });
    } else {
      const localThumbnailsCopy = [...localThumbnails];
      const findThumbnail = localThumbnails.findIndex((thumb) => {
        return thumb.index === index;
      });

      if (findThumbnail !== -1) {
        localThumbnailsCopy[findThumbnail] = {
          index,
          name: file.name,
          src: URL.createObjectURL(file),
          isEmpty: false,
          isChanging: false,
          mode: "UPLOAD",
          data: file,
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
    closeModal();
  };

  const saveSingleThumbnail = async () => {
    setIsLoading(true);
    if (localThumbnail.mode === "UPLOAD") {
      const formData = new FormData();
      formData.append("thumbnail", localThumbnail.data);
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
            thumbnailName: data[0].asset.name,
          }
        );
      }
    } else {
      await folderApi.updateFolder(modalData.id + `?folderId=${modalData.id}`, {
        thumbnailPath: localThumbnail.data?.value,
        thumbnail_extension: localThumbnail.data?.extension,
        thumbnails: { thumbnails: null },
        thumbnailStorageId: localThumbnail.data?.storageId,
        thumbnailName: localThumbnail.data?.name,
      });
    }
    getFolders();
  };

  const validateSave = (thumbnails) => {
    const itemUndefined = thumbnails.some((item) => !item);

    const isUpdating = localThumbnails.some(
      (item) => item.isChanging || item.isEmpty
    );

    if (itemUndefined || isUpdating) {
      toastUtils.error(ALL_THUMBNAILS_REQUIRED);
      setIsLoading(false);
      return false;
    } else if (
      JSON.stringify(thumbnails) ===
      JSON.stringify(modalData?.thumbnails?.thumbnails)
    ) {
      closeModal();
      return false;
    }

    return true;
  };

  const saveMultiThumbnails = async () => {
    let thumbnails = [];
    const promises = [];
    const indexes = [];

    for (let i = 0; i < localThumbnails.length; i++) {
      let obj;

      if (localThumbnails[i].mode === "URL") {
        obj = {
          index: localThumbnails[i].index,
          filePath: localThumbnails[i].data?.value,
          extension: localThumbnails[i].data?.extension,
          storageId: localThumbnails[i].data?.storageId,
          name: localThumbnails[i].data?.name,
        };

        thumbnails.push(obj);
      } else if (localThumbnails[i].mode === "UPLOAD") {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("thumbnail", localThumbnails[i].data);

        promises.push(
          assetApi.uploadThumbnail(formData, {
            folderId: modalData.id,
          })
        );

        indexes.push(localThumbnails[i].index);
      } else {
        const findExisting = modalData?.thumbnails?.thumbnails.findIndex(
          (data) => data.index === localThumbnails[i].index
        );

        if (findExisting !== -1) {
          thumbnails.push(modalData?.thumbnails?.thumbnails[findExisting]);
        }
      }
    }

    const promisesResolved = await Promise.all(promises);

    promisesResolved.forEach((promise, i) => {
      if (promise.data.length > 0) {
        const obj = {
          index: indexes[i],
          filePath: promise.data[0]?.thumbailUrl,
          extension: promise.data[0]?.asset.extension,
          storageId: promise.data[0]?.asset.storageId,
          name: promise.data[0]?.asset.name,
        };
        thumbnails.push(obj);
      }
    });

    const isSaveValid = validateSave(thumbnails);

    if (isSaveValid) {
      setIsLoading(true);
      thumbnails.sort(
        (first, second) => Number(first.index) - Number(second.index)
      );
      //update on the backend
      await folderApi.updateFolder(modalData.id + `?folderId=${modalData.id}`, {
        thumbnailPath: null,
        thumbnailExtension: null,
        thumbnails: { thumbnails },
        thumbnailName: null,
      });
      getFolders();
    }
  };

  const handleSave = async () => {
    try {
      if (modalView === "ONE_THUMBNAIL_VIEW") {
        if (localThumbnail && localThumbnail.isEmpty) {
          toastUtils.error(THUMBNAIL_REQUIRED);
        } else {
          saveSingleThumbnail();
        }
      } else if (modalView === "MULTI_THUMBNAIL_VIEW") {
        saveMultiThumbnails();
      }
    } catch (error) {
      setIsLoading(false);
      toastUtils.error(ERR_IN_UPDATING_THUMBNAIL);
    }
  };

  return (
    <ReactModal
      isOpen={modalIsOpen}
      className={`${styles.modal} ${styles.changeThumb} ${
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
        {
          <p className={(styles["overflow-text"], styles["modalTitle"])}>
            Change Thumbnail
          </p>
        }
        <span className={styles.close} onClick={closeModal}>
          <img src={blueClose} alt={"close"} className={styles.closebtn} />
        </span>
      </div>
      <div>
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
        <div className={styles.changeThumbOuter}>
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
                changeThisImgText="Change this image"
              />
            )
          ) : (
            <>
              {localThumbnails.map((thumbnail) => {
                return thumbnail.isEmpty || thumbnail.isChanging ? (
                  <SearchThumbnail
                    key={thumbnail.index}
                    index={thumbnail.index}
                    onUpload={(e) => handleUploadThumbnail(e, thumbnail.index)}
                    fileInputRef={FileBrowser[thumbnail.index]}
                    thumbnailState={localThumbnails}
                    setThumbnailState={setLocalThumbnails}
                    folderId={modalData?.id}
                  />
                ) : (
                  <ChangeCollectionThumbnailRow
                    key={thumbnail.index}
                    index={thumbnail.index}
                    imgSrc={thumbnail.src}
                    imgName={thumbnail.name}
                    onUpload={(e) => handleUploadThumbnail(e, thumbnail.index)}
                    onDelete={(e) => handleDeleteThumbnail(e, thumbnail.index)}
                    fileInputRef={FileBrowser[thumbnail.index]}
                    onChangeThisOnly={(e) =>
                      handleChangeThisOnly(e, thumbnail.index)
                    }
                    changeThisImgText="Change this image only"
                  />
                );
              })}
            </>
          )}
          <div className="row">
            <div className="col-12" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  margin: "10px 0",
                  justifyContent: "center",
                }}
              >
                <Button
                  text="Save"
                  onClick={handleSave}
                  type="button"
                  className={`${styles.button} ${styles.mr} container primary`}
                />
                <Button
                  text="Cancel"
                  onClick={handleCancel}
                  type="button"
                  className={`${styles.button} ${styles.mr} ${styles.cancel} container secondary`}
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
