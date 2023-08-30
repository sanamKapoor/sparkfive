import { ITeamMember } from "../../../../../../types/team/team";
import styles from "../team-members/member-list.module.css";

// Components
import Request from "./request";

interface RequestAccessListProps {
  members: ITeamMember[];
  type: string;
  onChange: (type: string, member: ITeamMember) => void;
  setSelectedRequest: (val) => void;
  setShowReviewModal: (val: boolean) => void;
}

const RequestAccessList: React.FC<RequestAccessListProps> = ({
  members,
  type = "member",
  onChange,
  setSelectedRequest,
  setShowReviewModal,
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
              if (type === "review") {
                setShowReviewModal(true);
                setSelectedRequest(member);
              } else {
                setShowReviewModal(false);
              }
              onChange(type, member);
            }}
          />
        ))}
      </ul>
    </>
  );
};

export default RequestAccessList;
