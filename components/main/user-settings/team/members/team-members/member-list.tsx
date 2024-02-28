import styles from "./member-list.module.css";

import { IEditType, ITeamMember } from "../../../../../../interfaces/team/team";
import Member from "./member";

interface MemberListProps {
  members: ITeamMember[];
  setSelectedMember: (data: ITeamMember) => void;
  setIsModalOpen: (val: boolean) => void;
  setIsEditMode: (val: boolean) => void;
  setEditType: (val: IEditType) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  setSelectedMember,
  setIsModalOpen,
  setIsEditMode,
  setEditType,
}) => {
  const onEditMember = (member: ITeamMember) => {
    setEditType("member");
    setIsEditMode(true);
    setSelectedMember({ ...member });
  };

  const onDeleteMember = (member: ITeamMember) => {
    setEditType("member");
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
