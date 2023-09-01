import { useEffect } from "react";
import styles from "../../index.module.css";

import { IEditType, ITeamMember } from "../../../../../../interfaces/team/team";
import inviteApi from "../../../../../../server-api/invite";
import toastUtils from "../../../../../../utils/toast";
import PendingInviteItem from "./pending-invite-item";

interface PendingInvitesProps {
  invites: ITeamMember[];
  setInvites: (data: ITeamMember[]) => void;
  setIsEditMode: (val: boolean) => void;
  setSelectedMember: (member: ITeamMember) => void;
  setIsModalOpen: (val: boolean) => void;
  setEditType: (val: IEditType) => void;
}

const PendingInvites: React.FC<PendingInvitesProps> = ({
  invites,
  setInvites,
  setIsEditMode,
  setSelectedMember,
  setIsModalOpen,
  setEditType,
}) => {
  const getInvites = async () => {
    try {
      const { data } = await inviteApi.getInvites();
      setInvites(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getInvites();
  }, []);

  const onEditInvite = async (invite: ITeamMember) => {
    setEditType("invite");
    setIsEditMode(true);
    setSelectedMember({ ...invite });
  };

  const onDeleteInvite = (invite: ITeamMember) => {
    setEditType("invite");
    setSelectedMember({ ...invite });
    setIsModalOpen(true);
  };

  const resend = async (id: string) => {
    const { data } = await inviteApi.resendInvite(id);
    const inviteIndex = invites.findIndex((invite) => invite.id === id);

    if (inviteIndex !== -1) {
      invites[inviteIndex].expirationDate = data.expirationDate;
      setInvites([...invites]);
    }
    toastUtils.success("Invitation sent successfully");
  };

  return (
    <div className={styles.content}>
      <div className={`${styles["main-headers"]} m-t-40`}>
        <h3>Pending Invites</h3>
      </div>
      <ul>
        {invites.map((invite) => (
          <PendingInviteItem
            invite={invite}
            editAction={() => onEditInvite(invite)}
            deleteAction={() => onDeleteInvite(invite)}
            resend={resend}
            key={invite.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default PendingInvites;
