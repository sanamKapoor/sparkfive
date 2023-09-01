import { IRequestFormData } from "../../../../../../types/team/team";
import styles from "../team-members/member-list.module.css";

import Request from "./request";

interface RequestAccessListProps {
  members: IRequestFormData[];
  type: string;
  onChange: (type: string, member: IRequestFormData) => void;
  setSelectedRequest: (val: IRequestFormData) => void;
  setShowReviewModal: (val: boolean) => void;
  selectedRequest: IRequestFormData;
}

const RequestAccessList: React.FC<RequestAccessListProps> = ({
  members,
  onChange,
  setSelectedRequest,
  setShowReviewModal,
  selectedRequest,
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
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
            onChange={(type) => {
              if (type === "review") {
                setShowReviewModal(true);
              } else {
                setShowReviewModal(false);
              }
              onChange(type, { ...member, ...selectedRequest });
            }}
          />
        ))}
      </ul>
    </>
  );
};

export default RequestAccessList;
