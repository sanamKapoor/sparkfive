import styles from "./member-list.module.css";

// Components
import Member from "./member";

const MemberList = ({
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
