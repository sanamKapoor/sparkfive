import copyClipboard from "copy-to-clipboard";
import styles from "./member.module.css";

import toastUtils from "../../../../utils/toast";

import inviteApi from "../../../../server-api/invite";

import { capitalCase } from "change-case";
import { useContext } from "react";
import { UserContext } from "../../../../context";
import IconClickable from "../../../common/buttons/icon-clickable";

import { AssetOps, Navigation } from "../../../../assets";
import { ITeamMember } from "../../../../types/team/team";

interface IMemberProps extends ITeamMember {
  type: string;
  editAction: () => void;
  deleteAction: () => void;
  onReload: () => void;
}

const Member: React.FC<IMemberProps> = ({
  id,
  email,
  role,
  name,
  type,
  editAction,
  deleteAction,
  expirationDate,
  code,
  onReload,
}) => {
  const { user } = useContext(UserContext);

  const checkExpireDate = (date) => {
    return new Date() > new Date(date);
  };

  const getExpireDate = (date, boolean = false) => {
    if (new Date() > new Date(date)) {
      return boolean ? true : "Invite Link Expired";
    } else {
      return boolean ? false : `Invite Link Active`;
    }
  };

  const copyLink = (code) => {
    copyClipboard(`${process.env.CLIENT_BASE_URL}/signup?inviteCode=${code}`);
  };

  const resend = async (id) => {
    await inviteApi.resendInvite(id);

    toastUtils.success("Invitation sent successfully");

    onReload();
  };

  return (
    <li className={styles.container}>
      <div
        className={`${styles["name-email"]} ${
          type === "invite" ? styles["name-email-invite"] : ""
        }`}
      >
        <div>{name}</div>
        <div>{email}</div>
      </div>
      <div
        className={
          type === "invite"
            ? styles.details_wrapper_invite
            : styles.details_wrapper
        }
      >
        {type === "invite" && (
          <div className={styles["operation-buttons"]}>
            <div
              className={`${styles["expire-date"]} ${
                getExpireDate(expirationDate, true)
                  ? styles["red-text"]
                  : styles["grey-text"]
              }`}
            >
              {getExpireDate(expirationDate)}
            </div>
            <div
              className={`${styles["resend-button"]} ${
                !checkExpireDate(expirationDate) ? styles["hidden"] : ""
              }`}
            >
              <IconClickable
                additionalClass={styles["resend-image"]}
                src={Navigation.alertBlue}
                tooltipText={"Resend"}
                tooltipId={"Resend"}
                onClick={() => {
                  resend(id);
                }}
              />
            </div>
            <div className={styles["copy-button"]}>
              <IconClickable
                additionalClass={styles["action-button"]}
                src={AssetOps[`copy${""}`]}
                tooltipText={"Copy Link"}
                tooltipId={"Copy"}
                onClick={() => {
                  copyLink(code);
                }}
              />
            </div>
          </div>
        )}
        <div className={styles.details}>
          <div className={styles.role}>{capitalCase(role.name)}</div>
          <div className={styles.actions}>
            <div
              onClick={editAction}
              className={`${styles.action} ${
                user.id === id ? styles.hidden : ""
              }`}
            >
              Edit
            </div>
            <div
              onClick={deleteAction}
              className={`${styles.action} ${
                user.id === id ? styles.hidden : ""
              }`}
            >
              Delete
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Member;
