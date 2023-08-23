import { useEffect, useState } from "react";
import styles from "../../index.module.css";

import inviteApi from "../../../../../../server-api/invite";
import { IEditType, ITeamMember } from "../../../../../../types/team/team";
import PendingInviteItem from "./pending-invite-item";

interface PendingInvitesProps {
  setIsEditMode: (val: boolean) => void;
  setSelectedMember: (member: ITeamMember) => void;
  setIsModalOpen: (val: boolean) => void;
  setEditType: (val: IEditType) => void;
}

const PendingInvites: React.FC<PendingInvitesProps> = ({
  setIsEditMode,
  setSelectedMember,
  setIsModalOpen,
  setEditType,
}) => {
  const [invites, setInvites] = useState<ITeamMember[]>([]);

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

  return (
    <div className={styles.content}>
      <div className={`${styles["main-headers"]} m-t-40`}>
        <h3>Pending Invites</h3>
      </div>
      <ul>
        {invites.map((invite) => (
          <PendingInviteItem
            invite={invite}
            setInvites={setInvites}
            editAction={() => onEditInvite(invite)}
            deleteAction={() => onDeleteInvite(invite)}
            key={invite.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default PendingInvites;
