import styles from "../../index.module.css";
import RequestAccessList from "./request-access-list";

interface AccessRequestsProps {
  requests: any;
  onRequestChange: (type: string, request) => void;
}

const AccessRequests: React.FC<AccessRequestsProps> = ({
  requests,
  onRequestChange,
}) => {
  return (
    <div className={styles.content}>
      <div className={`${styles["main-headers"]} m-t-40`}>
        <h3>Access Requests</h3>
      </div>
      <RequestAccessList
        members={requests}
        type="invite"
        onChange={onRequestChange}
      />
    </div>
  );
};

export default AccessRequests;
