import { useEffect, useState } from "react";
import styles from "../../index.module.css";

import inviteApi from "../../../../../../server-api/invite";
import { ITeamMember } from "../../../../../../types/team/team";
import PendingInviteItem from "./pending-invite-item";

interface PendingInvitesProps {
  setIsEditMode: (val: boolean) => void;
  setSelectedMember: (member: ITeamMember) => void;
}

const PendingInvites: React.FC<PendingInvitesProps> = ({
  setIsEditMode,
  setSelectedMember,
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

  const onEditInvite = async (id: string) => {};

  const onDeleteInvite = (id: string) => {};

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
            editAction={() => onEditInvite(invite.id)}
            deleteAction={() => onDeleteInvite(invite.id)}
            key={invite.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default PendingInvites;
