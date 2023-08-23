import { ITeamMember } from "../../../../../../types/team/team";
import styles from "../team-members/member-list.module.css";

// Components
import Request from "./request";

interface RequestAccessListProps {
  members: ITeamMember[];
  type: string;
  onChange: (type: string, member: ITeamMember) => void;
}

const RequestAccessList: React.FC<RequestAccessListProps> = ({
  members,
  type = "member",
  onChange,
}) => {
  return (
    <>
      <ul className={styles.container}>
        {members.map((member) => (
          <Request
            key={member.id}
            id={member.id}
            email={member.email}
            name={member.name}
            onChange={(type) => {
              onChange(type, member);
            }}
          />
        ))}
      </ul>
    </>
  );
};

export default RequestAccessList;
