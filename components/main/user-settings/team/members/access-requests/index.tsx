import styles from "../../index.module.css";
import RequestAccessList from "./request-access-list";

interface AccessRequestsProps {
  requests: any;
  onRequestChange: (type: string, request) => void;
  setSelectedRequest: (val) => void;
  setShowReviewModal: (val: boolean) => void;
}

const AccessRequests: React.FC<AccessRequestsProps> = ({
  requests,
  onRequestChange,
  setSelectedRequest,
  setShowReviewModal,
}) => {
  return (
    <div className={styles.content}>
      <div className={`${styles["main-headers"]} m-t-40`}>
        <h3>Access Requests</h3>
      </div>
      {requests.length > 0 ? (
        <RequestAccessList
          members={requests}
          type="invite"
          onChange={onRequestChange}
          setSelectedRequest={setSelectedRequest}
          setShowReviewModal={setShowReviewModal}
        />
      ) : (
        <p>No requests at the moment.</p>
      )}
    </div>
  );
};

export default AccessRequests;
