import { snakeCase } from "change-case";
import copy from "copy-to-clipboard";
import { useContext, useEffect, useState } from "react";
import { Utilities } from "../../../assets";
import { TeamContext } from "../../../context";
import styles from "./share-folder-modal.module.css";

// Components
import Button from "../../common/buttons/button";
import IconClickable from "../../common/buttons/icon-clickable";
import Input from "../../common/inputs/input";
import Select from "../../common/inputs/select";
import TextArea from "../../common/inputs/text-area";
import Base from "../../common/modals/base";

const SHARE_STATUSES = [
  {
    label: "Disabled",
    value: "disabled",
  },
  {
    label: "Public (anyone with the link)",
    value: "public",
  },
  {
    label: "Private (password protected)",
    value: "private",
  },
];

const ShareFolderModal = ({ modalIsOpen, closeModal, shareAssets, folder }) => {
  const { team } = useContext(TeamContext);

  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [shareStatus, setShareStatus] = useState(null);
  const [sendNotification, setSendNotification] = useState(false);
  const [password, setPassword] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (folder) {
      setShareStatus(
        SHARE_STATUSES.find(({ value }) => folder.shareStatus === value) ||
          SHARE_STATUSES[0]
      );
      setSendNotification(false);
      const splitShareUrl = folder.sharePath?.split("/");
      setCustomUrl(
        snakeCase(
          splitShareUrl ? splitShareUrl[splitShareUrl.length - 1] : folder.name
        )
      );
      setPassword(folder.sharePassword || "");
    }
  }, [folder]);

  const closemoveModal = () => {
    setRecipients("");
    setMessage("");
    setPassword("");
    closeModal();
  };

  const onSharestatusChange = (selected) => {
    setShareStatus(selected);
  };

  const onCustomUrlChange = (e) => {
    const inputValue = e.target.value;
    const pattern = new RegExp(/^[-a-z\\d%_.~+]*$/);
    if (pattern.test(inputValue)) {
      setCustomUrl(inputValue);
    }
  };

  const toggleShowPassword = () => {
    if (!showPassword) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  };

  const saveChanges = (withNotification = false) => {
    const shareObj = {
      shareStatus: shareStatus.value,
      newPassword: password,
      customUrl,
      notificationSettings: {},
    };

    if (withNotification) {
      shareObj.notificationSettings = {
        collection: folder.name,
        recipients,
        message,
        send: sendNotification,
      };
    }

    shareAssets(shareObj);
  };

  const idChars = folder?.id?.substring(0, 10);
  const shareUrl = `${process.env.CLIENT_BASE_URL}/collections/${
    team?.company ? snakeCase(team.company) : "sparkfive"
  }/${idChars}/`;
  const textUrl = `.../collections/${
    team?.company ? snakeCase(team.company) : "sparkfive"
  }/${idChars}/`;

  const copyShareLink = () => copy(`${shareUrl}${customUrl}`);

  return (
    <Base
      modalIsOpen={modalIsOpen}
      closeModal={closemoveModal}
      confirmText={"Save"}
      headText={`Share ${folder?.name} collection`}
      disabledConfirm={!customUrl}
      additionalClasses={[`${styles["modal-share-folder"]}`]}
      textWidth={true}
      confirmAction={() => {
        saveChanges();
        closemoveModal();
      }}
    >
      <div className={`${styles["container-info"]}`}>
        <div className={`${styles["container-select"]}`}>
          <Select
            styleType="regular"
            options={SHARE_STATUSES}
            onChange={onSharestatusChange}
            value={shareStatus}
            placeholder="Select share status"
          />
        </div>
        {shareStatus?.value !== "disabled" && (
          <>
            <div className={`${styles["shared-url"]}`}>
              <div>{textUrl}</div>
              <input
                onChange={onCustomUrlChange}
                value={customUrl}
                className={`${styles["input-container"]}`}
              />
            </div>
            <Button
              text="Copy Link"
              type="button"
              onClick={copyShareLink}
              styleType={"secondary"}
            />
          </>
        )}
        {shareStatus?.value === "private" && (
          <div className={`${styles["share-password"]}`}>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={"Share password"}
              onChange={(e) => setPassword(e.target.value)}
              styleType={"regular-short"}
              value={password}
            />
            <div
              onClick={toggleShowPassword}
              className={`${styles["container-show-password"]}`}
            >
              <IconClickable
                src={
                  showPassword
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
              />
              Show Password
            </div>
          </div>
        )}
        <div
          onClick={() => setSendNotification(!sendNotification)}
          className={`${styles["container-send-notification"]}`}
        >
          <IconClickable
            src={
              sendNotification
                ? Utilities.radioButtonEnabled
                : Utilities.radioButtonNormal
            }
          />
          Send notification with link and password (if enabled)
        </div>
        {sendNotification && (
          <>
            <div className={styles["input-wrapper"]}>
              <Input
                placeholder={"Emails separated with comma"}
                onChange={(e) => setRecipients(e.target.value)}
                styleType={"regular-short"}
              />
            </div>
            <div className={styles["input-wrapper"]}>
              <TextArea
                placeholder={"Add a message (optional)"}
                rows={7}
                onChange={(e) => setMessage(e.target.value)}
                styleType={"regular-short"}
                noResize={true}
              />
            </div>
            <div className={styles["input-wrapper"]}>
              <Button
                text="Send"
                type="button"
                onClick={() => saveChanges(true)}
                styleType={"secondary"}
              />
            </div>
          </>
        )}
      </div>
    </Base>
  );
};

export default ShareFolderModal;
