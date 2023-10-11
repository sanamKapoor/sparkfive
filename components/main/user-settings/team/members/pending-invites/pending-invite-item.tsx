
import copyClipboard from "copy-to-clipboard";
import React, { useContext } from "react";

import { capitalCase } from "change-case";

import { AssetOps, Navigation } from "../../../../../../assets";
import { UserContext } from "../../../../../../context";
import { ITeamMember } from "../../../../../../interfaces/team/team";
import { checkExpireDate, getExpireDate } from "../../../../../../utils/team";
import toastUtils from "../../../../../../utils/toast";
import IconClickable from "../../../../../common/buttons/icon-clickable";
import styles from "../team-members/member.module.css";

interface PendingInviteItemProps {
  invite: ITeamMember;
  editAction: () => void;
  deleteAction: () => void;
  resend: (id: string) => void;
}

const PendingInviteItem: React.FC<PendingInviteItemProps> = ({
  invite,
  editAction,
  deleteAction,
  resend,
}) => {
  const { user } = useContext(UserContext);

  const copyLink = (code: string) => {
    copyClipboard(`${process.env.CLIENT_BASE_URL}/signup?inviteCode=${code}`);
    toastUtils.success("Link copied successfully");
  };

  return (
    <li className={styles.container}>
      <div className={styles["name-email-invite"]}>
        <div>{invite.email}</div>
      </div>
      <div className={styles.details_wrapper_invite}>
        <div className={styles["operation-buttons"]}>
          <div
            className={`${styles["expire-date"]} ${
              getExpireDate(invite.expirationDate, true)
                ? styles["red-text"]
                : styles["grey-text"]
            }`}
          >
            {getExpireDate(invite.expirationDate)} 
          </div>
          
          <div  className={`${styles["resend-button"]} ${
              !checkExpireDate(invite.expirationDate) ? styles["hidden"] : ""
            }`}>
            <IconClickable
              additionalClass={styles["resend-image"]}
              src={Navigation.alertBlue}
              tooltipText={"Resend"}
              tooltipId={"Resend"}
              onClick={() => {
                resend(invite.id);
              }}
            />
          </div>
          <div className={styles["copy-button"]}>
            <IconClickable
            additionalClass={`${styles['action-button']}`}
            src={AssetOps[`copy${""}`]}
              tooltipText={"Copy Link"}
              tooltipId={"Copy"}
              onClick={() => {
                copyLink(invite.code);
              }}
            />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.role}>{capitalCase(invite.role.name)}</div>
          <div className={styles.actions}>
            <div
              onClick={editAction}
              className={`${styles.action} ${
                user.id === invite.id ? styles.hidden : ""
              }`}
            >
              Edit
            </div>
            <div
              onClick={deleteAction}
              className={`${styles.action} ${
                user.id === invite.id ? styles.hidden : ""
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

export default PendingInviteItem;