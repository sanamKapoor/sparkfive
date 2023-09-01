import copy from "copy-to-clipboard";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

// APIs
import guestUploadApi from "../../../../server-api/guest-upload";
import Button from "../../buttons/button";
import Input from "../../inputs/input";
import ConfirmModal from "../../modals/confirm-modal";
import SpinnerOverlay from "../../spinners/spinner-overlay";
import OptionList from "./option-list";

// Utils
import { AppImg, AssetOps, Utilities } from "../../../../assets";
import toastUtils from "../../../../utils/toast";
import IconClickable from "../../buttons/icon-clickable";
import Select from "../../inputs/select";

// Maximum links
import {
  BANNER_ACCEPT_FILE_TYPES,
  BANNER_ALLOWED_SIZE,
  BANNER_ALLOWED_TYPES,
  BANNER_MIN_HEIGHT,
  BANNER_MIN_WIDTH,
  maximumLinks,
  statusList,
} from "../../../../constants/guest-upload";
import {
  IGuestUploadLink,
  ILinkDefaultPayload,
} from "../../../../interfaces/guest-upload/guest-upload";
import ButtonIcon from "../../buttons/button-icon";

const Links = () => {
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<string>();

  const [links, setLinks] = useState<IGuestUploadLink[]>([]);
  const [currentLink, setCurrentLink] = useState<string>();
  const [password, setPassword] = useState<string>("");
  const [showPasswordId, setShowPasswordId] = useState<string>();

  const fileInputRefs = {};

  const getLinks = async () => {
    try {
      setLoading(true);

      let { data } = await guestUploadApi.getLinks({
        isAll: 1,
        sort: "createdAt,asc",
      });

      if (data.length > 0) {
        setLinks(data);
      }
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLinks();
  }, []);

  const deleteLink = async (id: string) => {
    try {
      setConfirmDeleteModal(false);

      setLoading(true);

      const res = await guestUploadApi.deleteLink({ linkIds: [id] });

      const updatedLinks = [
        ...links.filter((link) => link.id !== res.data.linkIds[0]),
      ];
      setLinks(updatedLinks);
      toastUtils.success("link deleted successfully.");
    } catch (err) {
      toastUtils.error("Failed to delete the link.");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onStatusChange = (
    item: { value: "public" | "private"; label: string },
    id: string
  ) => {
    const currentLinkIndex = links.findIndex((link) => link.id === id);
    if (currentLinkIndex !== -1) {
      if (links[currentLinkIndex].status !== item.value) {
        setCurrentLink(id);

        links[currentLinkIndex].status = item.value;
        setLinks([...links]);
      }
    }
  };

  const showPassword = (id: string) => {
    setShowPasswordId((prevId) => {
      if (prevId === id) {
        return undefined;
      } else return id;
    });
  };

  const passwordOperations = [
    {
      value: true,
      label: "Show Password",
    },
  ];

  const copyLink = (url: string) => {
    copy(`${process.env.CLIENT_BASE_URL}/guest-upload?code=${url}`);
    toastUtils.bottomSuccess("Link is copied.");
  };

  const createOrUpdateLink = async (
    payload: IGuestUploadLink | ILinkDefaultPayload
  ) => {
    const response = await guestUploadApi.createLink({
      links: [payload],
    });

    return response.data;
  };

  const createNewLink = async () => {
    try {
      setLoading(true);
      const payload = {
        id: null,
        url: "",
        password: "",
        values: [],
        status: "public",
        default: true,
      };

      const res = await createOrUpdateLink(payload);

      if (res.length > 0) {
        setLinks([...links, ...res]);
      }
      toastUtils.success("Upload link has been created.");
    } catch (err) {
      toastUtils.error("Could not create new link.");
    } finally {
      setLoading(false);
    }
  };

  const saveStatusChanges = async (id: string) => {
    try {
      setLoading(true);
      const currentLinkIndex = links.findIndex((link) => link.id === id);

      if (currentLinkIndex !== -1) {
        if (links[currentLinkIndex].status === "private") {
          links[currentLinkIndex].password = password;
        }
        const currentLink = links[currentLinkIndex];
        await createOrUpdateLink(currentLink);
      }
      toastUtils.success("Upload link changes saved.");
      setCurrentLink(undefined);
      setPassword("");
    } catch (err) {
      toastUtils.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const fileMeta = e.target.files[0];

    if (!BANNER_ALLOWED_TYPES.includes(fileMeta.type)) {
      toastUtils.error("File type is not allowed.");
    }

    if (fileMeta.size > BANNER_ALLOWED_SIZE) {
      toastUtils.error("Banner size should not be more than 10 MB");
    }

    const image = new Image();
    image.src = window.URL.createObjectURL(fileMeta);

    image.onload = () => {
      if (image.width < BANNER_MIN_WIDTH || image.height < BANNER_MIN_HEIGHT) {
        toastUtils.error("File must be at least 1920 x 300");
      }
    };
    await uploadBanner(fileMeta, id);
    if (fileInputRefs[id]) {
      fileInputRefs[id].value = "";
    }
  };

  const openUploadDialog = (e, id: string) => {
    fileInputRefs[id]?.click();
  };

  const uploadBanner = async (file: File, id: string) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("banner", file);
      const res = await guestUploadApi.uploadBanner(id, formData);

      const linkIndex = links.findIndex((link) => link.id === id);
      if (linkIndex !== -1) {
        links[linkIndex].bannerSrc = res.data.bannerSrc;
        setLinks([...links]);
        toastUtils.success("Banner uploaded successfully");
      }
    } catch (error) {
      toastUtils.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["main-wrapper"]}>
      <h3>Guest Upload Links</h3>

      {links.length < maximumLinks && (
        <div className={`add ${styles["select-add"]}`} onClick={createNewLink}>
          <IconClickable src={Utilities.add} />
          <span>Add New (Up to {maximumLinks} Allowed)</span>
        </div>
      )}

      {links.map((field, index) => (
        <div className={styles.item} key={index}>
          <div className={styles.row}>
            <div className={styles.item_title}>Link URL</div>
            <Input
              value={`${process.env.CLIENT_BASE_URL}/guest-upload?code=${field.url}`}
              disabled
              placeholder={"Link URL"}
              styleType={"regular-short"}
            />
            <Button
              className={"container exclude-min-height primary"}
              type={"button"}
              text="Copy Link"
              onClick={(e) => {
                copyLink(field.url);
              }}
            />
            <IconClickable
              additionalClass={styles["action-button"]}
              src={AssetOps.deleteGray}
              tooltipText={"Delete"}
              tooltipId={"Delete"}
              onClick={() => {
                setCurrentDeleteId(field.id);
                setConfirmDeleteModal(true);
              }}
            />
          </div>

          <div className={`${styles.row} align-items-start`}>
            <div className={styles.input}>
              <label>Status</label>
              <Select
                options={statusList}
                additionalClass={"primary-input-height"}
                onChange={(selected) => onStatusChange(selected, field.id)}
                placeholder={"Select status"}
                styleType="regular"
                value={
                  statusList.filter((item) => item.value === field.status)[0]
                }
              />
            </div>
            <div className={styles.privateBlock}>
              <div>
                {field.status === "private" && (
                  <>
                    <div className={styles.input}>
                      <label>Password</label>
                      <Input
                        type={showPasswordId === field.id ? "text" : "password"}
                        onChange={onPasswordChange}
                        value={password}
                        placeholder={"Password"}
                        styleType={"regular-short"}
                      />

                      {password.length > 0 && (
                        <OptionList
                          data={passwordOperations}
                          oneColumn={true}
                          value={showPasswordId === field.id}
                          additionalClass={styles["password-li"]}
                          setValue={(value) => {
                            showPassword(field.id);
                          }}
                          toggle={true}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className={styles.passwordSave}>
                {((currentLink && currentLink === field.id) ||
                  field.status === "private") && (
                  <Button
                    className={"container exclude-min-height primary"}
                    type={"button"}
                    text={"Save"}
                    disabled={
                      field.status === "private" && password.length === 0
                    }
                    onClick={() => saveStatusChanges(field.id)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className={`${styles.row} align-items-end`}>
            <div className={styles.banner}>
              <label>Custom Banner (Must be at least 1920 x 300)</label>
              <div className={styles.banner_wrapper}>
                <img src={field.bannerSrc ?? AppImg.guestCover} />
              </div>
            </div>

            <ButtonIcon
              className={styles.uploadbtn}
              icon={Utilities.addAlt}
              text="UPLOAD PHOTO"
              onClick={(e) => openUploadDialog(e, field.id)}
            />
            <input
              id="file-input-id"
              ref={(input) => (fileInputRefs[field.id] = input)}
              style={{ display: "none" }}
              type="file"
              onChange={(e) => onFileChange(e, field.id)}
              accept={BANNER_ACCEPT_FILE_TYPES}
            />
          </div>
        </div>
      ))}

      <ConfirmModal
        modalIsOpen={confirmDeleteModal}
        closeModal={() => {
          setConfirmDeleteModal(false);
        }}
        confirmAction={() => {
          deleteLink(currentDeleteId);
        }}
        confirmText={"Delete"}
        message={
          <span>
            This link will be deleted. People will not access to it anymore. Are
            you sure you want to delete this?
          </span>
        }
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />

      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default Links;
