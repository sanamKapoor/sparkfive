import styles from "./member-list.module.css";

import { ITeamMember } from "../../../../../../types/team/team";
import Member from "./member";

interface MemberListProps {
  members: ITeamMember[];
  setSelectedMember: (data: ITeamMember) => void;
  setIsModalOpen: (val: boolean) => void;
  setIsEditMode: (val: boolean) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  setSelectedMember,
  setIsModalOpen,
  setIsEditMode,
}) => {
  const onEditMember = (member: ITeamMember) => {
    setIsEditMode(true);
    setSelectedMember({ ...member });
  };

  const onDeleteMember = (member: ITeamMember) => {
    setSelectedMember({ ...member });
    setIsModalOpen(true);
  };

  return (
    <>
      <ul className={styles.container}>
        {members.map((member) => (
          <Member
            key={member.id}
            id={member.id}
            email={member.email}
            name={member.name}
            role={member.role}
            editAction={() => onEditMember(member)}
            deleteAction={() => onDeleteMember(member)}
          />
        ))}
      </ul>
    </>
  );
};

export default MemberList;
