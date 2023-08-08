import styles from "./member-list.module.css";

// Components
import { ITeamMember } from "../../../../types/team/team";
import Member from "./member";

interface MemberListProps {
  members: ITeamMember[];
  type: string;
  setSelectedMember: (data: { member: ITeamMember; type: string }) => void;
  setSelectedDeleteMember: (data: {
    member: ITeamMember;
    type: string;
  }) => void;
  onReload: () => {};
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  type = "member",
  setSelectedMember,
  setSelectedDeleteMember,
  onReload = () => {},
}) => {
  const selectMember = (member) => {
    setSelectedMember({
      member,
      type,
    });
  };

  const selectForDelete = (member) => {
    setSelectedDeleteMember({
      member,
      type,
    });
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
            profilePhoto={member.profilePhoto}
            role={member.role}
            type={type}
            code={member.code}
            expirationDate={member.expirationDate}
            editAction={() => selectMember(member)}
            deleteAction={() => selectForDelete(member)}
            onReload={onReload}
          />
        ))}
      </ul>
    </>
  );
};

export default MemberList;
